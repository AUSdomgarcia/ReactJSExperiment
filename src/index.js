import 'babel-polyfill';

import React from 'react';

import {Router, Route, browserHistory, Link } from 'react-router';
import ReactDOM from 'react-dom';

import {Login} from './login';
import {Home} from './app/home';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Login}/>
        <Route path="/home" component={Home}/>
    </Router>,
  document.getElementById('root')
);
