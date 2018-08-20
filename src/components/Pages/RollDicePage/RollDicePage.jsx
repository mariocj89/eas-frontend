import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import classnames from 'classnames/bind';
import ReactDice from 'react-dice-complete';

import Page from '../../Page/Page';
import SubmitButton from '../../SubmitButton/SubmitButton';
import withFormValidation from '../../withValidation/withFormValidation';
import withFieldValidation from '../../withValidation/withFieldValidation';
import STYLES from './RollDicePage.scss';

const c = classnames.bind(STYLES);

const ValidatedForm = withFormValidation(props => <form {...props} />);
const ValidatedTextField = withFieldValidation(TextField);

const RollDicePage = ({ numberOfDice, onFieldChange, handleToss, t }) => (
  <Page htmlTitle={t('roll_dice_html_title')} className={c('RollDicePage')}>
    <Typography color="primary" variant="display1">
      {t('roll_dice_tittle')}
    </Typography>

    <ValidatedForm
      onSubmit={e => {
        e.preventDefault();
        handleToss();
      }}
    >
      <ValidatedTextField
        name="numberOfDice"
        label={t('number_of_dice')}
        placeholder="1"
        onChange={e => onFieldChange('numberOfDice', e.target.value)}
        value={numberOfDice}
        margin="normal"
        type="number"
        required
      />
      <ReactDice
        numDice={2}
        rollDone={this.rollDoneCallback}
        ref={dice => (this.reactDice = dice)}
      />
      <SubmitButton label={t('roll_dice')} />
    </ValidatedForm>
  </Page>
);

RollDicePage.propTypes = {
  numberOfDice: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleToss: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default translate('RollDicePage')(RollDicePage);
