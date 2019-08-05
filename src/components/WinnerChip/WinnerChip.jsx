import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { RaffleResultValue } from 'echaloasuerte-js-sdk';
import Typography from '@material-ui/core/Typography';

import STYLES from './WinnerChip.scss';

const c = classNames.bind(STYLES);

const WinnerChip = ({ position, winner }) => (
  <div>
    <Typography variant="h5" display="inline">
      {position}o Premio: -{' '}
    </Typography>
    <Typography variant="h2" display="inline">
      {winner.prize.name}
    </Typography>{' '}
    <Typography variant="h5" display="inline">
      - {winner.participant.name}
    </Typography>
    {/* <div className={c('WinnerChip')} data-testid="WinnerChip">
      <div className={c('WinnerChip__leftside-box')}>{winner.prize.name}</div>
      <div className={c('WinnerChip__rigthside-box')}>{winner.participant.name}</div>
    </div> */}
  </div>
  // <div className={c('WinnerChip')} data-testid="WinnerChip">
  //   <div className={c('WinnerChip__leftside-box')}>{winner.prize.name}</div>
  //   <div className={c('WinnerChip__rigthside-box')}>{winner.participant.name}</div>
  // </div>
);

WinnerChip.propTypes = {
  winner: PropTypes.instanceOf(RaffleResultValue).isRequired,
};

export default WinnerChip;
