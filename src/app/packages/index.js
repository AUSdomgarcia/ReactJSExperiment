import React, {Component} from 'react';
import {Link} from 'react-router';

import {AsideNav} from './aside';

import CalcView from '../../common/calcview/calcview';
import CategoryTreeView from '../../common/categoryTreeView/categoryTreeView';
import PermissionView from '../../common/permissionView/permissionView';

// Landing Page
export class Packages extends Component {
    
    componentDidMount(){
        // mounted
    }

    render() {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                <div className='manage-packages'>
                    <h3 className='sky'>Manage Packages</h3>

                    <table className='table '>
                        <thead>
                            <tr>
                                <th>Pakages</th>
                                <th>Products</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Unilever Web Package</td>
                                <td>14</td>
                                <td>
                                    <button className='btn btn-primary'>Manage</button>
                                    <button className='btn btn-danger'>Delete</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Big Idea</td>
                                <td>25</td>
                                <td>
                                    <button className='btn btn-primary'>Manage</button>
                                    <button className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>

                    <Link className="btn btn-block btn-primary" to='/packages/add'>
                        <i className="fa fa-plus"></i>
                        <span> Add Packages</span>
                    </Link>
                </div>
             
            <br className="clearfix" /><br />
            </div>
        )
    }
}












// Step1 - Add Service
export class PackageAdd extends Component {
    
    render(){
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                <div className='package-content'>
                    <div className='col-md-12'>
                        <form>
                            <div className='form-group'>
                                <label>Package name</label>
                                <input className='form-control' type='text' />
                                <label>Package Description</label>
                                <input className='form-control' type='text' />
                            </div>
                        </form>
                        
                        <Link className='btn btn-default pull-left' to='/packages'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/choose'>Next</Link>   
                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}












// Step2 - Choose Service
export class PackageChoose extends Component {
    
    render(){
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>

                        <div className='rc-type'>
                            <label><span>Rate Card &nbsp;&nbsp;</span></label>
                            <select>
                                <option>Standard</option>
                                <option>Cheap</option>
                                <option>Expensive</option>
                            </select>
                        </div>
                        
                        <br />
                        
                        <div className='service-lists'>
                            <table className='table table-hover table-striped'>
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Category</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Cost</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>S-001</td>
                                        <td>Digital Strategy</td>
                                        <td>Digital Consultation</td>
                                        <td>Is a global Solutions</td>
                                        <td>70,000</td>
                                    </tr>
                                    <tr>
                                        <td>S-002</td>
                                        <td>Digital Strategy</td>
                                        <td>Digital Consultation</td>
                                        <td>Is a global Solutions</td>
                                        <td>70,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <br />

                        <div className='added-services'>
                            <h4>Added Services</h4>

                            <table className='table table-hover table-striped'>
                                <thead>
                                    <tr>
                                        <th>Service Name</th>
                                        <th>Description</th>
                                        <th>Cost</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Digital Consultation</td>
                                        <td>Digital trendspotting, web and social media best practices</td>
                                        <td>70,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <Link className='btn btn-default pull-left' to='/packages/add'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/rate'>Next</Link>
                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}












// Step3 - Rate Service
export class PackageRate extends Component {
    render () {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                 <div className='package-content'>
                    <div className='col-md-12'>
                        <div className='row'>
                            
                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Total Package Rate</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='text' className='form-control' />
                                </div>
                            </div>
                            
                            <br/>

                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Discount</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='text' className='form-control' />
                                </div>
                            </div>

                            <br/>

                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Package Rate</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='text' className='form-control' />
                                </div>
                            </div>

                        </div>
                    
                    <br />

                    <Link className='btn btn-default pull-left' to='/packages/choose'>Back</Link>
                    <Link className='btn btn-primary pull-right' to='/packages/permission'>Next</Link>
                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}












// Step4 - Permission Service
export class PackagePermission extends Component {
    render () {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                
                <div className='package-content'>
                    <div className='col-md-12'>
                        
                        <h4>Choose user to give permission</h4>
                        
                        <div className='input-group'>
                            <span className='input-group-btn'>
                                <button className='btn btn-default' type='button'>
                                    <i className='fa fa-search'></i>
                                </button>
                            </span>
                            <input type='text' className='form-control' placeholder='Search for...' />
                        </div>

                        <br />

                        <div className='searched-people'>
                            <table className='table table-hover table-striped'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Monica Climaco</td>
                                        <td>
                                            <button className='btn btn-primary'>Add</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Dominador Garcia</td>
                                        <td>
                                            <button className='btn btn-primary'>Add</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='permitted-people'>
                            <h4>Permitted User</h4>

                            <table className='table table-hover table-striped'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Monica Climaco</td>
                                        <td>
                                            <button className='btn btn-danger'>Remove</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Dominador Garcia</td>
                                        <td>
                                            <button className='btn btn-danger'>Remove</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <br />

                        <Link className='btn btn-default pull-left' to='/packages/rate'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/save'>Next</Link>
                    </div>
                </div>

            <br className='clearfix' /><br />
            </div>
        )
    }
}












// Step4 - Save Service
export class PackageSave extends Component {

    render () {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                
                <div className='package-content'>

                    <div className='col-md-12'>
                        
                        <CategoryTreeView />

                        <CalcView />
                        
                        <h3>Package Permission</h3>

                        <PermissionView />    

                        <br />

                        <Link className='btn btn-default pull-left' to='/packages/permission'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/preview'>Save</Link>
                    </div>
                </div>

            <br className='clearfix' /><br />
            </div>
        )
    }
}












// Step5 - Preview Service
export class PackagePreview extends Component {

    render () {
        return (
            <div>
                {/* <AsideNav path={this.props.location.pathname}/> */}
                {/* <div className='package-content'> */}

                <div className='col-md-12 -overpadding'>

                    <h3><span className='sky'>Manage Package </span> Dynamic Web Package</h3>
                    <small><Link className='sky' to='/packages'> &lt;&lt; Return to Full List </Link></small>
                    
                    <br />

                    <CategoryTreeView />

                    <CalcView />
                    
                    <h3>Package Permission</h3>

                    <PermissionView />    

                    <br />

                    <Link className='btn btn-primary pull-left' to='/packages/add'>Edit</Link>
                </div>
            
                {/* </div> */}

            <br className='clearfix' /><br />
            </div>
        )
    }
}













    