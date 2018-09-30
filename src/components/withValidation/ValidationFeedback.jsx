import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import withFeedbackValidation from './withFeedbackValidation';
import BannerAlert, { ALERT_TYPES } from '../BannerAlert/BannerAlert';
import STYLES from './ValidationFeedback.scss';

const c = classnames.bind(STYLES);

const ValidationFeedback = ({ error }) => (
  <div className={c('ValidationFeedback')} data-component={'ValidationFeedback'}>
    <BannerAlert title={error} type={ALERT_TYPES.ERROR} />
  </div>
);

ValidationFeedback.propTypes = {
  error: PropTypes.string,
};

ValidationFeedback.defaultProps = {
  error: '',
};

export default withFeedbackValidation(ValidationFeedback);
