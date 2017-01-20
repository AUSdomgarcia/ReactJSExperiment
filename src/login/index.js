// Css
import './login.scss';
// import jQuery from "jQuery";
import React, {Component} from 'react';
import { browserHistory } from 'react-router';

export default class Login extends Component {
  constructor(props) { 
    super(props);
    this.state = {username: '',password: ''};    
    // document.write(JSON.stringify(props));
  }

  componentDidMount() {
    console.log('on Mounted');
  }

  handleSubmit(event){
    console.log('A name was submitted: ' + this.state.username, this.state.password);
    event.preventDefault();
    // if success
    browserHistory.push('/home');
  }

  handleChange(event){
    switch(event.target.name){
      case "username":
        this.setState({username: event.target.value});
      break;
      case "password":
        this.setState({password: event.target.value});
      break;
    }
  }

  render() {
    return (
    <div className="wrapper">
      <form className="form-signin" onSubmit={this.handleSubmit.bind(this)}>      
        <h2 className="form-signin-heading">Please login</h2>
        <input value={this.state.username} onChange={this.handleChange.bind(this)} type="text" className="form-control" name="username" placeholder="Email Address" required="" autoFocus="" />
        <input value={this.state.password} onChange={this.handleChange.bind(this)} type="password" className="form-control" name="password" placeholder="Password" required="" />      
        <label className="checkbox">
          <input type="checkbox" value="remember-me" id="rememberMe" name="rememberMe"/> 
          Remember me
        </label>
        <button className="btn btn-lg btn-primary btn-block" value="Submit" type="submit">Login</button>   
      </form>
    </div>
    );
  }
}

