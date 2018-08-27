import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';
import { RandomNumberApi, RandomNumber } from 'echaloasuerte-js-sdk';

import RandomNumberForm from './RandomNumberForm';

const randomNumberApi = new RandomNumberApi();

class RandomNumberFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateId: null,
      values: {
        title: 'Cool title',
        description: 'Nice description',
        rangeMin: '1',
        rangeMax: '10',
        numberOfResults: '1',
        allowRepeated: false,
        whenToToss: 'now',
        dateScheduled: null,
      },
    };
  }

  onFieldChange = (fieldName, value) => {
    this.setState(previousState => ({
      values: {
        ...previousState.values,
        ...{
          [fieldName]: value,
        },
      },
    }));
  };

  createDraw = async () => {
    const {
      title,
      description,
      rangeMin,
      rangeMax,
      numberOfResults,
      allowRepeated,
    } = this.state.values;
    console.log('allowRepeated', allowRepeated);
    const randomNumberDraw = RandomNumber.constructFromObject({
      title,
      description,
      range_min: rangeMin,
      range_max: rangeMax,
      number_of_results: numberOfResults,
      allow_repeated_results: allowRepeated,
    });
    try {
      return await randomNumberApi.randomNumberCreate(randomNumberDraw);
    } catch (err) {
      alert(err);
      return null;
    }
  };

  handleToss = async () => {
    if (!this.state.drawPrivateId) {
      const draw = await this.createDraw();
      this.setState({ drawPrivateId: draw.private_id });
    }
    try {
      const tossResponse = await randomNumberApi.randomNumberToss(this.state.drawPrivateId, {});
      this.props.onToss(tossResponse.value);
    } catch (err) {
      alert(err);
    }
  };

  handlePublish = async () => {
    const draw = await this.createDraw();
    if (this.state.values.whenToToss === 'now') {
      try {
        await randomNumberApi.randomNumberToss(draw.private_id, {});
      } catch (err) {
        alert(err);
      }
    }
    this.props.history.push(`${this.props.location.pathname}/${draw.private_id}`);
  };

  render() {
    return (
      <RandomNumberForm
        values={this.state.values}
        isPublic={this.props.isPublic}
        onFieldChange={this.onFieldChange}
        handleToss={this.handleToss}
        handlePublish={this.handlePublish}
        handleMakeDrawPublic={this.handleMakeDrawPublic}
      />
    );
  }
}

RandomNumberFormContainer.propTypes = {
  isPublic: PropTypes.bool.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(RandomNumberFormContainer);
