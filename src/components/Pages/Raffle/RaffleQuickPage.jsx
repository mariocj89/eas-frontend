import React, { useEffect } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { RaffleResult } from 'echaloasuerte-js-sdk';
import withFormValidation from '../../withValidation/withFormValidation.jsx';
import GeneralDetailsSection from '../../CommonSections/GeneralDetailsSection.jsx';
import WhenToTossSection from '../../CommonSections/WhenToTossSection.jsx';
import ErrorFeedback from '../../ErrorFeedback/ErrorFeedback.jsx';
import SubmitButton from '../../SubmitButton/SubmitButton.jsx';

import Page from '../../Page/Page.jsx';
import DrawHeading from '../../DrawHeading/DrawHeading.jsx';
import MakeCertifiedDrawPanel from '../../MakeCertifiedDrawPanel/MakeCertifiedDrawPanel.jsx';
import RaffleConfigurationSection from './RaffleConfigurationSection.jsx';
import DrawLayout from '../../DrawLayout/DrawLayout.jsx';
import LoadingCoin from '../../LoadingCoin/LoadingCoin.jsx';
import WinnersList from '../../WinnersList/WinnersList.jsx';
import ShareDrawModal from '../../ShareDrawModal/ShareDrawModal.jsx';
import LearnMoreSection from '../../LearnMoreSection/LearnMoreSection.jsx';
// import groupsOgImage from './groups_og_image.png';

const analyticsDrawType = 'Raffle';
const ValidatedForm = withFormValidation(props => <form {...props} />);

const RafflePage = ({
  values,
  apiError,
  loadingResult,
  onFieldChange,
  quickResult,
  handleToss,
  handleCheckErrorsInConfiguration,
  t,
}) => {
  const publicDrawUrl = '/raffle/public';
  const resultsRef = React.createRef();

  // TODO Create custom hook https://reactjs.org/docs/hooks-custom.html
  useEffect(() => {
    if (quickResult) {
      try {
        window.scroll({ left: 0, top: resultsRef.current.offsetTop, behavior: 'smooth' });
      } catch (error) {
        window.scrollTo(0, resultsRef.current.offsetTop);
      }
    }
  }, [quickResult, resultsRef]);

  return (
    <Page
      htmlTitle={t('html_title')}
      htmlDescription={t('html_description')}
      htmlKeywords={t('html_keywords')}
      // ogImage={groupsOgImage}
      pageType="Raffle Quick"
    >
      <DrawLayout
        sidePanel={
          <MakeCertifiedDrawPanel
            buttonLabel={t('create_certificated_draw')}
            publicDrawUrl={publicDrawUrl}
            trackingData={{
              mp: {
                name: `Start Public Draw - ${analyticsDrawType}`,
                properties: { drawType: analyticsDrawType, source: 'From Scratch' },
              },
              ga: { category: analyticsDrawType, action: 'Start Public', label: 'From Scratch' },
            }}
          >
            <span>
              <Trans i18nKey="certified_draw_description">
                Si quieres hacer un sorteo público para asegurar a los participantes una eleccion
                imparcial del resultado, te recomendamos que hagas un sorteo certificado
              </Trans>
            </span>
          </MakeCertifiedDrawPanel>
        }
      >
        <DrawHeading title={t('page_title')} subtitle={t('draw_subheading')} />
        <ValidatedForm
          onSubmit={e => {
            e.preventDefault();
            handleToss();
          }}
          checkErrors={() => handleCheckErrorsInConfiguration(t)}
        >
          <RaffleConfigurationSection values={values} onFieldChange={onFieldChange} t={t} />
          {apiError && <ErrorFeedback error={t('ApiError:api_error')} />}
          <SubmitButton label={t('generate_results')} />
        </ValidatedForm>
        <div ref={resultsRef} style={{ 'text-align': 'center' }}>
          {loadingResult && <LoadingCoin />}
          {!loadingResult && quickResult && (
            <>
              <WinnersList winners={quickResult} />
              <ShareDrawModal
                publicDrawUrl={publicDrawUrl}
                trackingData={{
                  mp: {
                    name: `Start Public Draw - ${analyticsDrawType}`,
                    properties: { drawType: analyticsDrawType, source: 'From Quick Result' },
                  },
                  ga: {
                    category: analyticsDrawType,
                    action: 'Start Public',
                    label: 'From Quick Result',
                  },
                }}
                t={t}
              />
            </>
          )}
        </div>
      </DrawLayout>
    </Page>
  );
};

RafflePage.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    numberOfGroups: PropTypes.string,
  }).isRequired,
  quickResult: PropTypes.instanceOf(RaffleResult),
  apiError: PropTypes.bool,
  loadingResult: PropTypes.bool,
  onFieldChange: PropTypes.func.isRequired,
  handleToss: PropTypes.func.isRequired,
  handleCheckErrorsInConfiguration: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

RafflePage.defaultProps = {
  quickResult: null,
  loadingResult: false,
  apiError: false,
};

export default withTranslation('Raffle')(RafflePage);
