import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import WinnerChip from '../WinnerChip/WinnerChip.jsx';
import STYLES from './WinnersList.scss';

const c = classNames.bind(STYLES);

const WinnersList = ({ winners }) => (
  <div className={c('WinnersList')}>
    {winners.value.map(winner => (
      <WinnerChip key={winner.prize.id} winner={winner} />
    ))}
  </div>
);

WinnersList.propTypes = {
  winners: PropTypes.arrayOf(Object).isRequired,
};

export default WinnersList;
