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
      </div>
    );
  }
}

export default App;
