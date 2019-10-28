import axios from 'axios';

const APIHost = 'http://localhost';
// const APIHost = 'http://10.211.55.6';
const APIBase = '/ANMCApi/api';
const config = { headers : { 'Content-Type': 'application/json;charset=UTF-8'}};
function getDeleteBody(data) {
    let c = config;
    c['data'] = data;
    return c;
}

const diffTableRequest = axios.create({baseURL: APIHost + APIBase + '/difficulties'});
const matchTableRequest = axios.create({baseURL: APIHost + APIBase + '/matches'});
const matchAssembliesTableRequest = axios.create({baseURL: APIHost + APIBase + '/matchAssemblies'});
const stageTypeTableRequest = axios.create({baseURL: APIHost + APIBase + '/stageType'});
const heightTypeTableRequest = axios.create({ baseURL: APIHost + APIBase + '/heightType'});
const diverTableRequest = axios.create({ baseURL: APIHost + APIBase + '/diver'});
const areaTableRequest = axios.create({  baseURL: APIHost + APIBase + '/area'});
const codeTableRequest = axios.create({  baseURL: APIHost + APIBase + '/code'});

//Stage Type Table api calls
export const apiGetStageTypes = () => stageTypeTableRequest.get('');
//Height Type Table api calls
export const apiGetHeightTypes = () => heightTypeTableRequest.get('');
//Difficulty Table api calls
export const apiGetDifficulties = stageType => diffTableRequest.get('/stageType/' + (stageType && stageType ? stageType : ''));
export const apiGetDifficultiesByStageAndHeight = (stageType, heightType) => diffTableRequest.get('/stageType/' + stageType + '/heightType/' + heightType);
export const apiGetAllDifficulties = () => diffTableRequest.get('');
//Match Table api calls
export const apiGetMatches = () => matchTableRequest.get('');
export const apiAddMatch = match => matchTableRequest.post(
    '',
    match,
    config);
//Match Assemblies Table api calls
export const apiGetMatchAssembliesByMatchId = ({matchId}) => matchAssembliesTableRequest.get('/matchId/' + matchId);
export const apiAddMatchAssembly = matchAssembly => matchAssembliesTableRequest.post('', matchAssembly, config );
export const apiEditMatchAssembly = matchAssembly => matchAssembliesTableRequest.put('', matchAssembly, config);
export const apiDeleteMatchAssembly = matchAssembly => matchAssembliesTableRequest.delete('', getDeleteBody(matchAssembly));
//Diver Table api calls
export const apiGetMatchDivers = matchId => diverTableRequest.get('/match/matchId/' + matchId);
export const apiGetMatchAssemblyDivers = matchAssemblyId => diverTableRequest.get('/matchAssembly/matchAssemblyId/' + matchAssemblyId);
export const apiAddMatchAssemblyDiver = matchAssemblyDiver => diverTableRequest.post('/matchAssembly', matchAssemblyDiver);
export const apiEditMatchAssemblyDiver = matchAssemblyDiver => diverTableRequest.put('/matchAssembly', matchAssemblyDiver);
//Area Table api calls
export const apiGetAreas = () => areaTableRequest.get('');
export const apiAddArea = area => areaTableRequest.post('', area);
//Code Table api calls
export const apiGetCodes = () => codeTableRequest.get('');
export const apiAddCode = (codeName) => codeTableRequest.post('', codeName );
