import React from 'react';
import { withStyles, createStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class LoginForm extends React.Component {
  state = {
    username: "",
    password1: "",
    password2: "",
  };

  handleSubmit = async (evt) => {
    evt.preventDefault()
    this.props.onSubmit(this.state)
  }

  handleChange = name => evt => {
    const value = evt.target.value
    this.setState({
      [name]: value
    })
  }

  render() {
    const { hasShard, classes } = this.props
    return (
      <Paper className={classes.root}>
        <form onSubmit={this.handleSubmit} className={classes.form}>
          <Typography variant="h4" className={classes.input}>
            {hasShard ? "Login" : "Signup/Recover"}
          </Typography>
          <TextField
            label="Username"
            value={this.state.username}
            onChange={this.handleChange("username")}
            fullWidth
            className={classes.input}
          />
          <TextField
            label="Account Password"
            value={this.state.password1}
            type="password"
            onChange={this.handleChange("password1")}
            fullWidth
            className={classes.input}
          />
          {!hasShard &&
            <React.Fragment>
              <TextField
                label="Recovery Password"
                value={this.state.password2}
                type="password"
                onChange={this.handleChange("password2")}
                fullWidth
                className={classes.input}
              />
              <Typography variant="caption" className={classes.caption}>
                Looks like you haven't logged in on this device before. Create your account, or use your recovery password to login.
              </Typography>
            </React.Fragment>
          }
          <Button
            type="submit"
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </form>
      </Paper>
    );
  }
}

const styles = theme =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      width: '100%',
      maxWidth: 350
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: {
      marginBottom: theme.spacing(2),
    },
    caption: {
      textAlign: "center",
      marginBottom: theme.spacing(2)
    }
  });

export default withStyles(styles)(LoginForm);
