from chalice import Chalice
from chalice import BadRequestError, NotFoundError
from requests import get
from tempfile import TemporaryFile, TemporaryDirectory
from os import chdir, getcwd, path
from chalicelib.erc20 import erc20
from io import StringIO
from contextlib import redirect_stdout
from logging import INFO

app = Chalice(app_name='erc20-verifier')
app.log.setLevel(INFO)

LOCAL = False
ETHERSCAN_API_KEY = ''
app.debug = LOCAL

@app.route('/verify/{address}', methods=['GET'], cors=True)
def verify(address):
  # Validate input
  if not address or len(address) == 0:
    raise BadRequestError("Address not set")
  if len(address) != 40 and len(address) != 42:
    raise BadRequestError("Malformed address %s" % (address,))
  
  app.log.info("Request %s" % (address,))

  # Get source from etherscan
  name, source, compiler = get_name_and_source(address)
  
  # Get path to solc
  workdir = getcwd()
  solcdir = path.join(workdir, "vendor") if LOCAL else workdir

  if compiler.startswith("v0.4"):
    solc = path.join(solcdir, "solc-0.4.25")
  elif compiler.startswith("v0.5"):
    solc = path.join(solcdir, "solc-0.5.12")
  else:
    raise BadRequestError("Unsupported compiler version %s" % (compiler,))
  
  # Write down contract
  filename = path.join("/tmp", "%s.sol" % (address,))
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
    response["result"][0]["SourceCode"],
    response["result"][0]["CompilerVersion"],
  )
  