import React from 'react';
import logo from './logo.svg';
import './App.css';

type AppState = {
  public_url: string;
};

class App extends React.Component<{}, AppState> {
  state: AppState = {
    public_url: ""
  }

  componentDidMount() {
    this.setState({ public_url: "asd" });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit1 <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>{this.state.public_url}</p>
        </header>
      </div>
    );
  }
}

export default App;
