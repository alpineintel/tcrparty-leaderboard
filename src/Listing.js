import React, {Fragment} from 'react';
import moment from 'moment';

const generateDM = (text) => {
  return `https://twitter.com/messages/compose?recipient_id=1029028522843627520&text=${text}`;
}

export default class Listing extends React.Component {
  render() {
    const {listing} = this.props;

    const handle = listing.data.replace('@', '');

    const now = + new Date();
    let dateString;
    let statusString;
    let actions;
    if (listing.challenge && listing.challenge.revealEndDate > now) {
      const now = + new Date();
      if (listing.challenge.commitEndDate < now) {
        dateString = `Challenge finalized ${moment(listing.challenge.revealEndDate).fromNow()}`;
      } else {
        dateString = `Challenge voting ends ${moment(listing.challenge.commitEndDate).fromNow()}`;
        actions = (
          <Fragment>
            Vote to
            <a target="_blank" href={generateDM(`vote @${handle} keep`)}>keep</a> or
            <a target="_blank" href={generateDM(`vote @${handle} kick`)}>kick</a>
          </Fragment>
        );
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
      actions = (
        <Fragment>
          <a target="_blank" href={generateDM(`challenge @${handle}`)}>Challenge</a>
        </Fragment>
      );
    }
    // Nominated
    else {
      dateString = `Will be added to the list ${moment(listing.applicationExpiry).fromNow()}`;
      actions = (
        <Fragment>
          <a target="_blank" href={generateDM(`challenge @${handle}`)}>Challenge</a>
        </Fragment>
      );
    }

    return <li>
      <img src={`https://twivatar.glitch.me/${handle}`} />
      <div className="meta">
        <a target="_blank" className="handle" href={`https://twitter.com/${handle}`}>@{handle}</a>
        {statusString && <span className="status">{statusString}</span>}
        <span className="date">{dateString}</span>
        {actions && <div className="actions">{actions}</div>}
      </div>
    </li>;
  }
}
