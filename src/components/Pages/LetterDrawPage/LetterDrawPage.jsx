import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';
import classnames from 'classnames/bind';
import STYLES from './LetterDrawPage.scss';

const c = classnames.bind(STYLES);
class LetterDrawPage extends React.Component {
  state = {};

  handleDateChange = () => {};

  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className={c('LetterDrawPage', 'LetterDrawPage__tails')}>
          <div className={c('LetterDrawPage__side', 'LetterDrawPage__side--a')} />
          <div className={c('LetterDrawPage__side', 'LetterDrawPage__side--b')} />
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

LetterDrawPage.propTypes = {
  values: PropTypes.shape({
    numberOfLetters: PropTypes.number.isRequired,
    isPublic: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withTranslation('LetterDrawPage')(LetterDrawPage);
