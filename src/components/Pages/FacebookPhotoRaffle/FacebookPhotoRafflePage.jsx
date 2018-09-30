import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import classnames from 'classnames/bind';
import Typography from '@material-ui/core/Typography';
import SubmitButton from '../../SubmitButton/SubmitButton';

import SectionPanel from '../../SectionPanel/SectionPanel';
import MultiValueDisplay from '../../MultiValueDisplay/MultiValueDisplay';
import PrizeSelector from '../../PrizeSelector/PrizeSelector';
import QuickDrawLayout from '../../QuickDrawLayout/QuickDrawLayout';
import withFormValidation from '../../withValidation/withFormValidation';
import WizardForm from '../../WizardForm/WizardForm';
import GeneralDetailsSection from '../../CommonSections/GeneralDetailsSection';

import Page from '../../Page/Page';
import FacebookLoginButton from '../../FacebookLoginButton/FacebookLoginButton';
import STYLES from './FacebookPhotoRafflePage.scss';

const c = classnames.bind(STYLES);

const GrantAccessSection = ({ isLoggedInFB, userPages }) => (
  <Fragment>
    <SectionPanel>
      {isLoggedInFB ? (
        <Fragment>
          You are logged in. These are the pages were we got access:
          <ul>{userPages !== null && userPages.map(page => <li>{page.pageName}</li>)}</ul>
        </Fragment>
      ) : (
        <Fragment>
          <Typography variant="body1" gutterBottom>
            Para poder hacer un sorteo entre la gente a la que le ha gustado un post, debes acceder
            con Facebook
            <br />
            Sólo es posible hacer sorteos en posts publicados por paginas que tú administres
          </Typography>
        </Fragment>
      )}
      <FacebookLoginButton permissions="manage_pages" />
    </SectionPanel>
  </Fragment>
);

const ChoosePostSection = () => (
  <SectionPanel>
    Now paste here the link to the post you want to check
    {/* <TextField
      label={t('post_or_photo_url')}
      margin="normal"
      onChange={e => onFieldChange('url', e.target.value)}
      value={values.url}
      type="text"
      fullWidth
    />
    <Button variant="raised" color="primary" onClick={onGetLikes}>
      {t('check_participants')}
    </Button>
    {participantsFetched && (
      <MultiValueDisplay
        name="participants"
        label={t('participants')}
        values={values.participants}
        placeholder="David"
      />
    )} */}
  </SectionPanel>
);

const GrantAccessForm = withFormValidation(GrantAccessSection);
const ChoosePostForm = withFormValidation(ChoosePostSection);

const FacebookPhotoRafflePage = props => {
  const {
    values,
    participantsFetched,
    isLoggedInFB,
    userPages,
    onGetLikes,
    onFieldChange,
    handlePublish,
    t,
  } = props;
  const steps = [
    {
      label: t('step_login_with_facebook'),
      render: wizardProps => (
        <GrantAccessForm
          isLoggedInFB={isLoggedInFB}
          userPages={userPages}
          {...wizardProps}
          checkErrors={() => 'asdas'}
        />
      ),
    },
    {
      label: t('step_choose_post'),
      render: wizardProps => <ChoosePostForm {...wizardProps} />,
    },
  ];

  return (
    <Page htmlTitle={t('html_title')} className={c('FacebookPhotoRafflePage')}>
      <div className={c('FacebookPhotoRafflePage__container')}>
        <Typography color="primary" variant="display1" align="center">
          {t('page_title')}
        </Typography>
        <Typography variant="body1" align="center" color={'textSecondary'}>
          {t('draw_subheading')}
        </Typography>
        <WizardForm
          steps={steps}
          // initialStep={1}
          onSubmit={handlePublish}
          submitButtonLabel={t('publish_raffle')}
        />
      </div>
    </Page>
  );
};

FacebookPhotoRafflePage.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.string),
    prizes: PropTypes.arrayOf(PropTypes.string),
    numberOfWinners: PropTypes.number,
    dateScheduled: PropTypes.string,
  }).isRequired,
  participantsFetched: PropTypes.bool.isRequired,
  isLoggedInFB: PropTypes.bool,
  userPages: PropTypes.arrayOf(
    PropTypes.shape({
      pageName: PropTypes.string.isRequired,
      accessToken: PropTypes.string.isRequired,
    }),
  ),
  t: PropTypes.func.isRequired,
  onGetLikes: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handlePublish: PropTypes.func.isRequired,
};

FacebookPhotoRafflePage.defaultProps = {
  isLoggedInFB: false,
  userPages: [],
};

export default translate('FacebookPhotoRafflePage')(FacebookPhotoRafflePage);
