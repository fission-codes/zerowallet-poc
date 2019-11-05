import React, { Component } from 'react';
import { createShard } from '../lib/utils'
import keystore from '../lib/keystore'
import './app.css';

export default class App extends Component {
  state = {
    username: "",
    password1: "",
    password2: "",
    hasShard: false
  };

  componentDidMount(){
    const shard = keystore.getShard()
    if(shard && shard.length > 0){
      this.setState({ hasShard: true })
    }
  }

  handleSubmit = async (evt) => {
    evt.preventDefault()
    const { username, password1, password2 } = this.state
    if(this.state.hasShard){
      const secret = keystore.getPrivKey(password1)
      console.log('secret: ', secret)
    }else {
      await createShard(username, password1, password2)
    }
  }

  handleChange = name => evt => {
    const value = evt.target.value
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <br/><br/><br/><br/><br/><br/><br/><br/>
          <input placeholder="Username" value={this.state.username} onChange={this.handleChange("username")} /><br/><br/>
          <input placeholder="Password 1" value={this.state.password1} type="password" onChange={this.handleChange("password1")} /><br/><br/>
          {!this.state.hasShard &&
            <React.Fragment>
              <input placeholder="Password 2" value={this.state.password2} type="password" onChange={this.handleChange("password2")} /><br/><br/>
            </React.Fragment>
          }
          <button type="submit">
            {this.state.hasShard ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    );
  }
}
