import React from "react";
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Preloader from "../utilities/preloader";
import Form from './matchListComponents/form';
import { ComponentIndexConfiguration } from "../../config";
import {apiAddMatch, apiGetMatches} from "../../api";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import DeleteDialog from "../sharedComponents/deleteDialog";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '100%',
        height: '100%',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
});


class MatchListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            data: [],
            loading: true,
            apiMsg: '',
            deleteDialogInfo: {
                open: false,
                name: '',
                data: ''
            }
        };
        this.handleOpenMatchClick = this.handleOpenMatchClick.bind(this);
        this.handleAddMatchSubmitClick = this.handleAddMatchSubmitClick.bind(this);
        this.handleDeleteMatchSubmitClick = this.handleDeleteMatchSubmitClick.bind(this);
    }
    componentDidMount() {
        this.refreshData();
    }
    refreshData() {
        apiGetMatches()
            .then(res => {
                if (res.status === 200 && res.data) {
                    let _data = res.data;
                    this.setState({ loading: false, data: _data });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    handleOpenMatchClick = matchId => event => {
        this.props.changeGlobalComponentHandler(
            ComponentIndexConfiguration.MatchSettingConfiguration.MatchConfigurationIndex, { matchId: matchId });
    };
    handleAddMatchSubmitClick = match => {
        this.setState({ loading: true, dialogOpen: false });
        const {
            zhName: ZhName,
            enName: EnName,
            startDate: StartDate,
            endDate: EndDate
        } = match;
        apiAddMatch({ ZhName, EnName, StartDate, EndDate, CreateBy: 'ANMCStaff' })
            .then(res => {
                this.setState({ loading: false, apiMsg: (res.status === 200 ? res.description : 'API Error')});
            })
            .catch(err => {
                this.setState({ loading: false, apiMsg: 'exception rised.'});
                console.log(err);
            });
    };
    handleDeleteMatchSubmitClick = matchId => {};
    render() {
        let { loading, data, dialogOpen, deleteDialogInfo: { open: deleteDialogOpen, name: deleteDialogName, data: deleteDialogData } } = this.state;
        const {classes} = this.props;
        return (
            <React.Fragment>
                {
                    loading ?
                        <Preloader /> :
                        <React.Fragment>
                            <div>
                                <Button onClick={() => this.setState({ dialogOpen: true })} variant={'outlined'} color={'primary'}>Add Match</Button>
                            </div>

                            <Form
                                mode={1}
                                open={dialogOpen}
                                closeDialogHandler={() => this.setState({ dialogOpen: false })}
                                submitFormHandler={() => this.handleAddMatchSubmitClick}
                            />
                            {
                                (!data || data.length === 0) ? 'No Matches are available'
                                    :
                                    (
                                        <div className={classes.root}>
                                            <GridList cellHeight={180} style={{ width:'80%'}}>
                                                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                                                    <ListSubheader component="div">Match List</ListSubheader>
                                                </GridListTile>
                                                {data.map( (match, index) => (
                                                    <GridListTile key={index}>
                                                        <h3>{match.zhName}</h3>
                                                        <h5>{match.enName}</h5>
                                                        <GridListTileBar
                                                            title={match.startDate + ' ~ ' + match.endDate}
                                                            actionIcon={
                                                                <IconButton className={classes.icon} onClick={this.handleOpenMatchClick(match.matchId)}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            }
                                                        />
                                                        <GridListTileBar
                                                            titlePosition={'top'}
                                                            style={{ background: 'transparent'}}
                                                            actionIcon={
                                                                <IconButton
                                                                    style={{ color: 'red'}}
                                                                    className={classes.icon}
                                                                    onClick={() =>
                                                                        this.setState({
                                                                            deleteDialogInfo: { open: true, name: match.zhName, data: match.matchId }})}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            }
                                                        />
                                                    </GridListTile>
                                                ))}
                                            </GridList>
                                            <DeleteDialog
                                                open={deleteDialogOpen}
                                                name={deleteDialogName}
                                                data={deleteDialogData}
                                                onCloseHandler={() =>
                                                    this.setState({ deleteDialogInfo: { ...this.state.deleteDialogInfo, open: false }})}
                                                submitHandler={() => this.handleDeleteMatchSubmitClick} />
                                        </div>
                                    )

                            }
                        </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

const MatchList = MatchListComponent;

export default withStyles(styles)(MatchList);