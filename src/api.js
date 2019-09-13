import axios from 'axios';

const APIHost = 'http://localhost';
const APIBase = '/ANMCApi/api';

// Difficulty Table api
const diffTableRequest = axios.create({
  baseURL: APIHost + APIBase + '/difficulties'
});

// Difficulty Table api calls
export const apiGetDifficulties = stageType => diffTableRequest.get('/stageType/' + stageType);

