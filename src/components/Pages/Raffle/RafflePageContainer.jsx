import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withTranslation } from 'react-i18next';
import { RaffleApi, Raffle, DrawTossPayload } from 'echaloasuerte-js-sdk';
import moment from 'moment';
import withTracking from '../../withTracking/withTracking.jsx';
import recentDraws from '../../../services/recentDraws';
import RafflePage from './RafflePage.jsx';
import RaffleQuickPage from './RaffleQuickPage.jsx';

const raffleApi = new RaffleApi();
const analyticsDrawType = 'Raffle';

class RafflePageContainer extends Component {
  constructor(props) {
    super(props);

    const dateScheduled = new Date();
    dateScheduled.setHours(dateScheduled.getHours() + 1);

    this.state = {
      APIError: false,
      loadingResult: false,
      quickResult: null,
      privateId: null,
      values: {
        title: '', // Default title is set in CDM
        description: '',
        participants: [],
        prizes: [],
        dateScheduled,
      },
    };
  }

  componentDidMount() {
    const { t } = this.props;
    const defaultTitle = t('field_default_title');
    this.setState(previousState => ({
      values: {
        ...previousState.values,
        title: defaultTitle,
      },
    }));
  }

  onFieldChange = (fieldName, value) => {
    this.setState(previousState => ({
      privateId: null,
      quickResult: null,
      values: {
        ...previousState.values,
        ...{
          [fieldName]: value,
        },
      },
    }));
  };

  createDraw = () => {
    const { values } = this.state;
    const { title, description, participants, prizes } = values;
    const drawData = {
      prizes: prizes.map(prize => ({ name: prize })),
      participants: participants.map(participant => ({ name: participant })),
      title: title || null,
      description: description || null,
    };
    const raffleDraw = Raffle.constructFromObject(drawData);
    return raffleApi.raffleCreate(raffleDraw);
  };

  handleToss = async () => {
    this.setState({ loadingResult: true });

    const randomNumberOfSeconds = Math.floor(Math.random() * 2.5) + 1.5;
    setTimeout(() => this.setState({ loadingResult: false }), randomNumberOfSeconds * 1000);
    let { privateId } = this.state;
    try {
      // Create the draw only if it wasn't created in a previous toss
      if (!privateId) {
        const draw = await this.createDraw();
        privateId = draw.private_id;
        this.setState({ privateId });
      }

      const tossResponse = await raffleApi.raffleToss(privateId, {});
      const { track } = this.props;
      track({
        mp: { name: `Toss - ${analyticsDrawType}`, properties: { drawType: analyticsDrawType } },
        ga: { action: 'Toss', category: analyticsDrawType },
      });
      this.setState({ quickResult: tossResponse, APIError: false });
    } catch (err) {
      this.setState({ APIError: true });
    }
  };

  handlePublish = async () => {
    const { history } = this.props;
    const { values } = this.state;
    try {
      const draw = await this.createDraw();
      const { dateScheduled } = values;
      const drawTossPayload = DrawTossPayload.constructFromObject({ schedule_date: dateScheduled });
      const tossResponse = await raffleApi.raffleToss(draw.private_id, drawTossPayload);
      const scheduleDate = moment(tossResponse.schedule_date).unix();
      const { track } = this.props;
      track({
        mp: {
          name: `Publish - ${analyticsDrawType}`,
          properties: { drawType: analyticsDrawType, drawId: draw.id },
        },
        ga: { action: 'Publish', category: analyticsDrawType, label: draw.id },
      });
      const drawPath = `/raffle/${draw.id}`;
      recentDraws.add(draw, drawPath, scheduleDate);
      history.push(drawPath);
    } catch (err) {
      this.setState({ APIError: true });
    }
  };

  handleCheckErrorsInConfiguration = () => {
    const { t } = this.props;
    const { values } = this.state;
    const { participants, prizes } = values;
    const numberOfPrizes = prizes.length;
    const numOfParticipants = participants.length;
    if (numOfParticipants < numberOfPrizes) {
      console.log('numOfParticipants', numOfParticipants);
      return t('error_form_not_enough_participants', { numberOfPrizes, count: numOfParticipants });
    }
    return undefined;
  };

  render() {
    const { APIError, values, quickResult, loadingResult } = this.state;
    const { match } = this.props;
    const { isPublic } = match.params;
    return isPublic ? (
      <RafflePage
        apiError={APIError}
        values={values}
        onFieldChange={this.onFieldChange}
        handlePublish={this.handlePublish}
        handleCheckErrorsInConfiguration={this.handleCheckErrorsInConfiguration}
      />
    ) : (
      <RaffleQuickPage
        apiError={APIError}
        values={values}
        quickResult={quickResult}
        loadingResult={loadingResult}
        handleToss={this.handleToss}
        onFieldChange={this.onFieldChange}
        handleCheckErrorsInConfiguration={this.handleCheckErrorsInConfiguration}
      />
    );
  }
}

RafflePageContainer.propTypes = {
  t: PropTypes.func.isRequired,
  track: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withTracking(withTranslation('Raffle')(RafflePageContainer));
