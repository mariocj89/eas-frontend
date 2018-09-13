import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Typography from '@material-ui/core/Typography';
import withFormValidation from '../../withValidation/withFormValidation';
import GeneralDetailsSection from '../../CommonSections/GeneralDetailsSection';
import WhenToTossSection from '../../CommonSections/WhenToTossSection';
import WizardForm from '../../WizardForm/WizardForm';
import Page from '../../Page/Page';
import RandomNumberConfigurationSection from './RandomNumberConfigurationSection';
import STYLES from './RandomNumberPage.scss';

const c = classNames.bind(STYLES);

const GeneralDetailsForm = withFormValidation(GeneralDetailsSection);
const ConfigurationForm = withFormValidation(RandomNumberConfigurationSection);
const WhenToTossForm = withFormValidation(WhenToTossSection);

const RandomNumberPage = props => {
  const { values, checkErrorsInConfiguration, onFieldChange, handlePublish, t } = props;
  const steps = [
    {
      label: t('step_general_details'),
      render: wizardProps => (
        <GeneralDetailsForm
          title={values.title}
          description={values.description}
          onFieldChange={onFieldChange}
          t={t}
          {...wizardProps}
        />
      ),
    },
    {
      label: t('step_participants'),
      render: wizardProps => (
        <ConfigurationForm
          values={values}
          onFieldChange={onFieldChange}
          t={t}
          checkErrors={() => checkErrorsInConfiguration(t)}
          {...wizardProps}
        />
      ),
    },
    {
      label: t('step_when_to_toss'),
      render: wizardProps => (
        <WhenToTossForm
          dateScheduled={values.dateScheduled}
          onFieldChange={onFieldChange}
          t={t}
          {...wizardProps}
        />
      ),
    },
  ];
  return (
    <Page htmlTitle={t('html_title')}>
      <div className={c('RandomNumberPage__container')}>
        <Typography color="primary" variant="display1">
          {t('page_title')}
        </Typography>
        <WizardForm
          steps={steps}
          onSubmit={handlePublish}
          submitButtonLabel={t('publish_raffle')}
        />
      </div>
    </Page>
  );
};

RandomNumberPage.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rangeMax: PropTypes.string.isRequired,
    rangeMin: PropTypes.string.isRequired,
    numberOfResults: PropTypes.string.isRequired,
    allowRepeated: PropTypes.bool.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handlePublish: PropTypes.func.isRequired,
  checkErrorsInConfiguration: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

RandomNumberPage.defaultProps = {};

export default translate('RandomNumber')(RandomNumberPage);
