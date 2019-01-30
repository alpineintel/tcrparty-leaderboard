import React from 'react';
import moment from 'moment';

export default class Listing extends React.Component {
  render() {
    const {listing} = this.props;

    const handle = listing.data.replace('@', '');

    let dateString;
    let statusString;
    if (listing.challengeID !== 0) {
      const now = + new Date();
      if (listing.challenge.commitEndDate < now) {
        dateString = `Challenge finalized ${moment(listing.challenge.revealEndDate).fromNow()}`;
      } else {
        dateString = `Challenge voting ends ${moment(listing.challenge.commitEndDate).fromNow()}`;
      }

      if (listing.whitelisted) {
        statusString = "List member";
      } else {
        statusString = "Nominee";
      }
    }
    // Whitelisted
    else if (listing.whitelisted) {
      dateString = `Added to the list ${moment(listing.applicationExpiry).fromNow()}`;
    }
    // Nominated
    else {
      dateString = `Will be added to the list ${moment(listing.applicationExpiry).fromNow()}`;
    }

    return <li>
      <img src={`https://twivatar.glitch.me/${handle}`} />
      <div className="meta">
        <a href={`https://twitter.com/${handle}`}>@{handle}</a>
        {statusString && <span className="status">{statusString}</span>}
        <span className="date">{dateString}</span>
      </div>
    </li>;
  }
}
