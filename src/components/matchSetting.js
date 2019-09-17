import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import
{
  AppBar,
  Fab, TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import  AddIcon from '@material-ui/icons/Add';
import useGlobalHook from "use-global-hook";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


const initialState = {
  isAddModalShown: false,
  title: null,
  componentIndex: 1
};
const TabList = [
  {
    label: "單人"
  },
  {
    label: "雙人"
  }
];

function GetContent({ componentIndex }) {
  let component = null;
  switch(componentIndex) {
    case 1:
      component = ShowMatchList(); break;
    default:
      component = (<p>Invalid Component Index</p>); break;
  }
  return component;
}

function ShowMatchList() {
  //fetch data
  //
  return (
    <React.Fragment>
      <button>ABC</button>
    </React.Fragment>
  );
}

const actions = {
  addMatch: (store, { matchChineseName, matchEnglishName }) => {},
  showAddModal: (store, shouldShow) => {
    store.setState({ isAddModalShown: shouldShow });
  }
};

const useGlobal = useGlobalHook(React, initialState, actions);

const MatchSetting = () => {
  let [globalState, globalActions] = useGlobal();
  const classes = useStyles();
  return (
    <React.Fragment>
      <div>
        {/*<AppBar position="static">*/}

        {/*</AppBar>*/}
        <div>
          <Fab color={'primary'} aria-label={'add'} onClick={() => globalActions.showAddModal(true)}>
            <AddIcon/>
          </Fab>
        </div>
        { GetContent(globalState) }
      </div>
    </React.Fragment>
  );
};

export default MatchSetting;
