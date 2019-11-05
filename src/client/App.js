import React, { Component } from 'react';
import axios from 'axios'
import crypto from 'crypto';
import ECCLib from '../lib/ECCLib'
import './app.css';
import { SourceNode } from 'source-map';
// imported with script tag because node must be compiled with OpenSSL
const secrest = window.secrets;

export default class App extends Component {
  state = {
    username: "",
    password1: "",
    password2: ""
  };

  sha256 = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex')
  }

  handleSubmit = async (evt) => {
    evt.preventDefault()
    // const { username, password1, password2 } = this.state
    const username = "dholms"
    const password1 = "Password!!"
    const password2 = "Test1234!!"
    const hashpw1 = this.sha256(password1)
    const hashpw2 = this.sha256(password2)

    const point = ECCLib.HashtoPoint(hashpw2)
    const random = "56e5aa458bdcc0080c5c1b8203365ec7228c2d8f042b396e11e02a3afd126d85"
    const alpha = ECCLib.ECModExponent(point[0],random);

    const resp = await axios.post('http://localhost:8080', { username, alpha: alpha[0] })
    const inv = ECCLib.ECInverse(random)
    const beta = ECCLib.ECModExponent(resp.data, inv)
    const rw = this.sha256(hashpw2.concat(beta))

    var shares = [`801${hashpw1}`,`802${rw}`];
    var privshare = secrets.newShare("03",shares);
    var secret = secrets.combine(shares);

    console.log(window.secrets)
    console.log("hashpw1: ", hashpw1)
    console.log("point: ", point)
    console.log("random: ", random)
    console.log("inv: ", inv)
    console.log("alpha: ", alpha)
    console.log("beta: ", beta)
    console.log("rw: ", rw)
    console.log("shares: ", shares)
    console.log("privshare: ", privshare)
    console.log("secret: ", secret)

    const remake1 = secrets.combine([`801${hashpw1}`, privshare])
    const remake2 = secrets.combine([`801${hashpw1}`, `802${rw}`])
    const remake3 = secrets.combine([`802${rw}`, privshare])
    console.log('remake1: ', remake1)
    console.log('remake2: ', remake2)
    console.log('remake3: ', remake3)
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
          <input placeholder="Password 2" value={this.state.password2} type="password" onChange={this.handleChange("password2")} /><br/><br/>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
