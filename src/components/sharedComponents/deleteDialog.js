import React from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";

class DeleteDialog extends React.Component {
    render() {
        const { open, name, data, onCloseHandler, submitHandler } = this.props;
        return (
            <Dialog open={open} onClose={onCloseHandler}>
                <DialogTitle>Delete Match</DialogTitle>
                <DialogContent>
                    <DialogContentText>Deleting...{name}</DialogContentText>
                    <DialogActions>
                        <Button onClick={submitHandler(data)}
                                color={'secondary'}>Confirm</Button>
                        <Button onClick={onCloseHandler} color={'primary'}>Close</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        );
    }
}

export default DeleteDialog;