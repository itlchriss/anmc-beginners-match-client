import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import useGlobalHook from "use-global-hook";
import {
  IconButton
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
// import { useTable, useRowSelect } from "react-table";
import { apiGetDifficulties } from "../api";
import GetTable from './utilities/getTable';

const diveTypes = {
  SINGLE: 1,
  DOUBLE: 2
};

const initialState = {
  isFetching: true,
  difficulties: []
};
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
  deleteDifficulty: (store, diveCode) => {},
  toggleFetching: (store, _isFetching) => {
    console.log('isFetching: ' + _isFetching);
    store.setState({ isFetching: _isFetching });
  },
  storeData: (store, key, data) => {
    store.setState({ [key]: data });
  },
  getData: (store, key) => {
    return store[key];
  }
};

// function GetTable({ columns, data}) {
//   const {
//     getTableProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     state: [{ selectedRows }]
//   } = useTable(
//     {
//       columns,
//       data
//     },
//     useRowSelect
//   );
//   return (
//     <React.Fragment>
//       <Table {...getTableProps()}>
//         <TableHead>
//           {headerGroups.map(headerGroup => (
//             <TableRow {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map(column => (
//                 <TableCell {...column.getHeaderProps()}>
//                   {column.render("Header")}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableHead>
//         <TableBody>
//           {rows.map(
//             (row, i) =>
//               prepareRow(row) || (
//                 <TableRow {...row.getRowProps()}>
//                   {row.cells.map(cell => {
//                     return (
//                       <TableCell {...cell.getCellProps()}>
//                         {cell.render("Cell")}
//                       </TableCell>
//                     );
//                   })}
//                 </TableRow>
//               )
//           )}
//         </TableBody>
//       </Table>
//     </React.Fragment>
//   );
// }

function ConstantList() {
  // const { key, columns: rawColumns, data: rawData } = getConstants();
  const { key, columns: rawColumns, data: rawData } = {};
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
  return GetTable({ columns, data });
}

const DifficultyList = () => {
    let [ state, actions ] = useGlobal();
  React.useEffect (() => {
      actions.toggleFetching(true);
    apiGetDifficulties(1)
        .then(res => {
          if (res.status === 200 && res.data) {
              let data = res.data;
              actions.storeData('difficulties', data);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally((data) => {
        });
      actions.toggleFetching(false);
  }, []);
  const columns = React.useMemo(() => [
    {
      Header: 'SPRINGBOARD',
      columns: [
        {
          Header: 'Dive Code',
          accessor: 'code'
        }
      ]
    },
    {
      Header: 'Positions',
      columns: [
        {
          Header: 'A',
          accessor: 'A'
        },
        {
          Header: 'B',
          accessor: 'B'
        },
        {
          Header: 'C',
          accessor: 'C'
        },
        {
          Header: 'D',
          accessor: 'D'
        }
      ]
    }
  ], []);
  const { difficulties, isFetching } = state;
  let data = React.useMemo(() => difficulties, [difficulties]);
    return (GetTable({columns, data}));
}


function content(type) {
  switch (type) {
    case 1:
      return ConstantList();
    case 2:
      return DifficultyList();
    default:
      return null;
  }
}

const useGlobal = useGlobalHook(React, initialState, actions);

const SystemSetting = () => {
  let [globalState, globalActions] = useGlobal();
  const handleTabsOnChange = newTab => {};
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
      {content(2 )}
    </React.Fragment>
  );
};

export default SystemSetting;
