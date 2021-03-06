import React, {Fragment} from 'react';
import RegistryABI from './abi/Registry.json';
import Listing from './Listing';
import Web3 from 'web3';

export default class CurrentMembers extends React.Component {
  constructor() {
    super();
    this.state = {
      listings: [],
      challenged: [],
      whitelisted: [],
      nominated: [],
      loading: true,
    };
  }

  componentDidMount() {
    let url = 'https://rinkeby.infura.io/v3/8ffe3d478cfe47f1a65978dfa14e7d9e'
    if (navigator.userAgent.indexOf("Firefox") != -1) {
      url = 'wss://rinkeby.infura.io/ws/v3/8ffe3d478cfe47f1a65978dfa14e7d9e';
    }

    const web3 = new Web3(url, {});
    this.contract = new web3.eth.Contract(RegistryABI, '0x0ba217252e67ab3832fbfc6af9b0ab4132d6eb84');

    this.fromBlock = web3.utils.toHex(0);

    this.contract.getPastEvents('_Application', {fromBlock: this.fromBlock, toBlock: 'latest'})
      .then(this.receiveApplicationEvents)
      .then(this.findChallenges)
      .then(this.sortListings)
      .then((state) => this.setState({...state, loading: false}))
      .catch((e) => {
        console.log('Error finding messages', e);
      });
  }

  receiveApplicationEvents = (events) => {
    const listingEvents = events.reduce((obj, event) => {
      return {...obj, [event.returnValues.listingHash]: event.returnValues};
    }, {});

    const listingHashes = Object.keys(listingEvents);
    const fetchListings = listingHashes.map((listingHash) => {
      return this.contract.methods.listings(listingHash).call();
    });

    return Promise.all(fetchListings)
      .then((listings) => listings.map((listing, i) => {
        const eventData = listingEvents[listingHashes[i]];
        return {
          ...listing,
          ...eventData,
          challengeID: parseInt(listing.challengeID),
          applicationExpiry: parseInt(listing.applicationExpiry) * 1000,
        };
      }))
      .then(listings => listings.filter(l => parseInt(l.owner) !== 0))
  }

  findChallenges = (listings) => {
    return this.contract.getPastEvents('_Challenge', {fromBlock: this.fromBlock, toBlock: 'latest'})
      .then((events) => {
        const challenges = events.reduce((obj, event) => {
          console.log("Challenge: ", event);
          return {
            ...obj,
            [parseInt(event.returnValues.challengeID)]: {
              ...event.returnValues,
              commitEndDate: parseInt(event.returnValues.commitEndDate) * 1000,
              revealEndDate: parseInt(event.returnValues.revealEndDate) * 1000,
            }
          };
        }, {});

        return listings.map((listing) => {
          const challenge = challenges[listing.challengeID];
          return {
            ...listing,
            challenge,
          };
        });
      });
  }

  sortListings = (listings) => {
    const now = + new Date();

    const whitelisted = listings.filter(listing => {
      return listing.whitelisted && (listing.challengeID === 0 || (listing.challenge && listing.challenge.revealEndDate < now));
    });
    const nominated = listings.filter((listing) => {
      return listing.applicationExpiry > now && listing.challengeID === 0;
    });
    const challenged = listings.filter((listing) => listing.challenge && listing.challenge.revealEndDate > now);

    return {listings, whitelisted, nominated, challenged};
  }

  render() {
    const {whitelisted, nominated, challenged, loading} = this.state;

    return (
      <div className="lists">
        <div className="list">
          <h2>Nominated to join</h2>
          {loading && (
            <p>Loading...</p>
          )}
          {!loading && nominated.length === 0 && (
            <p>None</p>
          )}
          {!loading && (
            <ul className="members">
              {nominated.map((listing) => <Listing listing={listing} key={listing.listingHash} />)}
            </ul>
          )}
        </div>
        <div className="list">
          <h2>In challenge</h2>
          {loading && (
            <p>Loading...</p>
          )}
          {!loading && challenged.length === 0 && (
            <p>None</p>
          )}
          {!loading && (
            <ul className="members">
              {challenged.map((listing) => <Listing listing={listing} key={listing.listingHash} />)}
            </ul>
          )}
        </div>
        <div className="list">
          <h2>On the list</h2>
          {loading && (
            <p>Loading...</p>
          )}
          {!loading && whitelisted.length === 0 && (
            <p>None</p>
          )}
          {!loading && (
            <ul className="members">
              {whitelisted.map((listing) => <Listing listing={listing} key={listing.listingHash} />)}
            </ul>
          )}
        </div>
      </div>
    );
  }
}
