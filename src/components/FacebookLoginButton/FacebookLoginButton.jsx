import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import STYLES from './FacebookLoginButton.scss';

const c = classNames.bind(STYLES);

class FacebookLoginButton extends Component {
  componentDidMount() {
    if (window.FB) {
      // The FB login button is parsed and rendered by XFBML
      // https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse/
      window.FB.XFBML.parse();
    }
  }

  render() {
    const { permissions } = this.props;
    return (
      <div className={c('FacebookLoginButton')}>
        <div
          className="fb-login-button"
          data-max-rows="1"
          data-size="large"
          data-button-type="continue_with"
          data-show-faces="false"
          data-auto-logout-link="true"
          data-use-continue-as="false"
          data-scope={permissions}
        />
      </div>
    );
  }
}

FacebookLoginButton.propTypes = {
  permissions: PropTypes.string,
};

FacebookLoginButton.defaultProps = {
  permissions: '',
};

export default FacebookLoginButton;
