import React, {Component} from 'react';
import {Link} from 'react-router';

import './services.scss';

import xhr from 'jquery';

export class Services extends Component {

    constructor(props){
        super(props);
        this.state = {
            categoriesArr: []
        };
        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
    }

    onManage(evt){
        let id = xhr(evt.target)[0].dataset.storedid;

        xhr.get(this.BASE_URL+'/rate-cards/services?service_category_id='+id, function(data){
            console.log( data );
        });
        // this.context.router.push('/services/manage');
    }

    componentDidMount(){
        let scope = this;

        xhr.get(this.BASE_URL+'/rate-cards/service-categories/services', function(data){
            console.log( data );
            scope.setState({ categoriesArr : data.payload });
        });
    }

    onDelete(){

    }

    render(){
        let categories = null;
        let scope = this;

        if(this.state.categoriesArr.length!==0){
            categories = 
            this.state.categoriesArr.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.name}</td>
                        <td>{data.services_count}</td>
                        <td>{data.rate_types_count}</td>
                        <td>
                            {/*<button type="button" data-storeid={data.id} className="btn btn-default" onClick={scope.onManage.bind(scope)} >Manage</button>*/}
                            <Link className='btn btn-default' 
                                to={'services/manage/' + data.id + '/' + data.name } >Manage</Link>&nbsp;
                            <button type="button" data-storeid={data.id} className="btn btn-danger"  onClick={scope.onDelete.bind(scope)} ><i className="fa fa-times"></i></button>
                        </td>
                    </tr>
                )
            });
        }

        return (
            <div>
                <h3 className="sky">Manage Services</h3>
                <p><Link to="/services/viewer">View All</Link></p>

                <table className='table table-hover table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Service Category</th>
                            <th>Services</th>
                            <th>Rate Types</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories}
                    </tbody>                           
                </table>
            </div>
        )
    }
}

Services.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export class ManageServices extends Component {

    constructor(props){
        super(props);
        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        this.state = {
            serviceArr: [],
            title: ""
        };
    }
    
    componentWillReceiveProps(nextProps){
        // console.log(nextProps);
        if(nextProps){
            this.setState({ title: nextProps.params.title });
            xhr.get(this.BASE_URL+'/rate-cards/services?service_category_id=' + nextProps.params.id, function(data){
                console.log( data );
            });
        }
    }

    onEdit(){
        this.context.router.push('/services/edit');
    }

    onDelete(){
        //
    }

    render(){
        let scope = this;
        let services = null;

        if(this.state.serviceArr.length!==0){
            services = 
            this.state.serviceArr.map(function(){
                return (
                    <tr>
                        <td>Product 1</td>
                        <td>Standard</td>
                        <td>70,000</td>
                        <td>Active</td>
                        <td>
                            <button type="button" className="btn btn-default" onClick={this.onEdit.bind(this)}>Edit</button>
                            <button type="button" className="btn btn-danger"  onClick={this.onDelete.bind(this)}>
                                <i className="fa fa-times"></i>
                            </button>
                        </td>
                    </tr>
                )
            });
        }

        return (
            <div>
                <h3 className="sky">Manage Services: <span>{this.state.title}</span></h3>
                
                <div className="header">
                    <div className="col-xs-6 text-left">
                        <Link to="/services">Return to Full List</Link>
                    </div>

                    <div className="col-xs-6 text-right">
                        <Link className="btn btn-primary" to="/services/add">Add Service</Link>
                    </div>
                    <br className="clearfix" />
                </div>

                <br />
                
                <table className='table table-hover table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Services</th>
                            <th>Rate Type</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {services}
                    </tbody>                           
                </table>

            </div>
        )
    }
}

ManageServices.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export class ServiceEdit extends Component {

    render(){
        return (
            <div>
                <h3 className="sky">Manage Services: <small>[Digital Strategy (will eventually become component Header)]</small></h3>
                
                <br />

                {/* LEFT SIDE */}
                <div className="col-xs-6">
                    <div className="form-group">
                        <label>Service ID</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Service Name</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows="5"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Service Category</label>
                        <select className="form-control">
                            <option value="ds">Digital Strategy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Rate Type</label>
                        <select className="form-control">
                            <option value="standard">Standard</option>
                        </select>
                    </div>

                    <div className="group-box">
                        <div className="form-group">
                            <label>Personnel ID</label>
                            <select className="form-control">
                                <option value="1">Strategist</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Manhours</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="group-box">
                        <div className="form-group">
                            <label>Personnel ID</label>
                            <select className="form-control">
                                <option value="1">Strategist</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Manhours</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <p className="personnel-btn-wrapper">
                        <button type="button" className="btn btn-default">Add More Personnel</button>
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-xs-6">
                    <div className="form-group">
                        <label>Create By</label>
                        <input type="text" className="form-control" disabled/>
                    </div>

                    <div className="form-group">
                        <label>Date Created</label>
                        <input type="text" className="form-control" disabled/>
                    </div>

                    <div className="form-group">
                        <label>Last Updated</label>
                        <input type="text" className="form-control" disabled/>
                    </div>

                    <div className="status text-right">
                        <label><input type="radio" name="service_status" />Active</label>
                        <label><input type="radio" name="service_status" />Inactive</label>
                    </div>

                    <br className="clearfix"/>

                    <p className="text-right">
                        <strong>Subtotal:</strong>&nbsp;<span>20,000</span>
                    </p>
                </div>

                <br className="clearfix" />

                <div className="activity-log-wrapper">
                    <div className="title">
                        <h3 className="sky">Activity Log <span>[SOME ID][NAME]</span></h3>
                    </div>

                    <table className='table table-hover table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Value</th>
                                <th>User</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Created</td>
                                <td>N/A</td>
                                <td>tom.deleon</td>
                                <td>12/10/2016</td>
                            </tr>
                        </tbody>                           
                    </table>
                </div>

                <br className="clearfix" />
            </div>
        )
    }
}

export class ServiceAdd extends Component {
    render(){
        return ( 
            <div>
                <h3 className="sky">Manage Services: <small>Add Service</small></h3>
                
                <br />

                <Link to="/services/manage">Return to full list</Link>

                <br />

                {/* LEFT SIDE */}
                <div className="col-xs-6">
                    <div className="form-group">
                        <label>Service ID</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Service Name</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows="5"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Service Category</label>
                        <select className="form-control">
                            <option value="ds">Digital Strategy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Rate Type</label>
                        <select className="form-control">
                            <option value="standard">Standard</option>
                        </select>
                    </div>

                    <div className="group-box">
                        <div className="form-group">
                            <label>Personnel ID</label>
                            <select className="form-control">
                                <option value="1">Strategist</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Manhours</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="group-box">
                        <div className="form-group">
                            <label>Personnel ID</label>
                            <select className="form-control">
                                <option value="1">Strategist</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Manhours</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <p className="personnel-btn-wrapper">
                        <button type="button" className="btn btn-default">Add More Personnel</button>
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-xs-6">
                    <div className="form-group">
                        <label>Create By</label>
                        <input type="text" className="form-control" disabled/>
                    </div>

                    <div className="form-group">
                        <label>Date Created</label>
                        <input type="text" className="form-control" disabled/>
                    </div>

                    <div className="form-group">
                        <label>Last Updated</label>
                        <input type="text" className="form-control" disabled/>
                    </div>

                    <div className="status text-right">
                        <label><input type="radio" name="service_status" />Active</label>
                        <label><input type="radio" name="service_status" />Inactive</label>
                    </div>

                    <br className="clearfix"/>

                    <p className="text-right">
                        <strong>Subtotal:</strong>&nbsp;<span>20,000</span>
                    </p>
                </div>

                <br className="clearfix" />
            </div>
        )
    }
}


export class ServiceViewer extends Component {

    addSevice(){
        this.context.router.push('/services/add')
    }
    extractAll(){
        // 
    }

    render(){
        return (
            <div>
                <h3 className="sky">Manage Services</h3>

                <div>
                    <div className="col-xs-6">
                        <Link to="/services/manage">Return to Manage Services</Link>   
                    </div>
                    <div className="col-xs-6 text-right">
                        <button type="button" className="btn btn-primary" onClick={this.addSevice.bind(this)}>Add Service</button>&nbsp;
                        <button type="button" className="btn btn-primary" onClick={this.extractAll.bind(this)}>Extract All</button>
                    </div>    
                    <br className="clearfix" />                
                </div>
                
                <p>Total Services: 100</p>

                <br />

                <table className='table table-hover table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Service ID</th>
                            <th>Category</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Rate Type</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                          <td>S-001</td>
                          <td>Digital Strategy</td>
                          <td>Digital Consultant</td>
                          <td>Digital Trendspotting, Web and Social Media best practices</td>
                          <td>Standard</td>
                          <td>20,000</td>
                          <td>Active</td>
                          <td>
                            <button type="button" className="btn btn-default">Edit</button>
                            <button type="button" className="btn btn-danger">Close</button>
                          </td>
                        </tr>
                    </tbody>                           
                </table>

                    
            <br className="clearfix" />
            </div>
        )
    }
}

ServiceViewer.contextTypes = {
  router: React.PropTypes.object.isRequired
};
