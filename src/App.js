import React, { Component } from 'react';
import CurrentMembers from './CurrentMembers';

class App extends Component {
  render() {
    return (
      <div className="container">
        <header>
          <h1>🎉 TCR Party 🎉</h1>
          <ul>
            <li><a href="https://www.tcr.party">About</a></li>
            <li><a href="https://github.com/alpineintel/tcrpartybot">Code</a></li>
            <li><a href="https://leadboard.tcr.party">Leaderboard</a></li>
          </ul>
        </header>
        <article>
          <CurrentMembers />
        </article>
        <div className="spacer" />
        <article className="tcr-info">
          Sourcing data from TCRP Registry at <span className="code">0x0cc82efef656d836bb27548297bee4eb0cb6559e</span> (Ropsten network).
        </article>
      </div>
    );
  }
}

export default App;
