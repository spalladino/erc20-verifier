from chalice import Chalice
from chalice import BadRequestError, NotFoundError
from requests import get
from tempfile import TemporaryFile, TemporaryDirectory
from os import chdir, getcwd, path
from erc20 import erc20
from io import StringIO
from contextlib import redirect_stdout

app = Chalice(app_name='erc20-verifier')

ETHERSCAN_API_KEY = 'API_KEY'

@app.route('/verify/{address}', methods=['GET'])
def verify(address):
  # Validate input
  if not address or len(address) == 0:
    raise BadRequestError("Address not set")
  if len(address) != 40 and len(address) != 42:
    raise BadRequestError("Malformed address %s" % (address,))
  
  # Get source from etherscan
  name, source = get_name_and_source(address)
  
  # Get path to solc
  workdir = getcwd()
  solc = path.join(workdir, "vendor", "solc-0.5.12")
  
  # Run in tempdir
  with TemporaryDirectory() as tmpdir:
    
    # Write source to disk
    chdir(tmpdir)
    filename = path.join(tmpdir, "%s.sol" % (name,))
    with open(filename, "w") as contractfile:
      contractfile.write(source)
    
    # Capture stdout and run slither
    output = StringIO()
    with redirect_stdout(output):
      erc20.run(filename, name, solc=solc)

  return { "name": name, "output": output.getvalue(), "source": source }

def get_name_and_source(address):
  url = "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=%s&apikey=%s" % (address, ETHERSCAN_API_KEY)
  response = get(url).json()
  if response["status"] != "1":
    raise NotFoundError("Error requesting source from etherscan: %s" % (response["message"],))

  return (
    response["result"][0]["ContractName"],
    response["result"][0]["SourceCode"]
  )
  