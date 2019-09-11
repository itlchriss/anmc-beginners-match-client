import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import useGlobalHook from "use-global-hook";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import { useTable, useRowSelect } from "react-table";
import { getConstants } from "../api";

const diveTypes = {
  SINGLE: 1,
  DOUBLE: 2
};

const initialState = {};
const TabList = [
  // {
  //   label: "單人",
  //   value: diveTypes.SINGLE
  // },
  // {
  //   label: "雙人",
  //   value: diveTypes.DOUBLE
  // },
  {
    label: "Constants",
    value: 1
  },
  {
    label: "Difficulties",
    value: 2
  }
];

function TabPanel(props) {
  return <React.Fragment />;
}

const actions = {
  addDifficulty: (store, matchType, diveCode, difficultyFactor) => {},
  editDifficulty: (store, diveCode, difficultyFactor) => {},
  deleteDifficulty: (store, diveCode) => {}
};

function getTable({ columns, data }) {
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    state: [{ selectedRows }]
  } = useTable(
    {
      columns,
      data
    },
    useRowSelect
  );
  return (
    <React.Fragment>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map(
            (row, i) =>
              prepareRow(row) || (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

function constantList() {
  const { key, columns: rawColumns, data: rawData } = getConstants();
  const columns = React.useMemo(
    () => [
      {
        id: "edit",
        Header: "",
        Cell: ({ row }) => (
          <IconButton
            aria-label="edit"
            onClick={() => {
              console.log(row);
            }}
          >
            <CreateIcon />
          </IconButton>
        )
      },
      ...rawColumns
    ],
    []
  );
  const data = React.useMemo(() => rawData, []);
  return getTable({ columns, data });
}

function difficultyList({
  addDifficultyHandler,
  editDifficultyHandler,
  deleteDifficultyHandler
}) {
  
}

function content(type, handlers) {
  switch (type) {
    case 1:
      return constantList(handlers);
    case 2:
      return difficultyList(handlers);
    default:
      return null;
  }
}

const useGlobal = useGlobalHook(React, initialState, actions);

const SystemSetting = () => {
  let [state, setState] = useGlobal();
  const handleTabsOnChange = newTab => {};
  const listHandlers = {
    addDifficultyHandler: () => {},
    editDifficultyHandler: () => {},
    deleteDifficultyHandler: () => {}
  };
  return (
    <React.Fragment>
      {/* <div>
        <AppBar position="static">
          <Tabs handleTabsOnChange={handleTabsOnChange}>
            {TabList.map((tabObject, index) => {
              return <Tab value={tabObject.value} label={tabObject.label} />;
            })}
          </Tabs>
        </AppBar>
      </div> */}
      {content(2, listHandlers)}
    </React.Fragment>
  );
};

export default SystemSetting;
