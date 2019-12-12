import React from "react";
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
import Match from "../../entities/match";
import withStyles from "@material-ui/core/styles/withStyles";
import DialogStyle from "../../../assets/styles/dialogStyle";

class Form extends React.Component {
    constructor(props) {
        super(props);
        let _data = this.props.mode !== 1? this.props.data : new Match();
        this.state = { data: _data };
        this.textFieldChangeHandler = this.textFieldChangeHandler.bind(this);
    }
    textFieldChangeHandler = fieldName => event => {
        this.setState({ data: { ...this.state.data, [fieldName] : event.target.value }});
    };
    render() {
        let { classes, matchId, mode, title, open, closeDialogHandler, submitFormHandler } = this.props;
        let { data: { zhName, enName, startDate, endDate } } = this.state;
        return (
            <Dialog
                open={open}>
                <DialogTitle>
                    { mode === 1 ? 'New Match Form' : title }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill in all the information below
                    </DialogContentText>
                    <Paper className={classes.container}>
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
                            label={"Start Date"}
                            fullWidth
                            className={classes.textField}
                            value={startDate}
                            onChange={this.textFieldChangeHandler('startDate')}
                        />
                        <TextField
                            label={"End Date"}
                            fullWidth
                            className={classes.textField}
                            value={endDate}
                            onChange={this.textFieldChangeHandler('endDate')}
                        />
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button
                        color={'secondary'}
                        onClick={submitFormHandler(mode, {
                            zhName: zhName, enName: enName, startDate: startDate, endDate: endDate, matchId })}>
                        Submit
                    </Button>
                    <Button color={'primary'} onClick={closeDialogHandler}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(DialogStyle)(Form);