import React from 'react';
import './Checker.css';

const BASE_URL = 'https://ffs9hp5u9e.execute-api.us-east-1.amazonaws.com/api/verify';
const SAMPLE_ADDRESS = '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3';

class Checker extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.input = React.createRef();
    this.state = { verifying: false, error: null, output: null, name: null, address: this.getAddress() };
  }

  async handleClick() {
    this.setState({ error: null, output: null, name: null });
    try {
      this.setState({ verifying: true });
      const response = await fetch(`${BASE_URL}/${this.input.current.value}`);
      const { output, name } = await response.json();
      this.setState({ output, name });
    } catch (error) {
      this.setState({ error, output: null, name: null });
    } finally {
      this.setState({ verifying: false });
    }
  }

  getAddress() {
    const hash = window.location.hash;
    if (hash && hash.length === 41 || hash.length === 43) return hash.substring(1);
    return SAMPLE_ADDRESS;
  }

  renderName() {
    const { name } = this.state;
    if (!name) return null;
    return (
      <h2 className="Checker-name">
        Contract { name }
      </h2>
    );
  }

  renderResponse() {
    const { output } = this.state;
    if (!output) return null;
    return (
      <pre className="Checker-response">
        { output }      
      </pre>
    );
  }

  render() {
    const { verifying, error, address } = this.state;
    return (
      <div className="Checker-body">
        <div className="Checker-form">
          <input type="text" className="Checker-input" ref={this.input} defaultValue={address}></input>
          <button disabled={verifying} className="Checker-button" onClick={this.handleClick}>
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
        </div>
        <div>
          {this.renderName()}
          {this.renderResponse()}
        </div>
        <p className="Checker-error">{error}</p>
      </div>
    );
  }
}

export default Checker;