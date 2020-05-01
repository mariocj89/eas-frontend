import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from '../i18n';
import MultiValueInput from './MultiValueInput/MultiValueInput.jsx';

const ParticipantsInput = ({ t, ...other }) => {
  const { tReady, i18n, ...rest } = other;
  return (
    <MultiValueInput
      label={t('field_label')}
      placeholder={t('field_placeholder')}
      messageEmpty={t('message_no_participants_added')}
      helperText={t('field_help_separate_participants_commas')}
      fullWidth
      data-testid="ParticipantsInput"
      inputProps={{ 'data-testid': 'ParticipantsInput__inputField' }}
      {...rest}
    />
  );
};

ParticipantsInput.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('ParticipantsInput')(ParticipantsInput);