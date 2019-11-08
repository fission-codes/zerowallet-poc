import React from 'react';
import { withStyles, createStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import safe from '../../lib/safe';

class Safe extends React.Component {

  state = {
    text: "",
    publicKey: "",
    cid: "",
    loaded: false,
    saving: false,
    saved: false,
  }

  async componentDidMount() {
    const cid = await safe.getCID(this.props.username)
    const content = await safe.getContentForCID(cid) 
    const publicKey = safe.getPublicKey()
    this.setState({
      text: content,
      publicKey,
      cid,
      loaded: true
    })
  }

  handleSave = async (evt) => {
    evt.preventDefault()
    this.setState({ saving: true })
    const cid = await safe.saveContent(this.props.username, this.state.text)
    this.setState({
      cid,
      saving: false,
      justSaved: true
    })
  }

  handleChange = (evt) => {
    const value = evt.target.value
    this.setState({ text: value, justSaved: false })
  }

  render() {
    const { classes } = this.props
    if(!this.state.loaded) {
      return <div></div>
    }
    
    return (
      <div className={classes.root}>
        <Paper className={classes.safe}>
          <Typography variant="h4" className={classes.header}>
            Safe
          </Typography>
          <TextField
            fullWidth
            multiline
            autoFocus
            rows="10"
            variant="outlined"
            placeholder="Store a private note here"
            value={this.state.text}
            onChange={this.handleChange}
          />
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              disabled={this.state.justSaved}
              variant="contained"
              onClick={this.handleSave}
            >
              {this.state.saving ? "Saving" : "Save"}
            </Button>
          </div>
        </Paper>
        <Paper className={classes.detail}>
          <Typography>
            <strong>Public Key</strong>: {this.state.publicKey}
          </Typography>
          <Typography>
            <strong>Your Safe's CID</strong>: {this.state.cid}
          </Typography>
        </Paper>
      </div>
    )
  }
}

const styles = theme =>
  createStyles({
    safe: {
      padding: theme.spacing(3),
      width: '100%',
      display: 'flex',
      flexDirection: 'column', 
      alignItmes: 'center'
    },
    detail: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      wordBreak: 'break-all'
    },
    header: {
      textAlign: "center",
      marginBottom: theme.spacing(2)
    },
    buttonContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: "flex-end",
      marginTop: theme.spacing(2),
    }
  });

export default withStyles(styles)(Safe);
