import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from '../../i18n';
import TranslationsSwitch from './TranslationsSwitch.jsx';
import STYLES from './Footer.module.scss';
import { environment } from '../../utils';
import { TYPE_APP_ENV_PRODUCTION, TYPE_APP_ENV_LOCAL } from '../../constants/environment';
import Button from '../Button.jsx';

const availableLocales = ['es-ES', 'en-GB'];

const redirect = locale => {
  const { protocol, pathname, search } = window.location;
  let newDomain;
  if (locale === 'en-GB') {
    if (environment === TYPE_APP_ENV_PRODUCTION) {
      newDomain = 'chooserandom.com';
    } else {
      newDomain = 'dev.chooserandom.com';
    }
  } else if (environment === TYPE_APP_ENV_PRODUCTION) {
    newDomain = 'echaloasuerte.com';
  } else {
    newDomain = 'dev.echaloasuerte.com';
  }
  const targetUrl = `${protocol}//${newDomain}${pathname}${search}`;
  window.location.replace(targetUrl);
};

const Footer = ({ t, i18n }) => {
  const handleChangeLanguage = l => {
    if (environment === TYPE_APP_ENV_LOCAL) {
      // Avoid redirecting to ease the translation process in local
      i18n.changeLanguage(l);
    } else {
      redirect(l);
    }
  };

  return (
    <footer className={STYLES.container}>
      <Button className={STYLES.button} href="/privacy-policy">
        {t('privacy_policy')}
      </Button>
      <Button className={STYLES.button} href="mailto:echaloasuerte@gmail.com">
        {t('contact')}
      </Button>
      <TranslationsSwitch onChange={handleChangeLanguage} available={availableLocales} />
    </footer>
  );
};

Footer.propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withTranslation('Common')(Footer);
