import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames/bind';
import { RaffleResult, Participant, Prize } from 'echaloasuerte-js-sdk';
import { frontloadConnect } from 'react-frontload';
import { connect } from 'react-redux';
import { fetchRaffleDraw } from '../../../actions/drawActions';
import Page from '../../Page/Page.jsx';
import WinnersList from './WinnersList.jsx';
import ResultsBox from '../../ResultsBox/ResultsBox.jsx';
import Countdown from '../../Countdown/Countdown.jsx';
import DrawHeading from '../../DrawHeading/DrawHeading.jsx';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner.jsx';
import ShareButtons from '../../ShareButtons/ShareButtons.jsx';
import DrawLayout from '../../DrawLayout/DrawLayout.jsx';
import PublishedDrawDetails from '../../PublishedDrawDetails/PublishedDrawDetails.jsx';
import raffleOgImage from './raffle_og_image.png';
import STYLES from './PublishedRafflePage.scss';

const c = classNames.bind(STYLES);
const analyticsDrawType = 'Raffle';

const PublishedRafflePage = props => {
  const { draw, match, t, hostname } = props;
  const { title, description, participants, prizes, result, isLoading } = draw;
  const shareUrl = hostname + match.url;

  if (isLoading) {
    return <LoadingSpinner fullpage />;
  }

  const ShareButtonsList = () => (
    <ShareButtons drawType={analyticsDrawType} sectionTitle={t('share_result')} url={shareUrl} />
  );
  return (
    <Page
      ogImage={raffleOgImage}
      htmlTitle={title || t('html_title')}
      htmlDescription={description || t('html_description')}
      htmlKeywords={t('html_keywords')}
      noIndex
      pageType="raffle_published_draw"
      className={c('PublishedRafflePage')}
    >
      <DrawLayout>
        <DrawHeading title={title || t('page_title')} subtitle={description} />
        {result.value ? (
          <>
            <ResultsBox title={t('winners')}>
              <WinnersList winners={result} />
            </ResultsBox>
            <ShareButtonsList />
          </>
        ) : (
          <>
            <Countdown date={result.schedule_date} />
            <ShareButtonsList />
          </>
        )}
        <PublishedDrawDetails sectionTitle={t('published_draw_details')}>
          <Typography component="div" variant="body2">
            {t('label_prizes')} {prizes.map(p => p.name).join(', ')}
          </Typography>
          <Typography component="div" variant="body2">
            {t('label_number_of_participants')} {participants.length}
          </Typography>
        </PublishedDrawDetails>
      </DrawLayout>
    </Page>
  );
};

PublishedRafflePage.propTypes = {
  draw: PropTypes.shape({
    title: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.instanceOf(Participant)).isRequired,
    prizes: PropTypes.arrayOf(PropTypes.instanceOf(Prize)).isRequired,
    description: PropTypes.string,
    result: PropTypes.instanceOf(RaffleResult),
    isOwner: PropTypes.bool,
    isLoading: PropTypes.bool,
  }).isRequired,
  hostname: PropTypes.string.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  t: PropTypes.func.isRequired,
};

PublishedRafflePage.defaultProps = {};

const TranslatedPage = withTranslation('Raffle')(PublishedRafflePage);

const mapsStateToProps = state => ({
  draw: state.draws.draw,
  hostname: state.userRequest.hostname,
});
const frontload = async props => {
  const { drawId } = props.match.params;
  await props.fetchRaffleDraw(drawId);
};

export default connect(
  mapsStateToProps,
  { fetchRaffleDraw },
)(
  frontloadConnect(frontload, {
    onMount: true,
    onUpdate: false,
  })(TranslatedPage),
);
