import React from 'react';
import PropTypes from 'prop-types';
import { RaffleResult } from 'echaloasuerte-js-sdk';
import classnames from 'classnames/bind';
import STYLES from './FacebookRaffleResult.scss';
// import WinnerChip from '../../WinnerChip/WinnerChip.jsx';

const c = classnames.bind(STYLES);

const FacebookRaffleResult = ({ result }) => (
  <div className={c('FacebookRaffleResult')}>
    <div className={c('FacebookRaffleResult__container')}>
      {/* {result.value.map(winner => (
        <WinnerChip key={winner.prize.id} winner={winner} />
      ))} */}
    </div>
  </div>
);

FacebookRaffleResult.propTypes = {
  result: PropTypes.instanceOf(RaffleResult).isRequired,
};

export default FacebookRaffleResult;
