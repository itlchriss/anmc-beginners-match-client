import React from 'react';
import {
  Grid
} from '@material-ui/core';
import useGlobalHook from "use-global-hook";
import MatchSetting from "./matchSetting";

const initialState = {
  diverIndex: -1,
  diveRecords: [],
  matchSetting: {},
  divers: [],
  status: -1
};
const actions = {
  resetMatch: (store, data) => {
    let { divers, matchSetting } = data;
    let { numOfJudges, dives } = matchSetting;
    let diveRecords = store.state.diveRecords;
    if (divers && divers.length > 0) {
      let personalDiveRecord = [];
      //TODO: personalRecords should have divers' dive codes
      for (let i = 0; i < dives; ++i) {
        let dive = { code: '', };
        let record = {};
        for (let j = 0; j < numOfJudges; ++j) {
          record['E' + (j+1)] = 0.0;
        }//inner loop
        dive['record'] = record;
        personalDiveRecord.push(dive);
      }//outer loop
      divers.map((diver, index) => {
        //TODO: the diveRecords may not be null. can be a continue case.
        let tmp = personalDiveRecord;
        let codes = diver.diveCodes;
        diveRecords.push({
          diver: diver,
          records: tmp.map((v, i) => { v.code = codes[i]; return v; }, codes)
        });
      });//divers mapping to record initiation
      store.setState({ diveRecords: diveRecords, matchSetting: matchSetting, divers: divers });
    }
  },
};

const useGlobal = useGlobalHook(React, initialState, actions);

const MatchHeader = ( { state: { matchSetting: { matchCname, matchEname }, status }} ) => {
  let title = null, statusMessage = null;
  if (!matchCname || !matchEname) {
    title = "Error loading Match Setting";
  } else {
    title = ("Current Match :" + matchCname + "/" + matchEname);
  }
  switch ( status ) {
    case -1: statusMessage = "PENDING/未開始"; break;
    case 0: statusMessage = "RUNNING/進行中"; break;
    case 1: statusMessage = "PAUSED/暫停中"; break;
    case 2: statusMessage = "FINISHED/已結束"; break;
    default: statusMessage = "UNKNOWN/不明狀態"; break;
  }
  return (
      <React.Fragment>
        <h3>Match Console</h3>
        <h5>{title}</h5>
        <h5>{statusMessage}</h5>
      </React.Fragment>
  );
};
const DiveBoard =  ({ state: { diveRecords, status }}) => {

};
const DiverList = ({ state: { divers }}) => {

};
const RunMatch = () => {
  let [globalState, globalActions] = useGlobal();
  React.useEffect(() => {
    //assume we have api obtaining an object with the following structure
    //{
    // matchSetting: {
    //   numOfJudges: int,
    //   dives: int,
    //   matchCname: string,
    //   matchEname: string
    // }, divers: [
    //  array of {
    //  areaCname: string,
    //  code: string,
    //  diverCname: string,
    //  diverEname: string,
    //  clubName: string}
    // ]}
    let data = {
      matchSetting: {
        numOfJudges: 5,
        dives: 4,
        matchCname: "女子 入門組(B4)單人1米板",
        matchEname: "Beginner Girls(B4) - 1m Springboard"
      },
      divers : [
        {areaCname: "澳門", clubName: "棘刺", code: "MAC", diverCname: "林紫晞",
          diverEname: "Lam Chi Hei", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "澳門", clubName: "澳潛", code: "MAC",
          diverCname: "關心悅", diverEname: "Kwan Sam Ut", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "澳門", clubName: "棘刺", code: "MAC",
          diverCname: "趙婞愉", diverEname: "Zhao Hang U", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "澳門", clubName: "澳潛", code: "MAC",
          diverCname: "關樹澄", diverEname: "Kuan Shu Ching", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "澳門", clubName: "澳潛", code: "MAC",
          diverCname: "董意晴", diverEname: "Tung I Cheng Miya", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "香港", clubName: "中體聯",	code: "HK-CSU",
          diverCname: "郭慧恩", diverEname: "Kwok Wai Yan", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "香港", clubName: "中體聯", code: "HK-CSU",
          diverCname: "徐    悦", diverEname: "Chui Yuet", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "新加坡", clubName: "",	code: "SGP",
          diverCname: "", diverEname: "Alexis THOMAS", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "新加坡", clubName: "",	code: "SGP",
          diverCname: "", diverEname: "Ainslee KWANG", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "北京", clubName: "應雄", code: "Beijing",
          diverCname: "李研心", diverEname: "Li Yanxin", diveCodes: ['100A', '101B', '000A', '000B']},
        {areaCname: "深圳", clubName: "南油小學", code: "Shenzhen",
          diverCname: "謝沁霖", diverEname: "Xie Qinling", diveCodes: ['100A', '101B', '000A', '000B']}
      ]
    };
    globalActions.resetMatch(data);
  }, []);
  return (
    <React.Fragment>
      <MatchHeader state={globalState || {}}/>
    </React.Fragment>    
  );
};

export default RunMatch;