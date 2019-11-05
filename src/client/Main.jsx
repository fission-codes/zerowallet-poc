import React from 'react';
import { withStyles, createStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import LoginForm from './components/LoginForm';
import keystore from '../lib/keystore';

class Main extends React.Component {
  state = {
    hasShard: false
  };

  componentDidMount(){
    const shard = keystore.getShard()
    if(shard && shard.length > 0){
      this.setState({ hasShard: true })
    }
  }

  handleSubmit = async (info) => {
    const { username, password1, password2 } = info

    if(this.state.hasShard){
      const secret = keystore.getPrivKey(password1)
      console.log('secret: ', secret)
    }else {
      const shard = await keystore.createShard(username, password1, password2)
      keystore.saveShard(shard)
    }
  }

  render() {
    const { classes } = this.props
    return (
      <Container>
        <div className={classes.loginContainer}>
          <LoginForm onSubmit={this.handleSubmit} hasShard={this.state.hasShard} />
        </div>
      </Container>
    );
  }
}

const styles = theme =>
  createStyles({
    loginContainer: {
      margin: theme.spacing(16),
      display: 'flex',
      justifyContent: 'center',
    }
  });

export default withStyles(styles)(Main);
