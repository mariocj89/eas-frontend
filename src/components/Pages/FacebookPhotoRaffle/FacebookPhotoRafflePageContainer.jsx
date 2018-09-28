import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import FacebookPhotoRafflePage from './FacebookPhotoRafflePage';
import withFacebookSDK from './../../withFacebookSDK/withFacebookSDK';

import { getObjectIdFromUrl, logout, whoAmI } from '../../../services/FacebookAPI/FacebookAPI';

class FacebookPhotoRafflePageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        title: '',
        description: '',
        url: '',
        // participants: ['David Naranjo', 'Mr. Nobody'],
        participants: [],
        prizes: [],
        numberOfWinners: 1,
        winners: [],
        dateScheduled: null,
      },
      isLoggedInFB: false,
      participantsFetched: false,
    };
  }

  componentDidUpdate() {
    const { isLoggedInFB, userPages, queryUserPages } = this.props.facebookContext;
    if (isLoggedInFB && userPages === null) {
      queryUserPages();
    }
  }

  onFieldChange = (fieldName, value) => {
    if (fieldName === 'url') {
      try {
        getObjectIdFromUrl(this.state.values.url);
      } catch (error) {
        console.log('INVALID URL');
      }
    }
    console.log('onfliedChange', fieldName, value);
    this.setState(previousState => ({
      values: {
        ...previousState.values,
        ...{
          [fieldName]: value,
        },
      },
    }));
  };

  onGetLikes = async () => {
    const objectId = '1775681819145291_1775711522475654';
    // const objectId = '1775681819145291';
    // const objectId = getObjectIdFromUrl(this.state.values.url);
    // The following could be improved
    const likes = await this.props.facebookContext.queryLikesOnObject(objectId);
    console.log(likes);
  };

  handleFaceebookLogout = () => {
    logout();
    whoAmI();
  };

  handlePublish = async () => {
    this.props.history.push(`${this.props.location.pathname}/3`);
  };

  handleQueryLikes = () => {};

  render() {
    const { values, participantsFetched } = this.state;
    const { isLoggedInFB, userPages } = this.props.facebookContext;
    return (
      <FacebookPhotoRafflePage
        isLoggedInFB={isLoggedInFB}
        participantsFetched={participantsFetched}
        userPages={userPages}
        values={values}
        onGetLikes={this.onGetLikes}
        onFieldChange={this.onFieldChange}
        handlePublish={this.handlePublish}
        handleFaceebookLogout={this.handleFaceebookLogout}
      />
    );
  }
}

FacebookPhotoRafflePageContainer.propTypes = {
  facebookContext: PropTypes.shape({
    isLoggedInFB: PropTypes.bool.isRequired,
    getUserDetails: PropTypes.func.isRequired,
    queryUserPages: PropTypes.func.isRequired,
    userPages: PropTypes.arrayOf(
      PropTypes.shape({
        pageName: PropTypes.string.isRequired,
        accessToken: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withFacebookSDK(FacebookPhotoRafflePageContainer);
