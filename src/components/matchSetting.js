import React from "react";
import
{
  AppBar,
  Fab, TextField,
  Paper,
  ButtonBase,
  Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
    MenuItem, Grid, Modal, Backdrop, Fade,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
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
    apiGetMatchDivers,
    apiGetMatchAssemblyDivers,
    apiAddArea,
    apiAddCode,
    apiGetAllDifficulties,
    apiDeleteMatchAssembly,
    apiAddMatchAssemblyDiver
} from '../api';
import { CheckResponse, CheckResponseAcceptEmptyData } from "./utilities/checkResponse";
import Button from "@material-ui/core/Button";
import getDiveName from "./utilities/getDiveName";

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
      action = '[Action not Initialized. Please close the form and reopen]'; break;
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
    case 6:
      component = (<ConstantSetting actions={globalActions} state={globalState}/>); break;
    default:
      component = (<p>Invalid Component Index</p>); break;
  }
  return component;
}

const ConstantSetting = ({
  state: {
    constants: { areas, difficulties, codes },
      apiMessage
  },
  actions: {
    getDiverFormConstants,
    handleSubmitAreaForm,
    handleSubmitCodeForm
  }
}) => {
  const [state, setState] = React.useState({
    areaFormOpen: false, codeFormOpen: false, deleteFormOpen: false, mode: -1,
    areaModel: { Id: -1, AreaCname: '', AreaEname: ''},
    codeModel: { Id: -1, CodeName: '' },
    deleteConfirmHandler: null
  });
  React.useEffect(() => {
    getDiverFormConstants();
  }, []);
  const classes = useStyles;
  const { areaFormOpen, codeFormOpen, deleteFormOpen, areaModel, codeModel, deleteConfirmHandler, mode } = state;
  const handleFieldChange = (modelName, fieldName) => event => {
    setState({ ...state, [modelName]: { ...state[modelName], [fieldName]: event.target.value } });
  };
  const handleDeleteDialogChange = (open, handler) => {
    setState({ ...state, deleteFormOpen: open, deleteConfirmHandler: handler });
  };
  const handleModalChange = (name, value, mode = -1, handler = null, model = {}) => {
    let modelName = name.toString().replace('FormOpen', 'Model');
    setState({ ...state, [name]: value, mode: mode, deleteConfirmHandler: handler, [modelName]: model });
  };
  return (
      <React.Fragment>
        <div>
          <Typography component="h3" variant="h5" color="inherit" align={"center"}>
            Constants Setting
          </Typography>
          <Typography component="h3" variant="subtitle1" color="inherit" align={"center"}>
            Area/Code
          </Typography>
        </div>
        <div>
          <button onClick={() => handleModalChange('areaFormOpen', true, 1)}>Add Area</button>
          <button onClick={() => handleModalChange('codeFormOpen', true, 1)}>Add Code</button>
        </div>
        <div>
          { apiMessage ? ('Last operation: ' + apiMessage) : ''}
        </div>
        {
          areas && areas.length > 0 ?
              (<Table size={'small'} aria-label={'area-table'}>
                <TableHead>
                  <TableRow>
                    <TableCell>Area Chinese Name</TableCell>
                    <TableCell>Area English Name</TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    areas.map(({Id, AreaCname, AreaEname}, index) => {
                      return (
                          <TableRow key={index}>
                            <TableCell>{AreaCname}</TableCell>
                            <TableCell>{AreaEname}</TableCell>
                              <TableCell>
                              <button onClick={() => handleModalChange(
                                  'areaFormOpen', true, 2, null, areas[index])}>Edit</button>
                            </TableCell>
                            <TableCell>
                              <button onClick={() => handleDeleteDialogChange(
                                  true,
                                  () => handleSubmitAreaForm(3, areas[index]))}>Delete</button>
                            </TableCell>
                          </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>) :
              (<p>No area records</p>)
        }
        {
          codes && codes.length > 0 ?
              (<Table size={'small'} aria-label={'code-table'}>
                <TableHead>
                  <TableRow>
                    <TableCell>Code Name</TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    codes.map(({Id, CodeName}, index) => {
                      return (
                          <TableRow key={index}>
                            <TableCell>{CodeName}</TableCell>
                            <TableCell>
                              <button onClick={() => handleModalChange(
                                  'codeFormOpen', true, 2, null, codes[index])}>Edit</button>
                            </TableCell>
                            <TableCell>
                              <button onClick={() => handleDeleteDialogChange(
                                  true,
                                  () => handleSubmitCodeForm(3, codes[index]))}>Delete</button>
                            </TableCell>
                          </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>) :
              (<p>No code records</p>)
        }
        <Dialog
            aria-labelledby="delete-transition-dialog"
            aria-describedby="delete-description-transition-dialog"
            open={deleteFormOpen}
            onClose={() => handleDeleteDialogChange(false)}>
          <DialogTitle id={'delete-transition-dialog'}>
            Deleting...?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>This action will delete the selected data...</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={deleteConfirmHandler} color={'secondary'}>Confirm</Button>
            <Button onClick={() => handleDeleteDialogChange(false)} color={'primary'}>Close</Button>
          </DialogActions>
        </Dialog>
        {
          mode !== -1 ?
              (<React.Fragment>
                <Dialog
                    aria-labelledby="area-transition-dialog"
                    aria-describedby="area-description-transition-dialog"
                    open={areaFormOpen}
                    onClose={() => handleModalChange('areaFormOpen', false)}>
                  <DialogTitle id={'area-transition-dialog'}>
                    { GetFormAction(mode) + ' Area' }
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>Please fill all * fields</DialogContentText>
                    <TextField
                        label="Area Chinese Name"
                        required
                        fullWidth
                        className={classes.textField}
                        value={ areaModel.AreaCname || ''}
                        onChange={ handleFieldChange('areaModel', 'AreaCname') }
                        helperText={'Enter the chinese name of the area'}
                    />
                    <TextField
                        label="Area English Name"
                        required
                        fullWidth
                        className={classes.textField}
                        value={ areaModel.AreaEname || ''}
                        onChange={ handleFieldChange('areaModel', 'AreaEname') }
                        helperText={'Enter the english name of the area'}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => handleSubmitAreaForm(mode, areaModel)} color={'primary'}>Submit</Button>
                    <Button onClick={() => handleModalChange('areaFormOpen', false )} color={'secondary'}>Close</Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                    aria-labelledby="code-transition-dialog"
                    aria-describedby="code-description-transition-dialog"
                    open={codeFormOpen}
                    onClose={() => handleModalChange('codeFormOpen', false)}>
                  <DialogTitle id={'code-transition-dialog'}>
                    { GetFormAction(mode) + ' Code' }
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>Please fill all * fields</DialogContentText>
                    <TextField
                        label="Code Name"
                        required
                        fullWidth
                        className={classes.textField}
                        value={ codeModel.CodeName || ''}
                        onChange={ handleFieldChange('codeModel', 'CodeName') }
                        helperText={'Enter the code name of an area'}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => handleSubmitCodeForm(mode, codeModel)} color={'primary'}>Submit</Button>
                    <Button onClick={() => handleModalChange('codeFormOpen', false )} color={'secondary'}>Close</Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>) : ''}
      </React.Fragment>
  );
};

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
      Id, ZhName, EnName, StageTypeName, StageType, HeightType, HeightTypeName, NumOfExecJudges,
      NumOfSyncJudges, Dives
    }}, actions: { handleMatchAssemblyFormSubmit } }) => {
  let [localState, setLocalState] = React.useState({
    localZhName:ZhName,
    localEnName:EnName,
    localStageType:StageType,
    localHeightType:HeightType,
    localNumOfExecJudges:NumOfExecJudges,
    localNumOfSyncJudges:NumOfSyncJudges,
    localDives: Dives
  });
  let {localZhName, localEnName, localStageType, localHeightType,
        localNumOfExecJudges, localNumOfSyncJudges, localDives} = localState;
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
                  stageTypes.map(({ Id, Name }, i) => {
                      return (
                          <MenuItem key={i} value={Id}>
                            {Name}
                          </MenuItem>
                      );
                  }) : ''
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
                  heightTypes.map(({ Id, HeightM }, i) => {
                    return(
                        <MenuItem key={i} value={Id}>
                          {HeightM}
                        </MenuItem>);
                  }) : ''
            }
          </TextField>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                  label="No. Of Execution Judges"
                  fullWidth
                  className={classes.textField}
                  value={localNumOfExecJudges || 0}
                  onChange={ handleChange('localNumOfExecJudges') }
                  helperText={'Enter the number of Execution judges. Only number is accepted'}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
              label="No. Of Synchronization Judges"
              fullWidth
              className={classes.textField}
              value={localNumOfSyncJudges || 0}
              onChange={ handleChange('localNumOfSyncJudges') }
              helperText={'Enter the number of Synchronization judges. Only number is accepted'}
          />
            </Grid>
            <Grid item xs={4}>
              <TextField
                  label="No. Of Dives"
                  fullWidth
                  required
                  className={classes.textField}
                  value={localDives || 0}
                  onChange={ handleChange('localDives') }
                  helperText={'Enter the number of Dives. Only number is accepted'}
              />
            </Grid>
          </Grid>
          <div>
            <button onClick={() => handleMatchAssemblyFormSubmit(
                mode,
                {
                  id: Id,
                  Match: matchId,
                  ZhName: localZhName,
                  EnName: localEnName,
                  NumOfExecJudges: localNumOfExecJudges,
                  NumOfSyncJudges: localNumOfSyncJudges,
                  StageType: localStageType,
                  HeightType: localHeightType,
                  Dives: localDives,
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
    targetAssembly: { Id: matchAssemblyId, EnName: matchAssemblyEnName, Dives: Dives, StageType, HeightType }
  },
  actions: { handleSubmitMatchAssemblyDiverForm, handleSubmitAreaForm, handleSubmitCodeForm,
    getDiverFormConstants
  }
}) => {
  let [modelState, setModelState] = React.useState({
    open: false, modelTitle: '', handler: null, mode: -1,
    diver: { Id: -1, AreaId: -1, ClubName: '', CodeId: -1, DiverCname: '', DiverEname: '',
        DiveInfo: []},
    diverList: [],
    matchDiverList: [],
    fetching: false
  });
  React.useEffect(() => {
    getDiverFormConstants();
    setModelState({ ...modelState, fetching: true });
    apiGetMatchAssemblyDivers(matchAssemblyId)
        .then(res => {
            if (res.status === 200) {
                setModelState({ ...modelState, diverList: res.data.data });
            } else {
                throw 'apiGetMatchAssemblyDivers Error';
            }
        })
        .catch ( err => console.error(err))
        .finally(() => {
            setModelState({ ...modelState, fetching: false });
        });
    console.log('mount');
  }, []);

  let { areas, difficulties, codes } = constants;
  const classes = useStyles;
  const handleDiverChange = name => event => {
    let diver = modelState.diver;
    diver[name] = event.target.value;
    setModelState({ ...modelState, diver: diver });
  };
  const handleDiveInfoChange = (field, index) => event => {
    let diver = modelState.diver;
    let diveInfo = diver.DiveInfo;
    let value = event.target.value.toString().trim();
    diveInfo[index][field] = value;
    if (field === 'diveCode' && (value.length === 4 || value.length === 5)) {
        let check = false;
        switch (value.length) {
            case 4: check = new RegExp('([0-9]{3})([A-Z])', 'g').exec(value); break;
            case 5: check = new RegExp('([0-9]{4})([A-Z])', 'g').exec(value); break;
            default: check = null; break;
        }
        if (!check) diveInfo[index]['newPair'] = -1;
        else {
            diveInfo[index]['diveName'] = getDiveName(value);
            let targetDiff = difficulties.filter(
                d => Number(d.Code) === Number(check[1]) &&
                    Number(d.StageType) === Number(StageType) &&
                        Number(d.HeightType) === Number(HeightType));
            diveInfo[index]['difficulty'] =
                targetDiff && targetDiff[0] && Object.keys(targetDiff[0]).indexOf(check[2]) ? targetDiff[0][check[2]] : '';
            diveInfo[index]['status'] = diveInfo[index]['difficulty'] && diveInfo[index]['difficulty'] ? 0 : 1;
        }
    } else if (value.length < 4) {
        diveInfo[index]['status'] = -2;
    } else {
        diveInfo[index]['status'] = -1;
    }
    diver.DiveInfo = diveInfo;
    setModelState({ ...modelState, diver: diver})
  };
  const handleModalClose = () => setModelState({ ...modelState,  open: false });
  const openAddAMatchAssemblyDiverForm = () => {
      let diveInfo = [];
      if (Dives && Dives) {
          for (let i = 0; i < Dives; ++i) {
              diveInfo.push({ diveCode: '', difficulty: '', status: -2, diveName: '' });
          }
      }
    setModelState({
    ...modelState,
        mode: 1, modalTitle: 'Add Diver',
      open: true,
      diver: {
        MatchAssemblyDiverId: -1, DiverId: -1, AreaId: -1, ClubName: '',
          CodeId: -1, DiverCname: '', DiverEname: '', DiveInfo: diveInfo } });
  };
  let {
    mode, open, modelTitle,
      diver: { MatchAssemblyDiverId, DiverId, AreaId, ClubName, CodeId, DiverCname, DiverEname, DiveInfo} } = modelState;
  const getDiverInfoStyle = (status) => {
    let bg = '', fg = 'white';
    switch (status) {
        case -2:
            //init
            bg = 'white'; fg = 'grey';
            break;
        case -1:
            //invalid input
            bg = 'red';
            break;
        case 0:
            //normal and target
            bg = 'green';
            break;
        case 1:
            //normal but value is new to db
            bg = 'blue';
            break;
        default:
            //unknown case
            bg = 'black';
            break;
    }
    return { borderWidth: 1, borderStyle: 'solid', borderColor: bg, color: fg };
  };
  const getDiverInfoHelperText = (status, diveName) => {
      let text = '';
      switch (status) {
          case -2:
              //init
              text = 'Please input the dive code first. The corresponding difficulty will be shown if available';
              break;
          case -1:
              //invalid input
              text = 'Dive code input is invalid. Please check again';
              break;
          case 0:
              //normal and target
              text = diveName;
              break;
          case 1:
              //normal but value is new to db
              text = diveName + '. Please input the difficulty as current database does not have the record';
              break;
          default:
              //unknown case
              text = 'Unknown error';
              break;
      }
      return text;
  };
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
        <Dialog open={modelState.fetching}>
          <DialogContent>
              <DialogContentText>Fetching Data...Please wait...</DialogContentText>
          </DialogContent>
        </Dialog>
        <Grid container>
          <Grid item xs={6} aria-label={'match diver list'}>
          </Grid>
          <Grid item xs={6} aria-label={'current assembly diver list'}>
            <div>
              <button onClick={ openAddAMatchAssemblyDiverForm }>Add Diver</button>
            </div>
          </Grid>
        </Grid>
        <Dialog
            aria-labelledby="add-diver-transition-modal"
            aria-describedby="add-diver-description-transition-modal"
            open={open}
            onClose={handleModalClose}>
          <DialogTitle className={classes.paper}>
            { modelTitle }
          </DialogTitle>
          <DialogContent>
              <DialogContentText>
              { mode === 1 ? ('The following diver will be added to : ' +  matchAssemblyEnName ) :
                  'Manipulating the diver in ' +  matchAssemblyEnName }
              </DialogContentText>
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
                  required
                  className={classes.textField}
                  value={DiverEname || ''}
                  onChange={ handleDiverChange('DiverEname') }
                  helperText={'Enter the english name of the diver'}
              />
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                      label="Area"
                      fullWidth
                      select
                      required
                      className={classes.textField}
                      value={AreaId || ''}
                      onChange={ handleDiverChange('AreaId') }
                      helperText={'Select the Area. Click (Add Area) if option is not available'}
                      margin={'normal'}
                  >
                    {
                      areas && areas.length > 0 ?
                          areas.map(({ Id, AreaCname, AreaEname }, i) => {
                            return (
                                <MenuItem key={i} value={Id}>
                                  {AreaEname}
                                </MenuItem>
                            );
                          }) : <MenuItem />
                    }
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                      label="Code of the Area"
                      fullWidth
                      select
                      required
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
              </Grid>
              <TextField
                  label="Club name"
                  fullWidth
                  className={classes.textField}
                  value={ClubName || ''}
                  onChange={ handleDiverChange('ClubName') }
                  helperText={'Name of the club the diver belongs to. optional'}
              />
              {
                  DiveInfo ? DiveInfo.map(({ diveCode, difficulty, status, diveName }, index) => {
                      return (
                      <Grid container key={index} style={getDiverInfoStyle(status)}>
                          <Grid item xs={6}>
                              <TextField
                                  label={"Dive code #" + (index + 1)}
                                  fullWidth
                                  className={classes.textField}
                                  value={diveCode || ''}
                                  onChange={ handleDiveInfoChange('diveCode', index) }
                                  helperText={'Dive Code of the corresponding dive'}
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <TextField
                                  label={"Difficulty"}
                                  fullWidth
                                  className={classes.textField}
                                  value={difficulty || ''}
                                  onChange={ handleDiveInfoChange('difficulty', index) }
                                  helperText={getDiverInfoHelperText(status, diveName)}
                              />
                           </Grid>
                      </Grid>
                      );
                  }) : <React.Fragment/>
              }
              <DialogActions>
                <Button onClick={() => {
                    handleSubmitMatchAssemblyDiverForm(
                        mode,
                        {
                            MatchAssemblyDiverId: MatchAssemblyDiverId,
                            Id: DiverId,
                            AreaId: AreaId,
                            ClubName: ClubName,
                            CodeId: CodeId,
                            DiverCname: DiverCname,
                            DiverEname: DiverEname,
                            DiveInfo: DiveInfo,
                            CreatedBy: 'dummy'
                        })
                    }
                } color={'primary'}>Submit</Button>
                <Button onClick={handleModalClose} color={'secondary'}>Close</Button>
              </DialogActions>
          </DialogContent>
        </Dialog>
      </React.Fragment>
  )
};

const MatchList = ({ state: { matchList }, actions: { openAddMatchForm, openIndividualMatch} }) => {
  const classes = useStyles;
  const handleAddMatchClick = () => event => {
    event.preventDefault();
    openAddMatchForm();
  };
  const handleOpenIndividualMatch = (matchId) => event => {
    event.preventDefault();
    openIndividualMatch(matchId);
  };
  return (
      <React.Fragment>
        <div>
          <Button onClick={handleAddMatchClick} variant={'outlined'} color={'primary'}>Add Match</Button>
        </div>
        {
          (!matchList || matchList.length === 0) ? ''
              : matchList.map((match, i) => {
                return (
                    <ButtonBase
                        onClick={handleOpenIndividualMatch(match.matchId)}
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
  openEditAssemblyForm, openAddAssemblyForm, refreshIndividualMatch, openIndividualMatchAssemblyDiverForm,
  goToComponent, handleMatchAssemblyFormSubmit
} }) => {
  let [state, setState] = React.useState({
    deleteDialogOpen: false, targetAssembly: {}
  });
  let { deleteDialogOpen, targetAssembly } = state;
  const deleteAssemblyPrompt = (item) => event => {
    event.preventDefault();
    setState({ ...state, deleteDialogOpen: !!item, targetAssembly: item });
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
            <button onClick={() => goToComponent(6)}>Area/Code</button>
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
                            <TableCell>No. Of Dives</TableCell>
                            <TableCell>No. Of Judges(E/S)</TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            matchAssemblies.map(({
                              Id, MatchId, ZhName, EnName, StageTypeName, HeightTypeName, NumOfExecJudges,
                              NumOfSyncJudges, Dives
                            }, i) => {
                              return (
                                  <TableRow key={i}>
                                    <TableCell>
                                      <button onClick={() => openIndividualMatchAssemblyDiverForm(matchAssemblies[i])}>
                                        Manage
                                      </button>
                                    </TableCell>
                                    <TableCell>{ZhName}</TableCell>
                                    <TableCell>{EnName}</TableCell>
                                    <TableCell>{StageTypeName}</TableCell>
                                    <TableCell>{HeightTypeName}</TableCell>
                                    <TableCell>{Dives ? Dives : 'N/A'}</TableCell>
                                    <TableCell>{NumOfExecJudges + '/' + NumOfSyncJudges}</TableCell>
                                    <TableCell>
                                      <button onClick={() => openEditAssemblyForm(matchAssemblies[i])}>Edit</button>
                                    </TableCell>
                                    <TableCell>
                                      <button onClick={deleteAssemblyPrompt(matchAssemblies[i])}>Delete</button>
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
        {state.targetAssembly ?
            (<Dialog open={deleteDialogOpen} onClose={deleteAssemblyPrompt(null)}>
              <DialogTitle>Delete Assembly</DialogTitle>
              <DialogContent>
                <DialogContentText>Deleting...{state.targetAssembly.EnName}</DialogContentText>
                <DialogActions>
                  <Button onClick={() => handleMatchAssemblyFormSubmit(3, state.targetAssembly)}
                          color={'secondary'}>Confirm</Button>
                  <Button onClick={() => deleteAssemblyPrompt(null)} color={'primary'}>Close</Button>
                </DialogActions>
              </DialogContent>
            </Dialog>) : <React.Fragment/>
        }
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
          // rs.forEach(({ id, name }, i) => { stageTypes.push({ id, name }); });
          // rh.forEach(({ id, heightM }, i) => { heightTypes.push({ id, heightM }); });
          stageTypes = rs; heightTypes = rh;
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          store.setState({ loading: false, constants: { stageTypes: stageTypes, heightTypes: heightTypes } });
        });
  },
  getDiverFormConstants: store => {
    let { StageType, HeightType } = store.state.targetAssembly;
    let p = [], areas = [], difficulties = [], codes = [];
    p.push(apiGetAreas());
    // p.push(StageType ? apiGetDifficulties(StageType): apiGetAllDifficulties());
      p.push(apiGetAllDifficulties());
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
    let apiMessage = null;
    if (mode === 1) {
      store.setState({ loading: true });
      apiAddMatchAssembly(matchAssembly)
          .then( res => {
            apiMessage = res.status === 200 ? res.description: 'API Error';
            console.log(res);
          })
          .catch( err => {
            console.error(err);
          })
          .finally(() => {
            store.setState({ componentIndex: 3, apiMessage: apiMessage, previousComponentIndex: 1 });
          });
    } else if (mode === 3) {
      //delete
      apiDeleteMatchAssembly(matchAssembly)
          .then( res => {
            apiMessage = res.status === 200 ? res.description: 'API Error';
          })
          .catch( err => {
            console.error(err);
          })
          .finally(() => {
            store.setState({ componentIndex: 3, apiMessage: apiMessage, previousComponentIndex: 1 });
          });
    }
  },
  handleSubmitMatchAssemblyDiverForm: (store, mode, diver) => {
    let {
        MatchAssemblyDiverId, Id, AreaId, ClubName, CodeId,
        DiverCname, DiverEname, DiveInfo, CreatedBy} = diver;
    let { Dives } = store.state.targetAssembly;
    if (mode === 1) {
        //add diver to the match assembly
        if (!AreaId || !CodeId || !DiverEname || !DiveInfo) {
            alert('Please fill in all the required fields');
        } else if (Number(DiveInfo.length) !== Dives) {
            alert('Please fill in all the dive info with dive codes and difficulties');
        } else {
            store.setState({ ...store.state, loading: true });
            //with all data -> call api
            apiAddMatchAssemblyDiver(diver)
                .then(res => {})
                .catch(err => console.error(err))
                .finally(() => {
                    store.setState({ ...store.state, loading: false });
                });
        }
    } else if (mode === 2) {
        //edit the diver information
    } else {
        //delete the diver from the assembly
    }
  },
  handleSubmitAreaForm: (store, mode, area) => {
    if (!area.AreaCname || !area.AreaEname) {
      alert('Please enter both the area chinese and english name');
    } else {
      let apiMessage = null;
      if (mode === 1) {
        //add
        store.setState({ ...store.state, loading: true });
        apiAddArea(area)
            .then(res => {
              if (res.status !== 200 && res.data.rtnCode !== 0) throw 'Failed. Please check the input';
              else apiMessage = 'Success';
            })
            .catch(err => {
              console.error(err);
              apiMessage = err;
            })
            .finally(() => {
              store.setState({ ...store.state, loading: false, apiMessage: apiMessage });
            });
      } else if (mode === 2) {
        //edit
      } else {
        //delete
      }
    }
  },
  handleSubmitCodeForm: (store, mode, code) => {
    if (!code.CodeName) {
      alert('Please enter the code name');
    } else {
      let apiMessage = null;
      if (mode === 1) {
        //add
        store.setState({ ...store.state, loading: true });
        apiAddCode(code)
            .then(res => {
              if (res.status !== 200 && res.data.rtnCode !== 0) throw 'Failed. Please check the input';
              else apiMessage = 'Success';
            })
            .catch(err => {
              console.error(err);
              apiMessage = err;
            })
            .finally(() => {
              store.setState({ ...store.state, loading: false, apiMessage: apiMessage });
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
  openIndividualMatch: (store, matchId) => {
    let p = store.state.componentIndex;
    let targetMatch = { zhName: '', enName: '', matchId: matchId, startDate: '', endDate: '', matchAssemblies: [] };
    store.setState({ ...store.state, loading: true });
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
          // store.setState({ ...store.state,
          //   componentIndex: 3, previousComponentIndex: p,
          //   targetMatch: { zhName: '', enName: '', matchId: matchId, startDate: '', endDate: '', matchAssemblies: [] }});
          // store.setState({ ...store.state, callRefresh: false, targetMatch: targetMatch, loading: false });
          store.setState({ ...store.state,
            componentIndex: 3, previousComponentIndex: p,
            targetMatch: targetMatch, loading: false});
        });
  },
  refreshIndividualMatch: (store, matchId) => {
    console.log('calling refreshIndividualMatch :' + store.state.callRefresh);
    let targetMatch = { zhName: '', enName: '', matchId: matchId, startDate: '', endDate: '', matchAssemblies: [] };
    store.setState({ ...store.state, loading: true });
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
          store.setState({ ...store.state, callRefresh: false, targetMatch: targetMatch, loading: false });
        });
  },
  openIndividualMatchAssemblyDiverForm: (store, matchAssembly) => {
    store.setState({ ...store.state, loading: true, targetAssembly: matchAssembly });
    console.log(matchAssembly);
    let p = [], matchDivers = [], matchAssemblyDivers = [];
    p.push(apiGetMatchDivers(store.state.targetMatch.matchId));
    p.push(apiGetMatchAssemblyDivers(store.state.targetAssembly.Id));
    Promise.all(p)
        .then( result => {
          if (CheckResponseAcceptEmptyData(result)) {
            throw 'API Error';
          }
          else return result.map((r,i) => r.data.data);
        })
        .then ( data => {
          let [ _mds, _mads ] = data;
          matchDivers = _mds;
          matchAssemblyDivers = _mads;
        })
        .catch( err => {
          console.error(err);
        })
        .finally(() => {
          store.setState({
            ...store.state,
            componentIndex: 5, previousComponentIndex: 3, loading: false,
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
  },
  goToComponent: (store, componentIndex) => {
    let p = store.state.componentIndex;
    store.setState({ ...store.state, componentIndex: componentIndex, previousComponentIndex: p });
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
