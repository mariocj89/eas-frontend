import * as EASApi from 'echaloasuerte-js-sdk';
import config from './config/config';

export default function() {
  const { APIBasePath } = config;
  const defaultClient = EASApi.ApiClient.instance;
  defaultClient.basePath = `${APIBasePath}12`;
  defaultClient.timeout = 3000;
}
