import 'babel-polyfill';

import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import ReactDOM from 'react-dom';

// Pages
import MainLayout from './layout/main';
import Login from './login/index';
import Home from './app/home/index';

import {
    Packages, 
    PackageAdd, 
    PackageChoose, 
    PackageRate, 
    PackagePermission, 
    PackageSave, 
    PackagePreview } from './app/packages/index';

import {
    RateCard,
    RateCardAdd,
    RateCardChoose,
    RateCardPermission,
    RateCardSave,
    RateCardEdit,
    RateCardView } from './app/ratecard/index';

import {
    Categories } from './app/categories/index';

import {
    Personnel,
    // PersonnelEdit } from './app/personnel/index';
    PersonnelEdit } from './app/personnel/index';

import {
    Services,
    ManageServices,
    ServiceAdd,
    ServiceEdit,
    ServiceViewer  } from './app/services/index';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={MainLayout}>
            <IndexRoute component={Home} />
            <Route path="login" component={Login} />
            
            {/* P A C K A G E S */}
            <Route path="packages">
                <IndexRoute component={Packages} />
                <Route path="/packages/add" component={PackageAdd} />
                <Route path="/packages/choose" component={PackageChoose} />
                <Route path="/packages/rate" component={PackageRate} />
                <Route path="/packages/permission" component={PackagePermission} />
                <Route path="/packages/save" component={PackageSave} />
                <Route path="/packages/preview" component={PackagePreview} />
            </Route>
                
            {/* R A T E  C A R D */}
            <Route path='ratecard'>
                <IndexRoute component={RateCard} />
                <Route path="/ratecard/add" component={RateCardAdd} />
                <Route path="/ratecard/choose" component={RateCardChoose} />
                <Route path="/ratecard/permission" component={RateCardPermission} />
                <Route path="/ratecard/save" component={RateCardSave} />

                <Route path="/ratecard/edit" component={RateCardEdit} />
                <Route path="/ratecard/view" component={RateCardView} />
            </Route>

            {/* C A T E G O R I E S */}
            <Route path='categories'>
                <IndexRoute component={Categories} />
            </Route>

            {/* P E R S O N E L */}
            <Route path='personnel'>
                <IndexRoute component={Personnel} />
                <Route path='/personnel/edit/:id/:ratetype/:department/:position/:manhour' component={Personnel} />
            </Route>

            {/* S E R V I C E S */}
            <Route path='services'>
                <IndexRoute component={Services} />
                <Route path="/services/manage" component={ManageServices} />
                <Route path="/services/add" component={ServiceAdd} />
                <Route path="/services/edit" component={ServiceEdit} />
                <Route path="/services/viewer" component={ServiceViewer} />
            </Route>

        </Route>
    </Router>,
  document.getElementById('root')
);