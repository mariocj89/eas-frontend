import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames/bind';
import Typography from '@material-ui/core/Typography';
import getOrdinal from '../../../i18n/ordinals';

import STYLES from './WinnersList.scss';

const c = classNames.bind(STYLES);

const WinnersList = ({ winners }) => (
  <div className={c('WinnersList')}>
    {winners.value.map((winner, index) => (
      <div key={winner.prize.id} data-testid="WinnersList__result">
        <Typography variant="h5" display="inline">
          {getOrdinal(index + 1)} Premio (
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

export default withTranslation('Raffle')(WinnersList);
