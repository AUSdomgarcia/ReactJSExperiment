import 'babel-polyfill';

import React from 'react';
import {Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import ReactDOM from 'react-dom';

// Pages
import MainLayout from './layout/main';
import Login from './login/index';
import Home from './app/home/index';
import {Packages, PackagesCreation, PackagesChooseService} from './app/packages/index';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" handler={MainLayout}>
        
            <IndexRoute handler={Home} />

            <Route path="login" handler={Login} />

            <Route path="packages">
                <IndexRoute handler={Packages} />
                <Route path="/packages/create" handler={PackagesCreation} />
                <Route path="/packages/choose-service" handler={PackagesChooseService} />
            </Route>
        </Route>
    </Router>,
  document.getElementById('root')
);