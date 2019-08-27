import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Typography from '@material-ui/core/Typography';

import STYLES from './WinnersList.scss';

const c = classNames.bind(STYLES);

const WinnersList = ({ winners }) => (
  <div className={c('WinnersList')}>
    {winners.value.map((winner, index) => (
      <div key={winner.prize.id}>
        <Typography variant="h5" display="inline">
          {index + 1}er Premio (
        </Typography>
        <Typography variant="h2" display="inline">
          {winner.prize.name}
        </Typography>
        <Typography variant="h5" display="inline">
          ): {winner.participant.name}
        </Typography>
      </div>
    ))}
  </div>
);

WinnersList.propTypes = {
  winners: PropTypes.arrayOf(Object).isRequired,
};

export default WinnersList;
