import 'babel-polyfill';

import React from 'react';
import {Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import ReactDOM from 'react-dom';

// Pages
import MainLayout from './layout/main';
import Login from './login/index';
import Home from './app/home/index';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={MainLayout}>
            <Route path="/login" component={Login}/>
            <Route path="/Home" component={Home}/>
        </Route>
    </Router>,
  document.getElementById('root')
);