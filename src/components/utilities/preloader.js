import React from "react";
import {LinearProgress} from "@material-ui/core";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
});

class Preloader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <h5>Loading...</h5>
                <LinearProgress />
                <LinearProgress color={'secondary'}/>
            </div>
        );
    }
}

Preloader.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Preloader);