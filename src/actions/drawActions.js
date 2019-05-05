import { GroupsApi } from 'echaloasuerte-js-sdk';
import { FETCH_DRAW } from './types';

const groupsApi = new GroupsApi();

// eslint-disable-next-line import/prefer-default-export
export const fetchDraw = drawId => dispatch =>
  new Promise((resolve, reject) => {
    console.log('---------groupsRead: start');
    groupsApi
      .groupsRead(drawId)
      .then(draw => {
        console.log('---------groupsRead: done');
        const {
          private_id: privateId,
          title,
          description,
          participants,
          number_of_groups: numberOfGroups,
        } = draw;
        const lastToss = draw.results[0];
        const scheduleDate = lastToss.schedule_date;
        const drawData = {
          title,
          description,
          participants,
          numberOfGroups,
          scheduleDate,
          result: lastToss,
          isOwner: Boolean(privateId),
          isLoading: false,
        };
        dispatch({ type: FETCH_DRAW, payload: drawData });
        resolve();
      })
      .catch(error => {
        console.log('errrorrr', error);
        reject(error);
      });
  });
