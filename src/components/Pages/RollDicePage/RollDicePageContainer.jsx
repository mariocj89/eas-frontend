import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RollDicePage from './RollDicePage';

class RollDicePageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { numberOfDice: 1 };
  }

  rollAll = () => {
    this.reactDice.rollAll();
  };

  rollDoneCallback = num => {
    console.log(`You rolled a ${num}`);
  };

  render() {
    const { numberOfDice } = this.state;
    return (
      <div>
        <RollDicePage numberOfDice={numberOfDice} />
      </div>
    );
  }
}

RollDicePageContainer.propTypes = {};

export default RollDicePageContainer;
