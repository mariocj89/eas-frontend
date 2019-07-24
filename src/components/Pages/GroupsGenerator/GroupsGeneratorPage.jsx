import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withFormValidation from '../../withValidation/withFormValidation.jsx';
import GeneralDetailsSection from '../../CommonSections/GeneralDetailsSection.jsx';
import WhenToTossSection from '../../CommonSections/WhenToTossSection.jsx';
import WizardForm from '../../WizardForm/WizardForm.jsx';
import Page from '../../Page/Page.jsx';
import DrawHeading from '../../DrawHeading/DrawHeading.jsx';
import GroupsGeneratorConfigurationSection from './GroupsGeneratorConfigurationSection.jsx';
import DrawLayout from '../../DrawLayout/DrawLayout.jsx';
import groupsOgImage from './groups_og_image.png';

const GeneralDetailsForm = withFormValidation(GeneralDetailsSection);
const ConfigurationForm = withFormValidation(GroupsGeneratorConfigurationSection);
const WhenToTossForm = withFormValidation(WhenToTossSection);

const GroupsGeneratorPage = props => {
  const {
    values,
    apiError,
    handleCheckErrorsInConfiguration,
    onFieldChange,
    handlePublish,
    isMobile,
    t,
  } = props;
  const steps = [
    {
      label: t('step_label_configure'),
      render: wizardProps => (
        <ConfigurationForm
          values={values}
          onFieldChange={onFieldChange}
          t={t}
          checkErrors={() => handleCheckErrorsInConfiguration(t)}
          {...wizardProps}
        />
      ),
    },
    {
      label: t('step_label_general_details'),
      render: wizardProps => (
        <GeneralDetailsForm
          sectionTitle={t('section_title_general_details')}
          title={values.title}
          description={values.description}
          onFieldChange={onFieldChange}
          {...wizardProps}
        />
      ),
    },
    {
      label: t('step_label_when_to_toss'),
      render: wizardProps => (
        <WhenToTossForm
          label={t('field_label_when_to_toss')}
          dateScheduled={values.dateScheduled}
          onFieldChange={onFieldChange}
          t={t}
          {...wizardProps}
        />
      ),
    },
  ];
  return (
    <Page
      htmlTitle={t('html_title')}
      htmlDescription={t('html_description')}
      htmlKeywords={t('html_keywords')}
      pageType="groups_public_draw"
      ogImage={groupsOgImage}
      enableHotjar
      showAdvert={!isMobile}
    >
      <DrawLayout>
        <DrawHeading title={t('page_title')} subtitle={t('draw_subheading')} />
        <WizardForm
          steps={steps}
          onSubmit={handlePublish}
          submitButtonLabel={t('publish_draw')}
          apiError={apiError}
          isMobile={isMobile}
        />
      </DrawLayout>
    </Page>
  );
};

GroupsGeneratorPage.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    numberOfGroups: PropTypes.string,
  }).isRequired,
  apiError: PropTypes.bool,
  onFieldChange: PropTypes.func.isRequired,
  handlePublish: PropTypes.func.isRequired,
  handleCheckErrorsInConfiguration: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

GroupsGeneratorPage.defaultProps = {
  apiError: false,
};

const mapStateToProps = state => ({ isMobile: state.userRequest.isMobile });

export default withTranslation('GroupsGenerator')(connect(mapStateToProps)(GroupsGeneratorPage));
