import React from 'react';
import {
    Grid,
    List,
    ListItem,
    Divider,
    ListItemText,
    Typography,
    Button,
    Paper,
    CardHeader,
    Card,
    CardContent,
    FormControl,
    Input,
    InputLabel
} from '@material-ui/core';
import useGlobalHook from "use-global-hook";
import GetTable from "./utilities/getTable";
import GetDiveName from './utilities/getDiveName';

function getInitialMatchSet(data) {
    let { divers, matchSetting } = data;
    let { numOfJudges, dives } = matchSetting;
    //TODO: the diveRecords may not be null. can be a continue case.
    let diveRecords = [];
    if (divers && divers.length > 0) {
        divers.map((diver, index) => {
            let diveInfo = diver.diveInfo;
            // let tmp = personalDiveRecord;
            let tmp = [];
            for (let i = 0; i < diveInfo.length; ++i) {
                let { code, difficulty } = diveInfo[i];
                let dive = { diveCode : code, diveName : GetDiveName(code), difficulty: difficulty,  result: '' };
                for (let j = 0; j < numOfJudges; ++j) {
                    dive['E' + (j + 1)] = '';
                }//inner loop
                tmp.push(dive);
            }
            diveRecords.push({
                diver: diver,
                records: tmp
            });
        }, diveRecords);//divers mapping to record initiation
    }
    return { diveRecords: diveRecords, matchSetting: matchSetting, divers: divers };
}
const initialState = {
    diverIndex: -1,
    matchIndex: -1,
    currentDive: 0,
    diveRecords: [],
    matchSetting: {},
    divers: [],
    status: -1,
    data: null
};
const actions = {
    setMatch: (store, data) => {
      let { diveRecords, matchSetting, divers } = getInitialMatchSet(data);
      store.setState({
          diveRecords: diveRecords,
          matchSetting: matchSetting,
          divers: divers,
          data: data,
          status: -1
      });
    },
    resetMatch: (store) => {
        store.setState({ status: -2, diverIndex: -1 });
    },
    resumeMatchRecoding: (store) => {
      let matchIndex = store.state.matchIndex;
      store.setState({ diverIndex: matchIndex });
    },
    setFlowStatus: (store, newStatus) => {
        if (store.state.status === -1 && newStatus ===  0) {
            //stating a NEW START
            store.setState({ status: newStatus, diverIndex: 0, matchIndex: 0 });
        } else {
            store.setState({ status: newStatus });
        }
    },
    handleDiverListOnClick: (store, diverIndex) => {
        if (store.state.status !== -1 && diverIndex > -1) {
            store.setState({ diverIndex: diverIndex });
            // console.log(store.state.status);
        } else {
            alert('Match has not been started yet...');
        }
    },
    handleTableCellOnChange: (store, rowIndex, columnID, value, event) => {
        let check = parseFloat(value);
        let {diveRecords, diverIndex} = store.state;
        let currentValue = diveRecords[diverIndex].records[rowIndex][columnID];
        if (check && !isNaN(check) && check !== currentValue) {
            try {
                if (check !== 0 && check%0.5 !== 0) {
                    event.target.style.background = 'red';
                    event.target.style.color = 'white';
                } else {
                    event.target.style.background = 'green';
                    event.target.style.color = 'white';
                }
                currentValue = check;
                diveRecords[diverIndex].records[rowIndex][columnID] = currentValue.toFixed(1);

                //check if all slots has values
                let dive = diveRecords[diverIndex].records[rowIndex];
                let allCheck = false, tmp = [];
                let numOfJudges = store.state.matchSetting.numOfJudges;
                for (let i = 1; i <= numOfJudges; ++i) {
                    let value = parseFloat(dive['E' + i]);
                    if (value && !isNaN(value)) { tmp.push(value); allCheck = true; }
                    else { allCheck = false; break; }
                }
                if (allCheck && allCheck) {
                    let result = 0.0;
                    //TODO: we should take both execution judges and synchronization judges into account
                    if (numOfJudges === 5) {
                        tmp.splice(tmp.indexOf(Math.max(...tmp)), 1);
                        tmp.splice(tmp.indexOf(Math.min(...tmp)), 1);
                    } else if (numOfJudges === 7) {
                        tmp.splice(tmp.indexOf(Math.max(...tmp)), 1);
                        tmp.splice(tmp.indexOf(Math.max(...tmp)), 1);
                        tmp.splice(tmp.indexOf(Math.min(...tmp)), 1);
                        tmp.splice(tmp.indexOf(Math.min(...tmp)), 1);
                    }
                    result = tmp.reduce((total, num) => total + num) * diveRecords[diverIndex].records[rowIndex]['difficulty'];
                    diveRecords[diverIndex].records[rowIndex]['result'] = result.toFixed(1);
                } else {
                    diveRecords[diverIndex].records[rowIndex]['result'] = '';
                }
                store.setState({ diverRecords: diveRecords });
            } catch (e) {
                console.log(e.message);
                console.log('exception encountered :' + currentValue);
                event.target.style.background = 'yellow';
                event.target.style.color = 'black';
            }
        } else {
            console.log('check failed');
        }
    }
};

const useGlobal = useGlobalHook(React, initialState, actions);

const Header = ({ state: { matchSetting: { matchCname, matchEname }, status }, actions} ) => {
  let title = null, statusMessage = null, btnText = null, newStatus = -1;
  if (!matchCname || !matchEname) {
    title = "Error loading Match Setting";
  } else {
    title = ("Current Match :" + matchCname + "/" + matchEname);
  }
  switch ( status ) {
    case -1:
        statusMessage = "PENDING/未開始";
        btnText = '開始/START';
        newStatus = 0;
        break;
    case 0: statusMessage = "RUNNING/進行中";
        btnText = '暫停/PAUSE';
        newStatus = 1;
        break;
    case 1: statusMessage = "PAUSED/暫停中";
        btnText = '繼續/CONTINUE';
        newStatus = 0;
        break;
    case 2: statusMessage = "FINISHED/已結束";
        break;
    default: statusMessage = "UNKNOWN/不明狀態";
        break;
  }
  return (
      <React.Fragment>
        <h3>Match Console</h3>
        <h5>{title}</h5>
        <Grid container spacing={1}>
            <Grid container item xs={4}>
                {
                    status !== -1 ?
                        <Button variant={"outlined"} onClick={() => actions.resetMatch()}>
                            重置比賽/RESET
                        </Button> : ''
                }
            </Grid>
            <Grid container item xs={4}>
                <Typography
                    component="h5"
                    variant="h5"
                    color="textPrimary"
                    align={'center'}
                >
                    {statusMessage}
                </Typography>
            </Grid>
            <Grid container item xs={4}>
                {
                    btnText && newStatus > -1 ?
                        <Button variant={'outlined'} onClick={() => actions.setFlowStatus(newStatus)}>
                            {btnText}
                        </Button> : ''
                }
            </Grid>
        </Grid>
      </React.Fragment>
  );
};
const Body = ({ state: { diveRecords, divers, diverIndex, matchSetting: { numOfJudges }, currentDive, status },
                actions: { handleDiverListOnClick, handleTableCellOnChange }}) => {
    if (!numOfJudges || numOfJudges === 0) {
        return (
            <React.Fragment>
                <h3>Setting Error: Number of judges is not a valid number : {numOfJudges}</h3>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Grid container spacing={1}>
                    <Grid container item xs={3} spacing={1}>
                        <DiverList divers={divers} diverIndex={diverIndex} itemOnClickHandler={handleDiverListOnClick}/>
                    </Grid>
                    <Grid container item xs={9} spacing={1}>
                        {
                            diverIndex !== undefined && diverIndex > -1 && status > -1 ?
                                (<DiveBoard diveRecord={diveRecords[diverIndex]} currentDive={currentDive}
                                       numOfJudges={numOfJudges} cellUpdateHandler={handleTableCellOnChange}/>)
                                :
                                <h3>
                                    Match is ready... please press start
                                </h3>
                        }
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
};
const DiveJudgeBox = ({initialValue, currentDive, judgeName, updateHandler}) => {
    const [value, setValue] = React.useState(initialValue);
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);
    return (
        <React.Fragment>
            <InputLabel htmlFor="component-simple">{judgeName}</InputLabel>
            <Input id={judgeName} value={value || ''} onChange={(event) => setValue(event.target.value)}
                   onBlur={(event) => updateHandler(currentDive, judgeName, event.target.value, event)}
                   onKeyUp={(event) => {
                       let key = (event.which === 'number') ? event.which : event.keyCode;
                       if (key === 13 && initialValue !== value) {
                           updateHandler(currentDive, judgeName, value, event);
                           if (initialValue !== value) {
                               setValue(initialValue);
                           }
                       }
                   }}
            />
        </React.Fragment>
    );
};
const DiveBoard =  ({ diveRecord : {diver, records}, numOfJudges, currentDive, cellUpdateHandler }) => {
    let judgeColumns = [];
    let validResult = records[currentDive]['result'] !== '' && !isNaN(parseFloat(records[currentDive]['result']));
    for (let i = 0; i < numOfJudges; ++i) {
        let key = 'E' + (i+1);
        judgeColumns.push({
            'Header' : key, 'accessor' : key,
            'CanEdit': true,
            'width': 50, 'padding': 'none', 'size': 'small' });
    }
    //TODO: set the marking plots
    let columns = React.useMemo(() => [
        {
            'Header': 'Dive Code',
            'accessor': 'diveCode',
        },
        {
            'Header': 'Difficulty',
            'accessor': 'difficulty'
        },
        {
            'Header': 'Dive Name',
            'accessor': 'diveName',
        },
        {
            'Header': 'Marks',
            'columns': [
                {
                    'Header': 'Execution',
                    'columns': judgeColumns,
                },
                {
                    'Header': 'Result',
                    'columns': [{ 'accessor': 'result'}]
                }
            ]
        }
    ], [judgeColumns]);
    let data = React.useMemo(() => records, [records]);
    //for the diver information table
    let { areaCname, clubName, code, diverCname, diverEname } = diver;
    let diverInfoData = React.useMemo(() => [diver], [diver]);
    //for the dive information table
    let { diveCode, diveName, difficulty } = records[currentDive];
    let judgeProperties = Object.keys(records[currentDive]).filter(key => key.indexOf('E') > -1);
    return (
        <React.Fragment>
            <Card>
                <CardHeader title={'Current Dive - Diver: ' + ((diverCname && diverCname ? (diverCname + '/') : '') + diverEname) +
                    ' Dive No.: ' + (currentDive + 1)}/>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>Area: {code}/{areaCname}</Grid>
                        <Grid item xs={2}>Club: {clubName}</Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>Code: {diveCode}</Grid>
                        <Grid item xs={3}>Difficulty: {difficulty}</Grid>
                        <Grid item xs={7}>Name: {diveName}</Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems={'center'}>
                        <Grid item xs={Math.floor((12 - judgeProperties.length)/2)} />
                        {
                            judgeProperties.map((j, i) => {
                                return (
                                    <Grid item xs={1} key={i}>
                                        <FormControl>
                                            <DiveJudgeBox initialValue={records[currentDive][j]}
                                                          currentDive={currentDive}
                                                          judgeName={j}
                                                          updateHandler={cellUpdateHandler}/>
                                        </FormControl>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    { GetTable({ columns, data, editable: true, cellUpdateHandler: cellUpdateHandler }) }
                </CardContent>
            </Card>
        </React.Fragment>
    );
};
const DiverList = ({ divers, diverIndex, itemOnClickHandler }) => {
    if (divers && divers.length > 0) {
        let list = [];
        divers.map(({
                        areaCname, clubName, code, diverCname,
                        diverEname, diveCodes
                    }, i) => {
            let primaryRow = (diverCname && diverCname ? (diverCname + '/') : '') + diverEname;
            let secondaryRow = areaCname + '/' + code;
            list.push (
                    <ListItem button alignItems={"flex-start"} selected={diverIndex === i} key={i}
                        onClick={() => itemOnClickHandler(i)}>
                        <ListItemText
                            primary={primaryRow}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                    >
                                        {secondaryRow}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
            );
            if ((i+1) !== divers.length) {
                list.push(<Divider variant="inset" component="li" key={'divider-' + i} />);
            }
        });
        return (
            <React.Fragment>
                <List>
                {list}
                </List>
            </React.Fragment>
        );
    } else {
        return null;
    }
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
              diverEname: "Lam Chi Hei", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "澳門", clubName: "澳潛", code: "MAC",
              diverCname: "關心悅", diverEname: "Kwan Sam Ut", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "澳門", clubName: "棘刺", code: "MAC",
              diverCname: "趙婞愉", diverEname: "Zhao Hang U", diveInfo: [{code: '303A', difficulty: '2.7'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "澳門", clubName: "澳潛", code: "MAC",
              diverCname: "關樹澄", diverEname: "Kuan Shu Ching", diveInfo: [{code: '401A', difficulty: '1.8'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "澳門", clubName: "澳潛", code: "MAC",
              diverCname: "董意晴", diverEname: "Tung I Cheng Miya", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "香港", clubName: "中體聯",	code: "HK-CSU",
              diverCname: "郭慧恩", diverEname: "Kwok Wai Yan", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "香港", clubName: "中體聯", code: "HK-CSU",
              diverCname: "徐    悦", diverEname: "Chui Yuet", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "新加坡", clubName: "",	code: "SGP",
              diverCname: "", diverEname: "Alexis THOMAS", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "新加坡", clubName: "",	code: "SGP",
              diverCname: "", diverEname: "Ainslee KWANG", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "北京", clubName: "應雄", code: "Beijing",
              diverCname: "李研心", diverEname: "Li Yanxin", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]},
          {areaCname: "深圳", clubName: "南油小學", code: "Shenzhen",
              diverCname: "謝沁霖", diverEname: "Xie Qinling", diveInfo: [{code: '100A', difficulty: '1.0'}, {code: '101B', difficulty: '1.3'}, {code: '000A', difficulty: '1.0'}, {code: '000B', difficulty: '1.0'}]}      ]
    };
    globalActions.setMatch(data);
  }, [globalState.status === -2]);
  return (
    <React.Fragment>
      <Header state={globalState || {}} actions={globalActions || {}}/>
      <Body state={globalState || {}} actions={globalActions || {}}/>
    </React.Fragment>    
  );
};

export default RunMatch;