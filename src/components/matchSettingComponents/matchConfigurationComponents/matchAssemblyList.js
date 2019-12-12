import React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';

export default class MatchAssemblyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: this.props.data }
    }
    render() {
        const { data } = this.state;
        if (!data) {
            return (
                <React.Fragment>
                    <h3>No Assemblies available</h3>
                </React.Fragment>
            );
        } else {
            return (
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
                            data.map(({
                                          Id, MatchId, ZhName, EnName, StageTypeName, HeightTypeName, NumOfExecJudges,
                                          NumOfSyncJudges, Dives
                                      }, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Button
                                                variant={'outlined'}
                                                color={'primary'}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    // openIndividualMatchAssemblyDiverForm(matchAssemblies[i])
                                                }}>
                                                Manage
                                            </Button>
                                        </TableCell>
                                        <TableCell>{ZhName}</TableCell>
                                        <TableCell>{EnName}</TableCell>
                                        <TableCell>{StageTypeName}</TableCell>
                                        <TableCell>{HeightTypeName}</TableCell>
                                        <TableCell>{Dives ? Dives : 'N/A'}</TableCell>
                                        <TableCell>{NumOfExecJudges + '/' + NumOfSyncJudges}</TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <EditIcon/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            );
        }
    }
}
