import React from "react";
import
{
  AppBar,
  Fab, TextField,
  Paper,
  ButtonBase,
  Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
    MenuItem, Grid, Modal, Backdrop, Fade
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import  AddIcon from '@material-ui/icons/Add';
import useGlobalHook from "use-global-hook";
import {
  apiAddMatch,
  apiGetMatches,
  apiGetMatchAssembliesByMatchId,
  apiGetStageTypes,
  apiGetHeightTypes,
  apiAddMatchAssembly,
  apiGetAreas,
  apiGetDifficulties,
  apiGetCodes,
  apiGetMatchDivers, apiGetMatchAssemblyDivers, apiAddArea, apiAddCode
} from '../api';
import CheckResponse from "./utilities/checkResponse";

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
    flexBasis: 200
  },
  textFieldAdornment: {
    width: 100,
    flexBasis: 100
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  focusVisible: {},
  complexButton: {
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $buttonBackdrop': {
        opacity: 0.15,
      },
      '& $buttonMarked': {
        opacity: 0,
      },
      '& $buttonTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  complexButtonBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  complexButtonTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  complexButtonMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
  complexButtonContext: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
}));

const initialState = {
  targetMatch: {
    zhName: '',
    enName: '',
    matchId: -1,
    startDate: '',
    endDate: '',
    matchAssemblies: []
  },
  targetAssembly: {},
  mode: -1,
  title: null,
  componentIndex: 1,
  previousComponentIndex: -1,
  loading: false,
  callRefresh: false,
  matchList: [],
  apiMessage: null,
  constants: {},
  matchDivers: [],
  matchAssemblyDivers: []
};
const TabList = [
  {
    label: "單人"
  },
  {
    label: "雙人"
  }
];

function GetFormAction(mode) {
  let action = null;
  switch (mode) {
    case 1:
      action = 'Add'; break;
    case 2:
      action = 'Edit'; break;
    case 3:
      action = 'Delete'; break;
    default:
      throw 'Unknown mode: ' + mode;
  }
  return action;
}
function GetContent(globalState, globalActions) {
  let { componentIndex } = globalState;
  let component = null;
  switch(componentIndex) {
    case 1:
      component = (<MatchList state={globalState} actions={globalActions} />); break;
    case 2:
      component = (<MatchForm actions={globalActions} state={globalState}/>); break;
    case 3:
      component = (<IndividualMatch actions={globalActions} state={globalState} />); break;
    case 4:
      component = (<MatchAssemblyForm actions={globalActions} state={globalState}/> ); break;
    case 5:
      component = (<MatchAssemblyDiverForm actions={globalActions} state={globalState} />); break;
    default:
      component = (<p>Invalid Component Index</p>); break;
  }
  return component;
}

const MatchForm = ({ state: { targetMatch: { zhName, enName, startDate, endDate, matchId }, mode },
                   actions: { handleMatchFormSubmit, backToPreviousComponent }}) => {
  const classes = useStyles;
  const [localZhName, setLocalZhName] = React.useState(zhName);
  const [localEnName, setLocalEnName] = React.useState(enName);
  const [localStartDate, setLocalStartDate] = React.useState(startDate);
  const [localEndDate, setLocalEndDate] = React.useState(endDate);
  let matchTitle = null;
  switch (mode) {
    case 1:
      matchTitle = 'Add'; break;
    case 2:
      matchTitle = 'Edit'; break;
    case 3:
      matchTitle = 'Delete'; break;
    default:
      throw 'Unknown mode: ' + mode;
  }
  matchTitle += ' Match';
  return (
      <React.Fragment>
        <h3>{matchTitle}</h3>
        <Paper className={classes.container}>
          <TextField
              label="Chinese Name"
              fullWidth
              className={classes.textField}
              value={localZhName}
              onChange={(event) => setLocalZhName(event.target.value)}
          />
          <TextField
              label="English Name"
              fullWidth
              className={classes.textField}
              value={localEnName}
              onChange={(event) => setLocalEnName(event.target.value)}
          />
          <TextField
              label={"Start Date"}
              fullWidth
              className={classes.textField}
              value={localStartDate}
              onChange={(event) => setLocalStartDate(event.target.value)}
          />
          <TextField
              label={"End Date"}
              fullWidth
              className={classes.textField}
              value={localEndDate}
              onChange={(event) => setLocalEndDate(event.target.value)}
          />
          <div>
            <button onClick={() => handleMatchFormSubmit(mode, {
                zhName: localZhName, enName: localEnName, startDate: localStartDate, endDate: localEndDate, matchId })}>
              Submit
            </button>
            <button onClick={() => backToPreviousComponent}>
              Cancel
            </button>
          </div>
        </Paper>
      </React.Fragment>
  );
};

const MatchAssemblyForm = ({ state: { mode, constants: { stageTypes, heightTypes },
  targetMatch: { zhName: matchZhName, enName: matchEnName, matchId },
  targetAssembly: {
      id, zhName, enName, stageTypeName, stageType, heightType, heightTypeName, numOfExecJudges,
      numOfSyncJudges
    }}, actions: { handleMatchAssemblyFormSubmit } }) => {
  let [localState, setLocalState] = React.useState({
    localZhName:zhName,
    localEnName:enName,
    localStageType:stageType,
    localHeightType:heightType,
    localNumOfExecJudges:numOfExecJudges,
    localNumOfSyncJudges:numOfSyncJudges
  });
  let {localZhName, localEnName, localStageType, localHeightType,
        localNumOfExecJudges, localNumOfSyncJudges} = localState;
  const classes = useStyles;
  const formTitle = GetFormAction(mode) + ' Assembly';
  const handleChange = name => event => {
    setLocalState({ ...localState, [name]: event.target.value });
  };
  return (
      <React.Fragment>
        <h3>Match: { matchEnName }</h3>
        <h4>{formTitle}</h4>
        <Paper className={classes.container}>
          <TextField
              label="Chinese Name"
              fullWidth
              className={classes.textField}
              value={localZhName || ''}
              onChange={ handleChange('localZhName') }
              helperText={'Enter the chinese name of the assembly'}
          />
          <TextField
              label="English Name"
              fullWidth
              className={classes.textField}
              value={localEnName || ''}
              onChange={ handleChange('localEnName') }
              helperText={'Enter the english name of the assembly'}
          />
          <TextField
              label="Type of Stage"
              fullWidth
              select
              className={classes.textField}
              value={localStageType || ''}
              onChange={ handleChange('localStageType') }
              helperText={'Select the type of stage'}
              margin={'normal'}
          >
            {
              stageTypes && stageTypes.length > 0 ?
                  stageTypes.map(({ id, name }, i) => (
                      <MenuItem key={i} value={id}>
                        {name}
                      </MenuItem>
                  )) : ''
            }
          </TextField>
          <TextField
              label="Height of Stage"
              fullWidth
              select
              className={classes.textField}
              value={localHeightType || ''}
              onChange={ handleChange('localHeightType') }
              helperText={'Select the height of the stage'}
              margin={'normal'}
          >
            {
              heightTypes && heightTypes.length > 0 ?
                  heightTypes.map(({ id, heightM }, i) => (
                      <MenuItem key={i} value={id}>
                        {heightM}
                      </MenuItem>
                  )) : ''
            }
          </TextField>
          <TextField
              label="No. Of Execution Judges"
              fullWidth
              className={classes.textField}
              value={localNumOfExecJudges || ''}
              onChange={ handleChange('localNumOfExecJudges') }
              helperText={'Enter the number of Execution judges. Only number is accepted'}
          />
          <TextField
              label="No. Of Synchronization Judges"
              fullWidth
              className={classes.textField}
              value={localNumOfSyncJudges || ''}
              onChange={ handleChange('localNumOfSyncJudges') }
              helperText={'Enter the number of Synchronization judges. Only number is accepted'}
          />
          <div>
            <button onClick={() => handleMatchAssemblyFormSubmit(
                mode,
                {
                  id: id,
                  Match: matchId,
                  ZhName: localZhName,
                  EnName: localEnName,
                  NumOfExecJudges: localNumOfExecJudges,
                  NumOfSyncJudges: localNumOfSyncJudges,
                  StageType: localStageType,
                  HeightType: localHeightType,
                  CreatedBy: 'dummy'
                })
            }>Submit</button>
          </div>
        </Paper>
      </React.Fragment>
  );
};

const MatchAssemblyDiverForm = ({
  state: {
    constants,
    targetMatch: { enName: matchEnName, matchId },
    targetAssembly: { id: matchAssemblyId, enName: matchAssemblyEnName }
  },
  actions: { handleSubmitMatchAssemblyDiverForm, handleSubmitAreaForm, handleSubmitCodeForm,
    getDiverFormConstants
  }
}) => {
  let [modalState, setModalState] = React.useState({
    open: false, modalTitle: '', handler: null, mode: -1,
    diver: { Id: -1, AreaId: -1, ClubName: '', CodeId: -1, DiverCname: '', DiverEname: ''},
    newArea: { AreaCname: '', AreaEname: '' }, newCode : { codeName: '' }, codeMode: 0, areaMode: 0
  });
  React.useEffect(() => {
    getDiverFormConstants();
  }, [modalState.areaMode, modalState.codeMode]);
  console.log(open);
  let { areas, difficulties, codes } = constants;
  const classes = useStyles;
  const handleDiverChange = name => event => {
    let diver = modalState.diver;
    diver[name] = event.target.value;
    setModalState({ ...modalState, diver: diver });
  };
  const handleAreaChange = name => event => {
    let area = modalState.newArea;
    area[name] = event.target.value;
    setModalState({...modalState, newArea: area });
  };
  const handleCodeChange = name => event => {
    let newCode = modalState.newCode;
    newCode[name] = event.target.value;
    setModalState({ ...modalState, newCode: newCode }); };
  const handleModeChange = name => {
    let mode = modalState[name] ? 0 : 1;
    setModalState({ ...modalState, [name]: mode });
  };
  // const handleModalOpen = () => setModalState({ ...modalState,  open: true });
  const handleModalClose = () => setModalState({ ...modalState,  open: false });
  const openAddAMatchAssemblyDiverForm = () => {
    setModalState({ mode: 1, modalTitle: 'Add Diver',
      areaMode: 0, codeMode: 0, open: true,
      newArea: { AreaCname: '', AreaEname: '' }, newCode: { codeName: '' },
      diver: { MatchAssemblyDiverId: -1, DiverId: -1, AreaId: -1, ClubName: '', CodeId: -1, DiverCname: '', DiverEname: ''} });
  }
  let {
    areaMode, codeMode, newCode: { codeName },
    newArea: { AreaCname, AreaEname },
    mode, open, modalTitle, diver: { MatchAssemblyDiverId, DiverId, AreaId, ClubName, CodeId, DiverCname, DiverEname} } = modalState;

  return (
      <React.Fragment>
        <div aria-label={'header'}>
          <Typography component="h3" variant="h5" color="inherit" align={"center"}>
            { matchEnName }
          </Typography>
          <Typography component="h3" variant="subtitle1" color="inherit" align={"center"}>
            { matchAssemblyEnName }
          </Typography>
        </div>
        <Grid container>
          <Grid item xs={6} aria-label={'match diver list'}>
          </Grid>
          <Grid item xs={6} aria-label={'current assembly diver list'}>
            <div>
              <button onClick={ openAddAMatchAssemblyDiverForm }>Add Diver</button>
            </div>
          </Grid>
        </Grid>
        <Modal
            aria-labelledby="add-diver-transition-modal"
            aria-describedby="add-diver-description-transition-modal"
            className={classes.modal}
            open={open}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, }}>
          <Fade in={open}>
            <Paper className={classes.paper}>
              <h2>{ modalTitle }</h2>
              <p>
              { mode === 1 ? ('The following diver will be added to : ' +  matchAssemblyEnName ) :
                  'Manipulating the diver in ' +  matchAssemblyEnName }
              </p>
              <TextField
                  label="Diver Chinese Name"
                  fullWidth
                  className={classes.textField}
                  value={DiverCname || ''}
                  onChange={ handleDiverChange('DiverCname') }
                  helperText={'Enter the chinese name of the diver'}
              />
              <TextField
                  label="Diver English Name"
                  fullWidth
                  className={classes.textField}
                  value={DiverEname || ''}
                  onChange={ handleDiverChange('DiverEname') }
                  helperText={'Enter the english name of the diver'}
              />
              <Grid container>
                { areaMode === 0 ? (
                    <React.Fragment>
                      <Grid item xs={10}>
                        <TextField
                            label="Area"
                            fullWidth
                            select
                            className={classes.textField}
                            value={AreaId || ''}
                            onChange={ handleDiverChange('AreaId') }
                            helperText={'Select the Area. Click (Add Area) if option is not available'}
                            margin={'normal'}
                        >
                          {
                            areas && areas.length > 0 && console.log(areas) ?
                                areas.map(({ id, areaCname, areaEname }, i) => (
                                    <MenuItem key={i} value={id}>
                                      {areaEname}
                                    </MenuItem>
                                )) : <MenuItem />
                          }
                        </TextField>
                      </Grid>
                      <Grid item xs={2}><button onClick={() => handleModeChange('areaMode')}>Add Area</button></Grid>
                    </React.Fragment>
                  ): (
                      <React.Fragment>
                        <Grid item xs={4}>
                          <TextField
                            label="Area Chinese Name"
                            fullWidth
                            className={classes.textField}
                            value={AreaCname || ''}
                            onChange={ handleAreaChange('AreaCname') }
                            helperText={'Enter the area chinese name'}
                        />
                        </Grid>
                        <Grid item xs={4}>
                        <TextField
                            label="Area English Name"
                            fullWidth
                            className={classes.textField}
                            value={AreaEname || ''}
                            onChange={ handleAreaChange('AreaEname') }
                            helperText={'Enter the area english name'}
                        />
                        </Grid>
                        <Grid item xs={4}>
                          <button onClick={() => handleModeChange('areaMode')}>Cancel</button>
                          <button onClick={() => handleSubmitAreaForm(
                              1, { AreaCname: AreaCname, AreaEname: AreaEname })}>Submit</button>
                        </Grid>
                      </React.Fragment>
                    )}
              </Grid>
              <Grid container>
                { codeMode === 0 ? (
                    <React.Fragment>
                <Grid item xs={10}>
                  <TextField
                      label="Code of the Area"
                      fullWidth
                      select
                      className={classes.textField}
                      value={CodeId || ''}
                      onChange={ handleDiverChange('CodeId') }
                      helperText={'Select the Code. Click (Add Code) if option is not available'}
                      margin={'normal'}
                  >
                    {
                      codes && codes.length > 0 ?
                          codes.map(({ Id, CodeName }, i) => (
                              <MenuItem key={i} value={Id}>
                                {CodeName}
                              </MenuItem>
                          )) : <MenuItem />
                    }
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <button onClick={() => handleModeChange('codeMode')}>Add Code</button>
                </Grid>
                    </React.Fragment>
                      ) : (
                    <React.Fragment>
                      <Grid item xs={4}>
                        <TextField
                            label="Code Name"
                            fullWidth
                            className={classes.textField}
                            value={codeName || ''}
                            onChange={ handleCodeChange('codeName') }
                            helperText={'Enter the code name'}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <button onClick={() => handleModeChange('codeMode')}>Cancel</button>
                        <button onClick={() => handleSubmitCodeForm(
                            1, { codeName: codeName }
                        )}>Submit</button>
                      </Grid>
                    </React.Fragment>
                )}
              </Grid>
              <TextField
                  label="Club name"
                  fullWidth
                  className={classes.textField}
                  value={ClubName || ''}
                  onChange={ handleDiverChange('ClubName') }
                  helperText={'Name of the club the diver belongs to. optional'}
              />
              <div>
                <button onClick={() => handleSubmitMatchAssemblyDiverForm(
                    mode,
                    {
                      MatchAssemblyDiverId: MatchAssemblyDiverId,
                      Id: DiverId,
                      AreaId: AreaId,
                      ClubName: ClubName,
                      CodeId: CodeId,
                      DiverCname: DiverCname,
                      DiverEname: DiverEname,
                      CreatedBy: 'dummy'
                    })
                }>Submit</button>
              </div>
            </Paper>
          </Fade>
        </Modal>
      </React.Fragment>
  )
};

const MatchList = ({ state: { matchList }, actions: { openAddMatchForm, refreshIndividualMatch} }) => {
  const classes = useStyles;
  return (
      <React.Fragment>
        <div>
          <button onClick={() => openAddMatchForm()}>Add Match</button>
        </div>
        {
          (!matchList || matchList.length === 0) ? ''
              : matchList.map((match, i) => {
                return (
                    <ButtonBase
                        onClick={() => refreshIndividualMatch(match.matchId)}
                        focusRipple
                        key={i}
                        className={classes.complexButton}
                        focusVisibleClassName={classes.focusVisible}
                        style={{width: '33%' }}>
                                    <span className={classes.complexButtonBackdrop} />
                                    <span className={classes.complexButtonContext}>
                          <Typography
                              component="span"
                              variant="subtitle1"
                              color="inherit"
                              className={classes.complexButtonTitle}
                          >
                            {match.zhName}<br/>
                            {match.enName}<br/>
                            {match.startDate + ' - ' + match.endDate}
                            <span className={classes.complexButtonMarked} />
                          </Typography>
                        </span>
                    </ButtonBase>
                );
              })
        }
      </React.Fragment>
  );
};

const IndividualMatch = ({ state: {
  targetMatch: {
    matchId, loading, matchAssemblies, zhName, enName, startDate, endDate
  }}, actions: {
  openEditAssemblyForm, openAddAssemblyForm, refreshIndividualMatch, openIndividualMatchAssemblyDiverForm} }) => {
  const deleteAssemblyPrompt = (item) => {
  };
  return (
      <React.Fragment>
        <div>
          <Typography component="h3" variant="h5" color="inherit" align={"center"}>
            { zhName }
          </Typography>
          <Typography component="h3" variant="h5" color="inherit" align={"center"}>
            { enName }
          </Typography>
          <Typography component="h5" variant="h5" color="inherit" align={"center"}>
            { startDate + " - " + endDate }
          </Typography>
        </div>
        <div>
          <div>
            <button onClick={() => openAddAssemblyForm()}>Add Match Assembly</button>
            <button onClick={() => refreshIndividualMatch(matchId)}>Refresh</button>
          </div>
          <Paper>
            {
              matchAssemblies && matchAssemblies.length > 0 ?
                  (
                      <Table size={'small'}>
                        <TableHead>
                          <TableRow>
                            <TableCell> </TableCell>
                            <TableCell>Chinese Name</TableCell>
                            <TableCell>English Name</TableCell>
                            <TableCell>Type of Stage</TableCell>
                            <TableCell>Height of Stage</TableCell>
                            <TableCell>No. Of Judges(E/S)</TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            matchAssemblies.map(({
                              id, matchId, zhName, enName, stageTypeName, heightTypeName, numOfExecJudges,
                              numOfSyncJudges
                            }, i) => {
                              return (
                                  <TableRow key={i}>
                                    <TableCell>
                                      <button onClick={() => openIndividualMatchAssemblyDiverForm(matchAssemblies[i])}>
                                        Manage
                                      </button>
                                    </TableCell>
                                    <TableCell>{zhName}</TableCell>
                                    <TableCell>{enName}</TableCell>
                                    <TableCell>{stageTypeName}</TableCell>
                                    <TableCell>{heightTypeName}</TableCell>
                                    <TableCell>{numOfExecJudges + '/' + numOfSyncJudges}</TableCell>
                                    <TableCell>
                                      <button onClick={() => openEditAssemblyForm(matchAssemblies[i])}>Edit</button>
                                    </TableCell>
                                    <TableCell>
                                      <button onClick={() => deleteAssemblyPrompt(matchAssemblies[i])}>Delete</button>
                                    </TableCell>
                                  </TableRow>
                              );
                            })
                          }
                        </TableBody>
                      </Table>
                  ) :
                  ''
            }
          </Paper>
        </div>
      </React.Fragment>
  );
};

const actions = {
  getMatchFormConstants: (store) => {
    store.setState({ loading: true });
    let stageTypes = [], heightTypes = [];
    let p = [];
    p.push(apiGetStageTypes());
    p.push(apiGetHeightTypes());
    Promise.all(p)
        .then((result) => {
          let check = result.filter(r => r.status === 200 && r.data && r.data.rtnCode === 0 && r.data.data.length > 0);
          if (check.length !== p.length) throw 'Failed in setting up the constants';
          else {
            return { rs: result[0].data.data, rh: result[1].data.data };
          }
        })
        .then(({rs, rh}) => {
          rs.forEach(({ id, name }, i) => { stageTypes.push({ id, name }); });
          rh.forEach(({ id, heightM }, i) => { heightTypes.push({ id, heightM }); });
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          store.setState({ loading: false, constants: { stageTypes: stageTypes, heightTypes: heightTypes } });
        });
  },
  getDiverFormConstants: store => {
    let { stageType } = store.state.targetAssembly;
    let p = [], areas = [], difficulties = [], codes = [];
    p.push(apiGetAreas());
    p.push(apiGetDifficulties(stageType));
    p.push(apiGetCodes());
    Promise.all(p)
        .then( result => {
          if (!CheckResponse(result)) throw 'API Error';
          else return result.map((r,i) => r.data.data);
        })
        .then ( data => {
          let [ _areas, _diffs, _codes ] = data;
          areas = _areas;
          difficulties = _diffs;
          codes = _codes;
        })
        .catch( err => {
          console.error(err);
        })
        .finally(() => {
          store.setState({
            ...store.state,
            constants: { areas: areas, difficulties: difficulties, codes: codes }
          });
        });
  },
  refreshMatchList: (store) => {
    store.setState({ loading: true });
    apiGetMatches()
        .then(res => {
          if (res.status === 200 && res.data) {
            let data = res.data;
            store.setState({ matchList: data });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally((data) => {
          store.setState({ loading: false, callRefresh: false });
        });
  },
  handleMatchFormSubmit: (store, mode, { zhName, enName, startDate, endDate, matchId = null }) => {
    //TODO: call api
    //TODO: change the following conditions when api is added
    if (mode === 1) {
      //add match
      //TODO: remove this dummy line and the dummy store later
      store.setState({ loading: true });
      let apiMessage = null;
      apiAddMatch({ ZhName: zhName, EnName: enName, StartDate: startDate, EndDate: endDate, CreateBy: 'ANMCStaff' })
          .then(res => {
            apiMessage = res.status === 200 ? res.description : 'API Error';
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            store.setState({ componentIndex: 1, callRefresh: true, apiMessage: apiMessage, previousComponentIndex: -1 });
            console.log(apiMessage);
          });
    } else if (mode === 2) {
      //edit match
    } else {
      //delete match
    }
  },
  handleMatchAssemblyFormSubmit: (store, mode, matchAssembly) => {
    if (mode === 1) {
      store.setState({ loading: true });
      let apiMessage = null;
      apiAddMatchAssembly(matchAssembly)
          .then( res => {
            apiMessage = res.status === 200 ? res.description: 'API Error';
          })
          .catch( err => {
            console.error(err);
          })
          .finally(() => {
            store.setState({ componentIndex: 3, callRefresh: true, apiMessage: apiMessage, previousComponentIndex: 1 });
          });
    }
  },
  handleSubmitMatchAssemblyDiverForm: (store, mode, diver) => {

  },
  handleSubmitAreaForm: (store, mode, area) => {
    if (!area.AreaCname || !area.AreaEname) {
      alert('Please enter both the area chinese and english name');
    } else {
      let done = -1;
      if (mode === 1) {
        //add
        store.setState({ ...store.state, loading: true });
        apiAddArea(area)
            .then(res => {
              if (res.status !== 200 && res.data.rtnCode !== 0) throw 'Failed. Please check the input';
              else done = 1;
            })
            .catch(err => {
              console.error(err);
              alert(err);
            })
            .finally(() => {
              store.setState({ ...store.state, loading: false });
            });
      } else if (mode === 2) {
        //edit
      } else {
        //delete
      }
    }
  },
  handleSubmitCodeForm: (store, mode, code) => {
    if (!code.codeName) {
      alert('Please enter the code name');
    } else {
      let done = -1;
      if (mode === 1) {
        //add
        store.setState({ ...store.state, loading: true });
        apiAddCode(code)
            .then(res => {
              if (res.status !== 200 && res.data.rtnCode !== 0) throw 'Failed. Please check the input';
              else done = 1;
            })
            .catch(err => {
              console.error(err);
              alert(err);
            })
            .finally(() => {
              store.setState({ ...store.state, loading: false });
            });
      } else if (mode === 2) {
        //edit
      } else {
        //delete
      }
    }
  },
  openAddMatchForm: (store) => {
    let p = store.state.componentIndex;
    store.setState({ componentIndex: 2, mode: 1, previousComponentIndex: p });
  },
  refreshIndividualMatch: (store, matchId) => {
    let targetMatch = { zhName: '', enName: '', matchId: matchId, startDate: '', endDate: '', matchAssemblies: [] };
    let p = store.state.componentIndex;
    store.setState({ loading: true });
    apiGetMatchAssembliesByMatchId({matchId})
        .then(res => {
          if (res && res.status === 200 && res.data && res.data.rtnCode === 0) {
            return res.data;
          } else {
            return { match: null, matchAssemblies: null };
          }
        })
        .then (data => {
          if (data && data) {
            let matchId = targetMatch.matchId;
            let { match: { zhName, enName, startDate, endDate }, matchAssemblies } = data;
            targetMatch = {
              zhName: zhName, enName: enName, matchId: matchId,
              startDate: startDate, endDate: endDate,
              matchAssemblies: matchAssemblies
            };
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          store.setState({ targetMatch: targetMatch, componentIndex: 3, previousComponentIndex: p, loading: false });
        });
  },
  openIndividualMatchAssemblyDiverForm: (store, matchAssembly) => {
    store.setState({ ...store.state, loading: true, targetAssembly: matchAssembly });
    //get areas, codes, difficulties and divers of the match
    // let p = [], areas = [], difficulties = [], codes = [], matchDivers = [], matchAssemblyDivers = [];
    let p = [], matchDivers = [], matchAssemblyDivers = [];
    // p.push(apiGetAreas());
    // p.push(apiGetDifficulties(stageType));
    // p.push(apiGetCodes());
    p.push(apiGetMatchDivers(store.state.targetMatch.matchId));
    p.push(apiGetMatchAssemblyDivers(store.state.targetAssembly.id));
    Promise.all(p)
        .then( result => {
          if (!CheckResponse(result)) throw 'API Error';
          else return result.map((r,i) => r.data.data);
        })
        .then ( data => {
          // let [ _areas, _diffs, _codes, _mds, _mads ] = data;
          // areas = _areas;
          // difficulties = _diffs;
          // codes = _codes;
          let [ _mds, _mads ] = data;
          matchDivers = _mds;
          matchAssembly = _mads;
        })
        .catch( err => {
          console.error(err);
        })
        .finally(() => {
          store.setState({
            ...store.state,
            componentIndex: 5, previousComponentIndex: 3, loading: false,
            // constants: { areas: areas, difficulties: difficulties, codes: codes },
            matchDivers: matchDivers, matchAssemblyDivers: matchAssemblyDivers
          });
        });
  },
  openEditAssemblyForm: (store, assembly) => {

  },
  openAddAssemblyForm: (store) => {
    let p = store.state.componentIndex;
    store.setState({ componentIndex: 4, mode: 1, previousComponentIndex: p });
  },
  backToPreviousComponent: (store) => {
    store.setState({
      ...store.state,
      componentIndex: store.state.previousComponentIndex, previousComponentIndex: -1 });
  }
};

const useGlobal = useGlobalHook(React, initialState, actions);

const MatchSetting = () => {
  let [globalState, globalActions] = useGlobal();
  const classes = useStyles();
  React.useEffect(() => {
    globalActions.refreshMatchList();
    globalActions.getMatchFormConstants();
  }, [globalState.callRefresh]);
  return (
    <React.Fragment>
      {
        globalState.loading ?
            <div>Loading...</div>
            :
            <React.Fragment>
              {
                globalState.previousComponentIndex > 0 ?
                    <div>
                      <button onClick={() => globalActions.backToPreviousComponent()}>Back</button>
                    </div> : ''
              }
              <div>
                { GetContent(globalState, globalActions) }
              </div>
            </React.Fragment>
      }
    </React.Fragment>
  );
};

export default MatchSetting;
