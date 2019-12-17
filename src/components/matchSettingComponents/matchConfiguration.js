import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import {apiAddMatchAssembly, apiGetMatchAssembliesByMatchId} from "../../api";
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Preloader from "../utilities/preloader";
import {ComponentIndexConfiguration} from "../../config";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MatchAssemblyList from "./matchConfigurationComponents/matchAssemblyList";
import AssemblyForm from "./matchConfigurationComponents/assemblyForm";
import Assembly from "../entities/assembly";

const styles = theme => ({

});

class MatchConfigurationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            matchId: this.props.routeData.matchId,
            loading: true,
            dialogOpen: false,
            assemblyContainer: new Assembly()
        };
        this.addAssemblyHandler = this.addAssemblyHandler.bind(this);
    }
    componentDidMount() {
        this.refreshData();
    }
    refreshData() {
        this.setState({ loading: true });
        let { matchId } = this.state;
        apiGetMatchAssembliesByMatchId({matchId})
            .then(res => {
                if (res && res.status === 200 && res.data && res.data.rtnCode === 0) {
                    return res.data;
                } else {
                    return { match: null, matchAssemblies: null };
                }
            })
            .then (_data => {
                if (_data && _data) {
                    _data['match']['matchId'] = this.state.matchId;
                    this.setState({ data: _data });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }
    addAssemblyHandler() {
        this.setState({ loading: true });
        apiAddMatchAssembly(this.state.assemblyContainer)
            .then(res => console.log(res) && (res.status === 200 && res.data.rtnCode === 0) )
            .then(result => (result && this.refreshData()) || alert('submit Failed'))
            .catch(err => {
                console.log(err);
                alert(err);
            })
            .finally(() => this.setState({ loading: false }));
    }
    render() {
        const { loading } = this.state;
        if (loading)
            return (<Preloader/>);
        else {
            const { match: { zhName, enName, startDate, endDate }, matchAssemblies } = this.state.data;
            const { dialogOpen } = this.state;
            return (
                <React.Fragment>
                    <Paper>
                        <Typography component="h3" variant="h5" color="inherit" align={"center"}>
                            Match Configuration
                        </Typography>
                        <Typography component="h3" variant="h5" color="inherit" align={"center"}>
                            {zhName}
                        </Typography>
                        <Typography component="h3" variant="h5" color="inherit" align={"center"}>
                            {enName}
                        </Typography>
                        <Typography component="h5" variant="h5" color="inherit" align={"center"}>
                            {startDate + " ~ " + endDate}
                        </Typography>
                    </Paper>
                    <Paper>
                        {/*<button onClick={() => goToComponent(6)}>Area/Code</button>*/}
                        <Button
                            variant={'outlined'}
                            onClick={() =>
                                this.setState({dialogOpen: true})}>Add Match Assembly</Button>
                        <button onClick={() => this.refreshData}>Refresh</button>
                    </Paper>
                    <MatchAssemblyList data={matchAssemblies} />
                    <AssemblyForm
                        open={dialogOpen}
                        onCloseHandler={() => this.setState({ dialogOpen: false })}
                        onTextFieldChangeHandler={(fieldName) => (event) =>
                            this.setState({
                            assemblyContainer: {
                                ...this.state.assemblyContainer,
                                [fieldName]: event.target.value
                            }
                        })
                        }
                        submitHandler={this.addAssemblyHandler}
                        data={this.state.assemblyContainer}
                        title={'New Assembly'}/>
                </React.Fragment>
            );
        }
    }
}

MatchConfigurationComponent.propTypes = {
    classes: PropTypes.object.isRequired
};

const MatchConfiguration = withStyles(styles)(MatchConfigurationComponent);

export default MatchConfiguration;
