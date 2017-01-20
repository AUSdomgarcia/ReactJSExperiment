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
        <Route path="/" component={MainLayout}>
        
            <IndexRoute component={Home} />

            <Route path="login" component={Login} />

            <Route path="packages">
                <IndexRoute component={Packages} />
                <Route path="/packages/create" component={PackagesCreation} />
                <Route path="/packages/choose-service" component={PackagesChooseService} />
            </Route>
        </Route>
    </Router>,
  document.getElementById('root')
);