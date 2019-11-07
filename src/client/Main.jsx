import React from 'react';
import { withStyles, createStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import LoginForm from './components/LoginForm';
import Safe from './components/Safe';
import keystore from '../lib/keystore';

class Main extends React.Component {
  state = {
    username: null,
    hasShard: false,
    isLocked: true,
  };

  async componentDidMount(){
    const hasShard = keystore.hasShard()
    this.setState({ hasShard })
    // await keystore.unlock("dholms", "asdf")
    // this.setState({ hasShard, username: "dholms", isLocked: false })
  }

  handleSubmit = async (info) => {
    const { username, password1, password2 } = info

    if(this.state.hasShard){
      await keystore.unlock(username, password1)
    }else {
      await keystore.createShard(username, password1, password2)
      await keystore.unlock(username, password1)
    }
    this.setState({
      username,
      hasShard: true,
      isLocked: false,
    })
  }

  render() {
    const { classes } = this.props
    return (
      <Container>
        <div className={classes.loginContainer}>
          {
            this.state.isLocked ?
            <LoginForm onSubmit={this.handleSubmit} hasShard={this.state.hasShard} /> : 
            <Safe username={this.state.username} />
          }
        </div>
      </Container>
    );
  }
}

const styles = theme =>
  createStyles({
    loginContainer: {
      marginTop: theme.spacing(8),
      display: 'flex',
      justifyContent: 'center',
    }
  });

export default withStyles(styles)(Main);
