import React, {Fragment} from 'react';
import RegistryABI from './abi/Registry.json';
import Listing from './Listing';
import Web3 from 'web3';

export default class CurrentMembers extends React.Component {
  constructor() {
    super();
    this.state = {
      listings: [],
      loading: true,
    };
  }

  componentDidMount() {
    let url = 'https://ropsten.infura.io/v3/8ffe3d478cfe47f1a65978dfa14e7d9e'
    if (navigator.userAgent.indexOf("Firefox") != -1) {
      url = 'wss://ropsten.infura.io/ws/v3/8ffe3d478cfe47f1a65978dfa14e7d9e';
    }

    const web3 = new Web3(url, {});
    this.contract = new web3.eth.Contract(RegistryABI, '0x0cc82efef656d836bb27548297bee4eb0cb6559e');

    this.fromBlock = web3.utils.toHex(0);

    this.contract.getPastEvents('_Application', {fromBlock: this.fromBlock, toBlock: 'latest'})
      .then(this.receiveApplicationEvents)
      .then(this.sortListings)
      .then(this.findChallenges)
      .then((state) => this.setState(state))
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

  sortListings = (listings) => {
    const whitelisted = listings.filter(listing => listing.whitelisted);
    const now = + new Date();
    const nominated = listings.filter((listing) => {
      return listing.applicationExpiry > now && listing.challengeID === 0;
    });
    const challenged = listings.filter((listing) => listing.challengeID > 0);

    return {listings, whitelisted, nominated, challenged};
  }

  findChallenges = ({listings, whitelisted, nominated, challenged}) => {
    return this.contract.getPastEvents('_Challenge', {fromBlock: this.fromBlock, toBlock: 'latest'})
      .then((events) => {
        const challenges = events.reduce((obj, event) => {
          return {
            ...obj,
            [parseInt(event.returnValues.challengeID)]: {
              ...event.returnValues,
              commitEndDate: parseInt(event.returnValues.commitEndDate) * 1000,
              appEndDate: parseInt(event.returnValues.revealEndDate) * 1000,
            }
          };
        }, {});

        return {
          listings,
          whitelisted,
          nominated,
          challenged: challenged.map((listing) => {
            return {
              ...listing,
              challenge: challenges[listing.challengeID],
            };
          }),
          loading: false,
        };
      })
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
          <h2>Being challenged</h2>
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
