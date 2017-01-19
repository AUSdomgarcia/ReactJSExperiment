import '../common/resources.scss';
import jQuery from "jQuery";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

export class Login extends Component {
  constructor() { 
    super();
  }

  componentDidMount() {
    console.log(jQuery);

    let j = jQuery(ReactDOM.findDOMNode(this.refs.reactBtn))
    alert(j);
    j.css({'border':'10px solid red'});
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <label>username</label>
        <input type="text"/>
        <label>password</label>
        <input type="text"/>
        <button className="btn btn-success">Submit</button>
        <i className="fa fa-times"></i>
      </div>
    );
  }
}

// <Button ref="reactBtn" bsStyle="primary">submit</Button>

