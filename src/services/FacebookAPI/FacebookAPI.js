// eslint-disable-line no-console
const DEBUG = false;
const log = message => DEBUG && console.log(message);

/**
 * Set up the FB SDK
 * @param {function} onStatusChange - Login/logout callback.
 * @return {undefined}
 */
export const fbAsyncInit = async onStatusChange => {
  // const rezult = test_async(21, console.log);
  // const rezult2 = await test_wrapper(21);
  // console.log('rezult', rezult);
  // console.log('rezult2', rezult2);
  window.cypressEas = { statusChange: onStatusChange }; // This is only used for integration tests
  window.fbAsyncInit = () => {
    log('init FB');
    window.FB.init({
      appId: '239321593490183',
      autoLogAppEvents: true,
      xfbml: true,
      status: true,
      version: 'v3.1',
    });
    window.FB.Event.subscribe('auth.statusChange', onStatusChange);

    window.FB.Event.subscribe('auth.statusChange', response => {
      log(response.authResponse);
      if (response.authResponse) {
        log('logged in');
      } else {
        log('logged out');
      }
    });
  };
};

export const injectScript = locale => {
  // eslint-disable-next-line func-names
  (function(d, s, id) {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    const js = d.createElement(s);
    js.id = id;
    // const locale = i18n.language.replace('-', '_');
    js.src = `https://connect.facebook.net/${locale}/sdk.js`;
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};

export const onStatusChange = callback => window.FB.Event.subscribe('auth.statusChange', callback);

const promisifiedApi = (apiEndpoint, options) =>
  new Promise(resolve => {
    window.FB.api(apiEndpoint, options, response => resolve(response));
  });

/**
 * Make an API call
 * @param {string} endpoint - Endpoint to hit. E.g '/123123213/likes'
 * @param {string} accessToken - Access token used to make the request '/123123213/likes'
 * @return {Promise} - Response from the API
 */
export const apiCall = async (endpoint, accessToken = null) =>
  new Promise(async (resolve, reject) => {
    log(`Facebook API call: ${endpoint} (Access Token: ${accessToken})`);
    const options = accessToken ? { access_token: accessToken } : {};
    const response = await promisifiedApi(endpoint, options);
    if (response && !response.error) {
      return resolve(response);
    }
    return reject(response);
  });

// /**
//  * Get the current user's name and id
//  * @return {string} - Facebook pages names their AccessTokens
//  * @throws {Exception}
//  */
// export const getUserDetails = async () => {
//   const response = await apiCall('/me');
//   console.log('response', response);
//   if (response && !response.error) {
//     return { userID: response.id, userName: response.name };
//   }
//   return 'error';
// };

/**
 * Get the people who liked a given facebook object
 * @param {string} objectId - Facebook object to check
 * @param {string} pageAccessToken - Page Access Token'
 * @return {Array} - People who liked the given object
 */
export const getLikesOnObject = async (objectId, pageAccessToken = null) => {
  const response = await apiCall(`${objectId}/likes`, pageAccessToken);
  const participants = response.data.map(item => item.name);
  return participants;
  // this.onFieldChange('participants', participants);
};

function getUrlParams(search) {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  return hashes.reduce((params, hash) => {
    const [key, val] = hash.split('=');
    return Object.assign(params, { [key]: decodeURIComponent(val) });
  }, {});
}

export const getObjectIdFromUrl = urlString => {
  log('url:', urlString);
  const url = new URL(urlString);
  const path = url.pathname.replace(/\/$/, '');
  const searchParams = getUrlParams(url.search);
  let parcialObjectId = searchParams.story_fbid;
  let pageId = searchParams.id;
  if (pageId && parcialObjectId) {
    return `${pageId}_${parcialObjectId}`;
  }

  const PageRegex = /\/([0-9]+)/;
  const pageIdResults = path.match(PageRegex);
  if (!pageIdResults || pageIdResults.length <= 1) {
    throw Error('URL not valid');
  }
  pageId = pageIdResults[1];

  const objectRegex = /\/([0-9]+)(?=[^/]*$)/;
  const parcialObjectIdResults = path.match(objectRegex);
  if (!parcialObjectIdResults || parcialObjectIdResults.length <= 1) {
    throw Error('URL not valid');
  }
  parcialObjectId = parcialObjectIdResults[1];
  return `${pageId}_${parcialObjectId}`;
};

export const whoAmI = async () => {
  // const response = await apiCall('/me');
  // console.log('response', response);

  const asd = new Promise((accept, reject) => {
    const callback = response => {
      console.log(`Good to see you, ${response.name}.`);
      console.log('response', response);
      if (response && !response.error) {
        accept('cool');
      } else {
        reject(Error('not cool'));
      }
    };
    window.FB.api('/me', callback);
  });

  const response = await asd;
  console.log(response);
};

export const logout = () => {
  console.log('logging out');
  window.FB.logout(() => {
    window.FB.Auth.setAuthResponse(null, 'unknown');
    console.log('FB: logged out');
  });
};
