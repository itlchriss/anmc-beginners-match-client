import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import useGlobalHook from "use-global-hook";

const initialState = {};
const TabList = [
  {
    label: "單人"
  },
  {
    label: "雙人"
  }
];

const actions = {
  addDifficulty: (store, matchType, diveCode, difficultyFactor) => {},
  editDifficulty: (store, diveCode, difficultyFactor) => {},
  deleteDifficulty: (store, diveCode) => {}
};

const useGlobal = useGlobalHook(React, initialState, actions);

const MatchSetting = () => {
  let [state, setState] = useGlobal();
  const handleTabsOnChange = newTab => {};
  return (
    <React.Fragment>
      <div>
        <AppBar position="static">
          <Tabs handleTabsOnChange={handleTabsOnChange} />
        </AppBar>
      </div>
    </React.Fragment>
  );
};

export default MatchSetting;
