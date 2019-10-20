import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import
{
  AppBar,
  Fab, TextField,
  Paper
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import  AddIcon from '@material-ui/icons/Add';
import useGlobalHook from "use-global-hook";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";

import GetTable from "./utilities/getTable";

let matchList = [];
function getModalStyle() {
  const top = 100;
  return {
    top: `${top}%`,
    display:'flex',alignItems:'center',justifyContent:'center',
    margin: 'auto'
  };
}

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
  modalPaper : {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
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

function GetContent({ componentIndex }, globalActions) {
  let component = null;
  switch(componentIndex) {
    case 1:
      component = MatchList(globalActions); break;
    default:
      component = (<p>Invalid Component Index</p>); break;
  }
  return component;
}

const MatchFormModalComponent = ({ modalTitle, showModal,  handleModalSubmit, toggleModal }) => {
  const classes = useStyles;
  const modalStyle = getModalStyle();
  return (
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={showModal}
          onClose={toggleModal({ showModal: false })}
      >
        <Paper style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">{modalTitle}</h2>

          <button onClick={handleModalSubmit}>Submit</button>
        </Paper>
      </Modal>
  );
};

const MatchList = ({ handleModalSubmit }) => {
  let [state, setState] = React.useState({
    showModal: false, mode: -1, matchId: -1
  });
  //fetch data
  React.useEffect(() => {
    //TODO: get the matchList filled from api
  }, [matchList, state]);
  let { showModal, mode, matchId } = state;
  let modalTitle = '', modalComponents = '', targetMatch = {};
  if (mode === 2 && matchId && matchId > 0) {
    modalTitle = 'Edit Match';
    targetMatch = matchList[matchId];
    modalComponents = (
        <React.Fragment>

        </React.Fragment>
    );
  } else if (mode === 3 && matchId && matchId > 0) modalTitle = 'Delete Match';
  else modalTitle = 'Add Match';
  return (
      <React.Fragment>
        <button onClick={() => setState({ showModal: true, mode: 1  })}>Add Match</button>
        {
          (!matchList || matchList.length === 0) ? ''
              : matchList.map((match, i) => {
                return (
                    <button>{ match.zhName }</button>
                );
              })
        }
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
        <div>
          <Fab color={'primary'} aria-label={'add'} onClick={() => globalActions.showAddModal(true)}>
            <AddIcon/>
          </Fab>
        </div>
        { GetContent(globalState, globalActions) }
      </div>
    </React.Fragment>
  );
};

export default MatchSetting;
