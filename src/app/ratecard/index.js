import React, {Component} from 'react';
import {Link} from 'react-router';

import './ratecard.scss';

export class RateCard extends Component {
    
    render(){
        
        return (
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='manage-packages'>
                    {/* Active Rate Card Listing */}
                    <div className='col-md-12'>
                        <h3 className='sky'>Active Rate Card</h3>

                        <table className='table table-hover table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>Pakages</th>
                                    <th>Description</th>
                                    <th>Version</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>2017 Rate Card</td>
                                    <td>This is the baseline Rate card for 2017</td>
                                    <td>V1.1</td>
                                    <td>
                                        <button className='btn btn-primary'>Edit</button>
                                        <button className='btn btn-primary'>View</button>
                                        <button className='btn btn-warning'>Archive</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className='footer-container clearfix'>
                            <Link to='/ratecard/add' className='btn btn-primary pull-right'>Create Rate Card</Link>
                        </div>
                    </div>

                    {/* Archived Rate Card Listing */}
                    <div className='col-md-12'>
                        <h3 className='sky'>Archive Rate Card</h3>

                        <table className='table table-hover table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>Pakages</th>
                                    <th>Description</th>
                                    <th>Version</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>2017 Rate Card</td>
                                    <td>This is the baseline Rate card for 2017</td>
                                    <td>V1.1</td>
                                    <td>
                                        <button className='btn btn-primary'>Edit</button>
                                        <button className='btn btn-primary'>View</button>
                                        <button className='btn btn-warning'>Archive</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

            </div>
        <br className="clearfix" /><br />
        </div>
        )
    }
}

import { AsideRateCard } from './asideRateCard.js';

export class RateCardAdd extends Component {
    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>
                        <form>
                            <div className='form-group'>
                                <label>Rate Card name</label>
                                <input className='form-control' type='text' />
                                <label>Rate Card Description</label>
                                <input className='form-control' type='text' />
                            </div>
                        </form>
                        
                        <Link className='btn btn-default pull-left' to='/ratecard'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/ratecard/choose'>Next</Link>
                    </div>

                </div>

            <br className="clearfix" /><br />
            </div>
        )
    }
}

export class RateCardChoose extends Component {
    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>

                        <div className='rc-type'>
                            <label><span>Rate Type &nbsp;&nbsp;</span></label>
                            <select>
                                <option>Standard</option>
                                <option>Unilever</option>
                                <option>Cheap</option>
                                <option>Expensive</option>
                            </select>
                        </div>
                    
                    <div className='service-checklist'>
                        <table className='table table-hover table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>Service ID</th>
                                    <th>Category</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Cost</th>    
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        <input type='checkbox' /><span> S-001</span>
                                    </td>
                                    <td>
                                        Digital Strategy
                                    </td>
                                    <td>
                                        Digital Consultation
                                    </td>
                                    <td>
                                        Digital trendspotting, web and social media best practices
                                    </td>
                                    <td>
                                        20,000
                                    </td>
                                </tr>
                            </tbody>                           
                        </table>

                        <hr />

                        <div className='selected-count'>Total Services:&nbsp;<span>0</span></div>
                    </div>

                    <br />

                    <Link className='btn btn-default pull-left' to='/ratecard/add'>Back</Link>
                    <Link className='btn btn-primary pull-right' to='/ratecard/permission'>Next</Link>
                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}

import PermissionEditor from '../../common/permissionEditor/permissionEditor.js';

export class RateCardPermission extends Component {
    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>
                
                <div className='package-content'>

                    <div className='col-md-12'>
                        
                        <PermissionEditor />

                        <br />

                        <Link className='btn btn-default pull-left' to='/ratecard/choose'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/ratecard/save'>Next</Link>
                    </div>
                </div>

            <br className="clearfix" /><br />
            </div>
        )
    }
}

import CategoryTreeView from '../../common/categoryTreeView/categoryTreeView.js';
import PermissionView from '../../common/permissionView/permissionView.js';

export class RateCardSave extends Component {

    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>

                        <CategoryTreeView />

                        <br />

                        <h3>Rate Card Permission</h3>
                        
                        <PermissionView />

                        <br />
                    
                        <Link className='btn btn-default pull-left' to='/ratecard/permission'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/ratecard'>Save</Link>
                    </div>
                </div>

                <br className="clearfix" /><br />
            </div>
        )
    }
}
