import '../common/resources.scss';

import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export class Login extends Component {
  constructor() { 
    super();
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <label>username</label>
        <input type="text"/>
        <label>password</label>
        <input type="text"/>
        <Button bsStyle="primary">submit</Button>
        <i className="fa fa-times"></i>
      </div>
    );
  }
}


