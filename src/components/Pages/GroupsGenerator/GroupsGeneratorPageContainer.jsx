import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import ReactGA from 'react-ga';
import EASApi from '../../../services/EASApi';

import GroupsGeneratorPage from './GroupsGeneratorPage';
import GroupsGeneratorQuickPage from './GroupsGeneratorQuickPage';

const groupsApi = new EASApi.GroupsApi();
class GroupsGeneratorPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateId: null,
      isPublic: false,
      values: {
        title: '',
        description: '',
        participants: [],
        numberOfGroups: 2,
        dateScheduled: null,
      },
      quickResult: [],
    };
  }

  onFieldChange = (fieldName, value) => {
    this.setState(previousState => ({
      privateId: null,
      quickResult: [],
      values: {
        ...previousState.values,
        ...{
          [fieldName]: value,
        },
      },
    }));
  };

  createDraw = async () => {
    const { title, description, participants, numberOfGroups } = this.state.values;

    const publicDetails = {
      title,
      description,
    };
    let drawData = {
      participants: participants.map(participant => ({ name: participant })),
      number_of_groups: numberOfGroups,
    };

    if (this.props.isPublic) {
      drawData = {
        ...drawData,
        ...publicDetails,
      };
    }
    const groupGeneratorDraw = EASApi.Groups.constructFromObject(drawData);
    try {
      return await groupsApi.groupsCreate(groupGeneratorDraw);
    } catch (err) {
      alert(err);
      return null;
    }
  };

  handleToss = async () => {
    let privateId;
    if (this.state.privateId) {
      privateId = this.state.privateId;
    } else {
      const draw = await this.createDraw();
      privateId = draw.private_id;
      this.setState({ privateId });
    }
    try {
      const tossResponse = await groupsApi.groupsToss(this.state.privateId, {});
      ReactGA.event({ category: 'Toss', action: 'Random Number', label: 'Local' });
      // this.props.onToss(tossResponse.value);
      this.setState({ quickResult: tossResponse.value });
    } catch (err) {
      alert(err);
    }
  };

  handlePublish = async () => {
    const draw = await this.createDraw();
    if (!this.state.values.dateScheduled) {
      try {
        await groupsApi.groupsToss(draw.private_id, {});
        this.props.history.push(`${this.props.location.pathname}/${draw.private_id}`);
      } catch (err) {
        alert(err);
      }
    }
  };

  handleMakePublic = () => {
    this.setState({ isPublic: true });
  };

  handleCheckErrorsInConfiguration = t => {
    const { participants, numberOfGroups } = this.state.values;

    if (participants.length < numberOfGroups) {
      return t('error_form_not_enough_participants', { numberOfGroups });
    }
    return undefined;
  };

  render() {
    const { isPublic, values, quickResult, privateId } = this.state;
    console.log('values', values);
    return isPublic ? (
      <GroupsGeneratorPage
        values={values}
        onFieldChange={this.onFieldChange}
        handlePublish={this.handlePublish}
        handleCheckErrorsInConfiguration={this.handleCheckErrorsInConfiguration}
      />
    ) : (
      <GroupsGeneratorQuickPage
        values={values}
        shareResultLink={privateId ? `/number/${privateId}` : ''}
        quickResult={quickResult}
        onFieldChange={this.onFieldChange}
        handleToss={this.handleToss}
        handleMakePublic={this.handleMakePublic}
        handleCheckErrorsInConfiguration={this.handleCheckErrorsInConfiguration}
      />
    );
  }
}

GroupsGeneratorPageContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default GroupsGeneratorPageContainer;
