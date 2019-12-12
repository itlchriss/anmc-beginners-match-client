import React from "react";
import Assembly from "../../entities/assembly";
import DialogStyle from "../../../assets/styles/dialogStyle";
import Preloader from "../../utilities/preloader";
import {apiGetAllDifficulties, apiGetAreas, apiGetCodes, apiGetHeightTypes, apiGetStageTypes} from "../../../api";
import {CheckResponse} from "../../utilities/checkResponse";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";

class AssemblyForm extends React.Component {
    constructor(props) {
        super(props);
        let _data = this.props.data || new Assembly();
        this.state = {
            loading: true,
            constants: { heights: [], stages: [], parentData: this.props.parentData },
            data: _data };
        this.textFieldChangeHandler = this.textFieldChangeHandler.bind(this);
    }
    componentDidMount() {
        let p = [];
        p.push(apiGetHeightTypes());
        p.push(apiGetStageTypes());
        Promise.all(p)
            .then( result => {
                if (!CheckResponse(result)) throw 'API Error';
                else return result.map((r,i) => r.data.data);
            })
            .then ( data => {
                let [ _heights, _stages ] = data;
                this.setState({
                    constants: { ...this.state.constants, stages: _stages, heights: _heights }, loading: false
                });
            })
            .catch( err => {
                console.error(err);
                this.setState({ loading: false });
            });
    }
    textFieldChangeHandler = fieldName => event => {
      this.setState({ data: { ...this.state.data, [fieldName]: event.target.value }});
    };
    render() {
        const { loading, constants: { heights, stages } } = this.state;
        if (loading)
            return (<Preloader/>);
        else {
            const { matchId } = this.state.constants.parentData;
            const { title, open, classes, onCloseHandler, submitHandler } = this.props;
            let { zhName, enName, stageType, heightType, numOfEJ, numOfSJ, dives, id } = this.state.data;
            return (
                <Dialog
                    open={open}>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill in all the information below
                        </DialogContentText>
                        <Paper className={classes.container}>
                            <form noValidate autoComplete={'off'}>
                                <TextField
                                    label="Chinese Name"
                                    fullWidth
                                    className={classes.textField}
                                    value={zhName}
                                    onChange={this.textFieldChangeHandler('zhName')}
                                />
                                <TextField
                                    label="English Name"
                                    fullWidth
                                    className={classes.textField}
                                    value={enName}
                                    onChange={this.textFieldChangeHandler('enName')}
                                />
                                <TextField
                                    select
                                    label="Height"
                                    value={heightType}
                                    onChange={this.textFieldChangeHandler('heightType')}
                                    helperText="Please select the Height">
                                    {heights.map(option => (
                                        <MenuItem key={option.Id} value={option.Id}>
                                            {option.HeightM.trim()}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    label="Stage"
                                    value={stageType}
                                    onChange={this.textFieldChangeHandler('stageType')}
                                    helperText="Please select the stage"
                                >
                                    {stages.map(option => (
                                        <MenuItem key={option.Id} value={option.Id}>
                                            {option.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label={"Number Of Dives"}
                                    fullWidth
                                    className={classes.textField}
                                    value={dives}
                                    onChange={this.textFieldChangeHandler('dives')}
                                />
                                <TextField
                                    label={"Number Of Execution Judges"}
                                    fullWidth
                                    className={classes.textField}
                                    value={numOfEJ}
                                    onChange={this.textFieldChangeHandler('numOfEJ')}
                                />
                                <TextField
                                    label={"Number of Synchronization Judges"}
                                    fullWidth
                                    className={classes.textField}
                                    value={numOfSJ}
                                    onChange={this.textFieldChangeHandler('numOfSJ')}
                                />
                            </form>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color={'secondary'}
                            onClick={submitHandler({ ...this.state.data.getWebServiceObject(), matchId: matchId })}>
                            Submit
                        </Button>
                        <Button color={'primary'} onClick={onCloseHandler}>Close</Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

export default withStyles(DialogStyle)(AssemblyForm);