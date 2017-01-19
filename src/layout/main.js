import React, {Component} from 'react';
import {Header} from './header';
import {Footer} from './footer';
import {Link, hashHistory} from 'react-router';

export default class MainLayout extends Component {

  componentDidMount(){
    // Force to redirect to Login
    alert('X');
  }

  render() {
    return (
      <div>
        <Header />
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/home">Home</Link></li>
          </ul>
          <div className="container">
            {this.props.children}
          </div>
        <Footer />
      </div>
    );
  }
}
