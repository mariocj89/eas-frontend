import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SectionPanel from '../../SectionPanel/SectionPanel.jsx';
import withFieldValidation from '../../withValidation/withFieldValidation.jsx';
import MultiValueInput from '../../MultiValueInput/MultiValueInput.jsx';
import withFeedbackValidation from '../../withValidation/withFeedbackValidation.jsx';
import ErrorFeedback from '../../ErrorFeedback/ErrorFeedback.jsx';

const ValidatedMultiValueInput = withFieldValidation(MultiValueInput);
const ValidationFeedback = withFeedbackValidation(ErrorFeedback);

const RaffleConfigurationSection = ({ values, onFieldChange, t }) => (
  <SectionPanel>
    <ValidatedMultiValueInput
      name="participants"
      label={t('field_label_participants')}
      labelDisplayList={t('field_label_list_of_participants')}
      placeholder={t('field_placeholder_participants')}
      messageEmpty={t('message_no_participants_added')}
      value={values.participants}
      fullWidth
      onChange={e => onFieldChange('participants', e.target.value)}
      validators={[{ rule: 'required' }]}
      data-testid="Raffle__participants-field"
      inputProps={{ 'data-testid': 'Raffle__participants-field-input' }}
      helperText={t('field_help_separate_participants_commas')}
    />
    <ValidatedMultiValueInput
      name="prizes"
      label={t('field_label_prizes')}
      labelDisplayList={t('field_label_list_of_prizes')}
      placeholder={t('field_placeholder_prizes')}
      messageEmpty={t('message_no_prizes_added')}
      value={values.prizes}
      fullWidth
      onChange={e => onFieldChange('prizes', e.target.value)}
      data-testid="Raffle__prizes-field"
      inputProps={{ 'data-testid': 'Raffle__prizes-field-input' }}
      validators={[{ rule: 'required' }]}
      helperText={t('field_help_separate_prizes_commas')}
    />
    <ValidationFeedback />
  </SectionPanel>
);

RaffleConfigurationSection.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    numberOfGroups: PropTypes.string,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('Raffle')(RaffleConfigurationSection);
