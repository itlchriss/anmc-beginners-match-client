import React, {Component} from "react";
import
{
  AppBar,
  Fab, TextField,
  Paper,
  ButtonBase,
  Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
  MenuItem, Grid, Modal, Backdrop, Fade,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import  { Add } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
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
    apiAddMatchAssemblyDiver, apiDeleteMatchAssemblyDiver
} from '../api';
import { CheckResponse, CheckResponseAcceptEmptyData } from "./utilities/checkResponse";
import Button from "@material-ui/core/Button";
import getDiveName from "./utilities/getDiveName";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MaterialTable from "material-table";
import IconButton from "@material-ui/core/IconButton";
import MatchList from "./matchSettingComponents/matchList";
import MatchConfiguration from './matchSettingComponents/matchConfiguration';

import { ComponentIndexConfiguration } from '../config';

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
  thinCell: { padding: 0, fontSize: '10px' },
  thinTable: { padding: 0, fontSize: '10px'}
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



class MatchAssemblyDiverComponent extends React.Component
{
  constructor (props) {
    super(props);
    this.state = {
      open: false, modelTitle: '', handler: null, mode: -1,
        diverDeletePromptOpen: false,
      diver: {
        Id: -1, AreaId: -1, ClubName: '', CodeId: -1, DiverCname: '', DiverEname: '',
        DiveInfo: []
      },
      diverList: [],
      matchDiverList: [],
      fetching: false,
      callRefresh: false,
      constants: {}
    };
    this.openAddAMatchAssemblyDiverForm = this.openAddAMatchAssemblyDiverForm.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleDiverChange = this.handleDiverChange.bind(this);
    this.handleDiveInfoChange = this.handleDiveInfoChange.bind(this);
    this.handleSubmitMatchAssemblyDiverForm = this.handleSubmitMatchAssemblyDiverForm.bind(this);
  }
  handleDiverChange = name => event => {
  let diver = this.state.diver;
  diver[name] = event.target.value;
  this.setState({ diver: diver });
};
  handleDiveInfoChange = (field, index) => event => {
    let { diver, constants: { difficulties }} = this.state;
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
        let { StageType, HeightType } = this.props.state.targetAssembly;
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
    this.setState({diver: diver});
};
  handleModalClose = () => this.setState({ open: false });
  openAddAMatchAssemblyDiverForm = () => {
  let diveInfo = [];
  let { Dives, Id } = this.props.state.targetAssembly;
  if (Dives && Dives) {
    for (let i = 0; i < Dives; ++i) {
      diveInfo.push({ diveCode: '', difficulty: '', status: -2, diveName: '' });
    }
  }
  this.setState({
    mode: 1, modalTitle: 'Add Diver',
    open: true,
    diver: {
      MatchAssemblyDiverId: -1, DiverId: -1, AreaId: -1, ClubName: '',
      CodeId: -1, DiverCname: '', DiverEname: '', DiveInfo: diveInfo, MatchAssemblyId: Id } });
};
  getDiverInfoStyle = (status) => {
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
  getDiverInfoHelperText = (status, diveName) => {
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
  handleSubmitMatchAssemblyDiverForm = () => {
      let {
        diver: {
      MatchAssemblyDiverId, Id, AreaId, ClubName, CodeId,
      DiverCname, DiverEname, DiveInfo, CreatedBy, MatchAssemblyId }, mode } = this.state;
      console.log(this.state.diver);
      let { Dives } = this.props.state.targetAssembly;
      if (mode === 1) {
        //add diver to the match assembly
        if (!AreaId || !CodeId || !DiverEname || !DiveInfo) {
          alert('Please fill in all the required fields');
        } else if (Number(DiveInfo.length) !== Dives) {
          alert('Please fill in all the dive info with dive codes and difficulties');
        } else {
          this.setState({ loading: true });
          //with all data -> call api
          apiAddMatchAssemblyDiver(this.state.diver)
              .then(res => {
                if (res.status === 200 && res.data.rtnCode === 0) {
                  console.log('submit success');
                  this.refreshDiverList();
                  this.setState({ open: false });
                } else {
                  console.log('submit failed');
                  alert('API Error: ' + res.data.description);
                }
              })
              .catch(err => console.error(err))
              .finally(() => {
                this.setState({ loading: false });
              });
        }
      } else if (mode === 2) {
        //edit the diver information
      } else {
          console.log(this.state.diver.MatchAssemblyDiverId);
        //delete the diver from the assembly
        apiDeleteMatchAssemblyDiver(this.state.diver.MatchAssemblyDiverId)
            .then(res => {
                if (res.status === 200 && res.data.rtnCode === 0) {
                    console.log('submit success');
                    this.refreshDiverList();
                    this.setState({ diverDeletePromptOpen: false });
                } else {
                    console.log('submit failed');
                    alert('API Error: ' + res.data.description);
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                this.setState({ loading: false });
            });
      }
  };
  getConstants() {
    let { StageType, HeightType } = this.props.state.targetAssembly;
    let p = [], areas = [], difficulties = [], codes = [];
    p.push(apiGetAreas());
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
          this.setState({
            constants: { areas: areas, difficulties: difficulties, codes: codes }
          });
        });
  }
  componentDidMount() {
    this.getConstants();
    this.refreshDiverList();
  }
  refreshDiverList() {
    let { targetAssembly: { Id: matchAssemblyId}, targetMatch: { matchId } } = this.props.state;
    let p = [], _MatchAssemblyDivers = null, _MatchDivers = null;
    p.push(apiGetMatchAssemblyDivers(matchAssemblyId));
    p.push(apiGetMatchDivers(matchId));
    Promise.all(p)
        .then(pres => {
          let result = pres.filter(r => r.status === 200 && r.data.rtnCode === 0);
          if (result.length !== p.length) throw 'Promise Error in refreshDiverList';
          else return result.map(r => r.data.data);
        })
        .then(result => {
          let [ MatchAssemblyDivers, MatchDivers ] = result;
          _MatchAssemblyDivers = MatchAssemblyDivers;
          _MatchDivers = MatchDivers;
          // this.setState({ diverList: MatchAssemblyDivers, matchDiverList: MatchDivers });
        })
        .catch(err => console.error(err))
        .finally((res) => {
            this.setState({ fetching: false, diverList: _MatchAssemblyDivers, matchDiverList: _MatchDivers  });
        });
  }
  render() {
    const classes = useStyles;
    let { areas, difficulties, codes } = this.state.constants;
    let {
      mode, open, modelTitle, fetching, diverList, matchDiverList,
      diver: { MatchAssemblyDiverId, DiverId, AreaId, ClubName, CodeId, DiverCname, DiverEname, DiveInfo} } = this.state;
    let {
      actions: {
        handleSubmitMatchAssemblyDiverForm, handleSubmitAreaForm, handleSubmitCodeForm, getDiverFormConstants },
      state: {
        targetMatch: { enName: matchEnName },
        targetAssembly: { Id: matchAssemblyId, EnName: matchAssemblyEnName }
      }
    } = this.props;
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
          <div>
            <Button variant={'contained'} onClick={ this.openAddAMatchAssemblyDiverForm }>Add Diver</Button>
          </div>
          <Dialog open={fetching}>
            <DialogContent>
              <DialogContentText>Fetching Data...Please wait...</DialogContentText>
            </DialogContent>
          </Dialog>
          <Grid container>
            <Grid item xs={4} aria-label={'match-diver-list'}>
              {
                matchDiverList ?
                    (
                        <List style={{ borderWidth: 2, borderColor: 'black', borderStyle: 'solid' }}>
                          {
                            matchDiverList.map(({ Diver: {Id, ClubName, DiverEname}, AreaName, CodeName}, index) => {
                                  return (
                                      <React.Fragment key={index}>
                                      <ListItem>
                                        <ListItemText primary={DiverEname} secondary={CodeName + ' ' + AreaName + ' ' + ClubName}/>
                                      </ListItem>
                                      {
                                        ((index+1) !== matchDiverList.length) ?
                                            <Divider variant="inset" component="li" key={'divider-' + index} />
                                            : <React.Fragment/>
                                      }
                                      </React.Fragment>
                                  );
                                }
                            )
                          }
                        </List>
                    ): <React.Fragment/>
              }
            </Grid>
            <Grid item xs={2} aria-label={'assign-button'}>
              <Button>
                <ArrowForwardOutlinedIcon/>
              </Button>
            </Grid>
              <Dialog open={this.state.diverDeletePromptOpen}>
                  <DialogTitle>Delete Diver From Current Assembly</DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                          Are you sure to delete the diver from the assembly?
                      </DialogContentText>
                      <DialogActions>
                          <Button color={'secondary'} variant={'outlined'} onClick={this.handleSubmitMatchAssemblyDiverForm}>
                              Confirm
                          </Button>
                          <Button color={'primary'} variant={'outlined'} onClick={() => { this.setState({diverDeletePromptOpen: false, mode: 1})}}>
                              Close
                          </Button>
                      </DialogActions>
                  </DialogContent>
              </Dialog>
            <Grid item xs={6} aria-label={'current-assembly-diver-list'} style={{
              borderColor: 'grey', borderWidth: 2, borderStyle: 'solid'}}>
              {
                diverList ?
                    <List>
                      {
                        diverList.map(({
                                                    Diver : { Id: DiverId, DiverCname, DiverEname, AreaId, CodeId },
                                                    MatchAssemblyDiverInfo: { Id: MatchAssemblyDiverId, DiveInfo: DiveInfoStr, Ordering },
                                                    AreaName, CodeName}, index) => {
                          let DiveInfo = [];
                          try {
                            DiveInfo = JSON.parse(DiveInfoStr.replace(/'/g, '"'));
                            if (!DiveInfo) console.log('empty dive info at index ' + index);
                          } catch {
                            console.log(DiveInfoStr);
                            console.log('empty or invalid dive info at index ' + index);
                          }
                          return (
                              <React.Fragment key={index}>
                              <ListItem key={index}>
                                <Grid container>
                                  <Grid item xs={1} fontSize={'small'}>
                                    <IconButton onClick={
                                        () => {
                                            this.setState({ mode: 3, diver: { ...this.state.diver, MatchAssemblyDiverId: MatchAssemblyDiverId }, diverDeletePromptOpen: true });
                                        }}>
                                        <DeleteIcon fontSize={'small'}/>
                                    </IconButton>
                                  </Grid>
                                  <Grid item xs={1}>{CodeName}</Grid>
                                  <Grid item xs={1}>{AreaName}</Grid>
                                  <Grid item xs={2}>{ DiverEname }</Grid>
                                  <Grid item xs={5}>
                                    <Table aria-label={'dive-info-table'} className={classes.thinTable}>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell padding={'none'} className={classes.thinCell}>Dive #</TableCell>
                                          <TableCell padding={'none'} className={classes.thinCell}>Code</TableCell>
                                          <TableCell padding={'none'} className={classes.thinCell}>Difficulty</TableCell>
                                          <TableCell padding={'none'} className={classes.thinCell}> </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {
                                          DiveInfo ?
                                              DiveInfo.map(({diveCode, difficulty}, di) => {
                                                return (
                                                    <TableRow key={di}>
                                                      <TableCell padding={'none'} className={classes.thinCell}>{di+1}</TableCell>
                                                      <TableCell padding={'none'} className={classes.thinCell}>{diveCode}</TableCell>
                                                      <TableCell padding={'none'} className={classes.thinCell}>{difficulty}</TableCell>
                                                      <TableCell padding={'none'} className={classes.thinCell}>
                                                        <IconButton size={'small'}>
                                                          <EditIcon fontSize={'small'}/>
                                                        </IconButton>
                                                      </TableCell>
                                                    </TableRow>
                                                );
                                              }) : <React.Fragment/>
                                        }
                                      </TableBody>
                                    </Table>
                                  </Grid>
                                </Grid>
                              </ListItem>
                              {
                                ((index+1) !== diverList.length) ?
                                  <Divider variant="inset" component="li" key={'divider-' + index} />
                                  : <React.Fragment/>
                              }
                              </React.Fragment>
                          );
                        })
                      }
                    </List>
                    :
                    <React.Fragment/>
              }
            </Grid>
          </Grid>
          <Dialog
              aria-labelledby="add-diver-transition-modal"
              aria-describedby="add-diver-description-transition-modal"
              open={open}
              onClose={this.handleModalClose}>
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
                  onChange={ this.handleDiverChange('DiverCname') }
                  helperText={'Enter the chinese name of the diver'}
              />
              <TextField
                  label="Diver English Name"
                  fullWidth
                  required
                  className={classes.textField}
                  value={DiverEname || ''}
                  onChange={ this.handleDiverChange('DiverEname') }
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
                      onChange={ this.handleDiverChange('AreaId') }
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
                      onChange={ this.handleDiverChange('CodeId') }
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
                  onChange={ this.handleDiverChange('ClubName') }
                  helperText={'Name of the club the diver belongs to. optional'}
              />
              {
                DiveInfo ? DiveInfo.map(({ diveCode, difficulty, status, diveName }, index) => {
                  return (
                      <Grid container key={index} style={this.getDiverInfoStyle(status)}>
                        <Grid item xs={6}>
                          <TextField
                              label={"Dive code #" + (index + 1)}
                              fullWidth
                              className={classes.textField}
                              value={diveCode || ''}
                              onChange={ this.handleDiveInfoChange('diveCode', index) }
                              helperText={'Dive Code of the corresponding dive'}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                              label={"Difficulty"}
                              fullWidth
                              className={classes.textField}
                              value={difficulty || ''}
                              onChange={ this.handleDiveInfoChange('difficulty', index) }
                              helperText={this.getDiverInfoHelperText(status, diveName)}
                          />
                        </Grid>
                      </Grid>
                  );
                }) : <React.Fragment/>
              }
              <DialogActions>
                <Button onClick={this.handleSubmitMatchAssemblyDiverForm} color={'primary'}>Submit</Button>
                <Button onClick={this.handleModalClose} color={'secondary'}>Close</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </React.Fragment>
    )
  }
}



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
        DiverCname, DiverEname, DiveInfo, CreatedBy, MatchAssemblyId } = diver;
    console.log(JSON.stringify(diver));
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
  openIndividualMatchAssemblyDiverForm: (store, matchAssembly) => {
    store.setState({ ...store.state, loading: true, targetAssembly: matchAssembly });
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

class MatchSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentIndex: 1, previousIndexStack: [], routeData: {} };
        this.backToPreviousComponent = this.backToPreviousComponent.bind(this);
        this.changeComponent = this.changeComponent.bind(this);
    }
    backToPreviousComponent() {
        this.setState({ currentIndex: this.state.previousIndexStack.pop() });
    }
    changeComponent(index, routeData) {
        let _stack = this.state.previousIndexStack;
        _stack.push(this.state.currentIndex);
        this.setState({ currentIndex: index, routeData: routeData, previousIndexStack: _stack });
    }
    GetContent(index) {
        let { MatchSettingConfiguration: {
                MatchListIndex,
                MatchConfigurationIndex
            }
        } = ComponentIndexConfiguration;
        let component = null;
        const { routeData } = this.state;
        switch(index) {
            case MatchListIndex:
                component = (<MatchList changeGlobalComponentHandler={this.changeComponent} />); break;
            case MatchConfigurationIndex:
                component = (<MatchConfiguration changeGlobalComponentHandler={this.changeComponent} routeData={routeData}/>); break;
            // case 2:
            //     component = (<MatchForm actions={globalActions} state={globalState}/>); break;
            // case 3:
            //     component = (<IndividualMatch actions={globalActions} state={globalState} />); break;
            // case 4:
            //     component = (<MatchAssemblyForm actions={globalActions} state={globalState}/> ); break;
            // case 5:
            //     component = (<MatchAssemblyDiverComponent actions={globalActions} state={globalState} />); break;
            // // component = (<MatchAssemblyDiverForm actions={globalActions} state={globalState} />); break;
            // case 6:
            //     component = (<ConstantSetting actions={globalActions} state={globalState}/>); break;
            default:
                component = (<p>Invalid Component Index</p>); break;
        }
        return component;
    }
    render() {
        let { currentIndex, previousIndexStack } = this.state;
        return (
            <React.Fragment>
                {
                    previousIndexStack ?
                        <div>
                            <button onClick={this.backToPreviousComponent}>Back</button>
                        </div> : ''
                }
                <div>
                    { this.GetContent(currentIndex) }
                </div>
            </React.Fragment>
        );
    }
}



export default MatchSetting;
