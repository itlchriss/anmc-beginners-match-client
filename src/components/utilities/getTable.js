import {useRowSelect, useTable, useBlockLayout} from "react-table";
import React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@material-ui/core";
// Create an editable cell renderer
const EditableCell = ({
                          cell: { value: initialValue },
                          row: { index },
                          column: { id, width = 150 },
                          editable,
                          cellUpdateHandler, // This is a custom function that we supplied to our table instance
                      }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);

    if (!editable)
        return <span>{initialValue}</span>;
    else
        return(<TextField
               style={{ width: width }}
               margin={'dense'}
               variant={'outlined'}
               value={value}
               autoComplete={'off'}
               onChange={(event) => setValue(event.target.value)}
               onBlur={(event) => initialValue !== value ? cellUpdateHandler(index, id, event.target.value, event) : ''}
               onKeyUp={(event) => {
                   let key = (event.which === 'number') ? event.which : event.keyCode;
                   if (key === 13 && initialValue !== value) {
                       cellUpdateHandler(index, id, value, event);
                       if (initialValue !== value) {
                           setValue(initialValue);
                       }
                   }
               }}
            />);
        // return <input value={value} onChange={onChange} onBlur={onBlur} />
};


export default function GetTable({
                                     columns,
                                     data,
                                     editable = false,
                                     cellUpdateHandler = null
}) {
    let tableProps = null;
    if (editable && editable && cellUpdateHandler) {
        let c = { Cell: EditableCell };
        tableProps = { columns, data, defaultColumn: c, cellUpdateHandler};
    } else {
        tableProps = { columns, data };
    }
    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        tableProps,
        // useBlockLayout,
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
                                            <TableCell {...cell.getCellProps()}
                                                       size={cell.column.size || 'medium'} padding={cell.column.padding || 'default'}>
                                                {
                                                    cell.render('Cell', {
                                                        editable: cell.column.CanEdit && cell.column.CanEdit
                                                    })
                                                }
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