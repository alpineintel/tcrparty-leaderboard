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
          <p>
            <b style={{color: 'red'}}>Status update:</b> Looks like the party got out of hand... TCR
            Party is currently experiencing downtime while we work with
            Twitter's support team to revive our API access. Keep an eye on&nbsp;
            <a href="https://twitter.com/stevenleeg">@stevenleeg</a>'s timeline
            for updates.
          </p>
        </article>
        <article>
          <CurrentMembers />
        </article>
        <div className="spacer" />
        <article className="tcr-info">
          Sourcing data from TCRP Registry at <span className="code">0x0ba217252e67ab3832fbfc6af9b0ab4132d6eb84</span> (Rinkeby network).
        </article>
      </div>
    );
  }
}

export default App;
