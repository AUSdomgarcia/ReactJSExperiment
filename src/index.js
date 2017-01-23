import 'babel-polyfill';

import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import ReactDOM from 'react-dom';

// Pages
import MainLayout from './layout/main';
import Login from './login/index';
import Home from './app/home/index';
import {Packages, PackageAdd, PackageChoose, PackageRate, PackagePermission, PackageSave, PackagePreview} from './app/packages/index';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={MainLayout}>
            <IndexRoute component={Home} />
            <Route path="login" component={Login} />
            
            <Route path="packages">
                <IndexRoute component={Packages} />
                <Route path="/packages/add" component={PackageAdd} />
                <Route path="/packages/choose" component={PackageChoose} />
                <Route path="/packages/rate" component={PackageRate} />
                <Route path="/packages/permission" component={PackagePermission} />
                <Route path="/packages/save" component={PackageSave} />
                <Route path="/packages/preview" component={PackagePreview} />
            </Route>
        </Route>
    </Router>,
  document.getElementById('root')
);