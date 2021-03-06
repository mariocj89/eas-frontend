import React from 'react';
import PropTypes from 'prop-types';

const withFeedbackValidation = WrappedComponent => {
  const WithFeedbackValidation = (props, { getFormError }) => {
    const error = getFormError();
    return error ? <WrappedComponent error={error} /> : null;
  };

  WithFeedbackValidation.contextTypes = {
    getFormError: PropTypes.func.isRequired,
  };

  return WithFeedbackValidation;
};

export default withFeedbackValidation;
