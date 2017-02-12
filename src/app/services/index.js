import React, {Component} from 'react';
import {Link} from 'react-router';

import './services.scss';

import xhr from 'jquery';

import {InputHelper} from '../../common/helpers/inputhelpers';

import {ServicePersonnel} from '../../common/_services/servicePersonnel';

import {
    getServices,
    getServiceByCategoryId

 } from '../../common/http';

export class Services extends Component {

    constructor(props){
        super(props);
        this.state = {
            categoriesArr: []
        };
        // this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
    }

    componentDidMount(){
        let scope = this;
        // xhr.get(this.BASE_URL+'/rate-cards/service-categories/services', function(data){
        //     console.log('/services', data );
        //     scope.setState({ categoriesArr : data.payload });
        // });
        
        console.log('hellopo');

        getServices().then(function(data){
            console.log(data);
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
        // this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        this.state = {
            serviceArr: [],
            serviceCategoryIdRef: "",
            titleRef: ""
        };
    }

    componentWillMount(){
        this.setState({ titleRef: this.props.params.title });
        this.setState({ serviceCategoryIdRef: this.props.params.serviceCategoryId }); 
    }

    componentDidMount(){
        // xhr.get(this.BASE_URL+'/rate-cards/services?service_category_id=' + this.props.params.serviceCategoryId, function(data){
        //     console.log( data );
        // });
        getServiceByCategoryId(this.props.params.serviceCategoryId).then(function(data){
            console.log(data);
        })
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
                <h3 className="sky">Manage Services: <span>{this.state.titleRef}</span></h3>
                
                <div className="header">
                    <div className="col-xs-6 text-left">
                        <Link to="/services">Return to Full List</Link>
                    </div>

                    <div className="col-xs-6 text-right">
                        <Link 
                            className="btn btn-primary" 
                            to={'/services/add/' + this.state.serviceCategoryIdRef + '/' + this.state.titleRef }>Add Service</Link>
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

export class ServiceAdd extends Component {

    constructor(props){
        super(props);
        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";

        this.state = {
            titleRef: "",
            serviceCategoryIdRef: "",

            level2Arr: "",
            level2ValueId: "",
            level3Arr: "",
            "level3ValueId": "",

            serviceId: "",
            accountName: "",
            updatedAt: "",
            createdAt: "",

            serviceName: "",
            description: "",

            rateTypeArr: [],
            rateTypeValue: "",

            servicePersonnelArr: [],
            subtotal: 0,
        }
    }

    componentWillMount(){
        this.setState({ titleRef: this.props.params.title });
        this.setState({ serviceCategoryIdRef: this.props.params.serviceCategoryId }); 
    }

    componentDidMount(){
        let scope = this;

        xhr.get(this.BASE_URL+'/rate-cards/services/create-details', function(data){
            scope.setState({serviceId: data.payload.service_id });
            scope.setState({accountName: data.payload.name });
            scope.setState({updatedAt: data.payload.updated_at});
            scope.setState({createdAt: data.payload.created_at});
        });

         xhr.get(this.BASE_URL+'/rate-cards/rate-types', function(data){
            scope.setState({ rateTypeArr: data.payload });
            console.log(data.payload);
        });

        xhr.get(this.BASE_URL+'/rate-cards/service-categories/sub-categories/level-2?parent_id=' + this.state.serviceCategoryIdRef, function(data){
            scope.setState({ level2Arr: data.payload });

            // Check Level3 index 0
            if(scope.state.level2Arr.length !== 0){
                let level3IndexZeroId = scope.state.level2Arr[0].id;
                if(level3IndexZeroId !== undefined){
                    if(!isNaN(level3IndexZeroId)){
                        xhr.get(scope.BASE_URL+'/rate-cards/service-categories/sub-categories/level-3?parent_id=' + level3IndexZeroId, function(data){
                            scope.setState({ level3Arr: data.payload });
                        });
                    }
                }
            }
        });
    }

    callbackDisabledInput(newValue){
        this.setState({ serviceId: newValue });
    }

    onServiceNameChange(evt){
        this.setState({ serviceName: evt.target.value })
    }

    onDescriptionChange(evt){
        this.setState({ description: evt.target.value })
    }

    onRateTypeChange(evt){
        this.setState({ rateTypeValue: evt.target.value });
    }

    onLevel2Change(evt){
        let scope = this;
        this.setState({level2ValueId: evt.target.value});
        xhr.get(this.BASE_URL+'/rate-cards/service-categories/sub-categories/level-3?parent_id=' + evt.target.value, function(data){
            scope.setState({ level3Arr: data.payload });
        })
    }

    onLevel3Change(evt){
        this.setState({ level3ValueId: evt.target.value });
    }

    onAddPersonnel(evt){
        console.log('ADD PERSON', this._child.getValue() );

        let tempObj = this._child.getValue();
        let subtotal = 0;
        let scope = this;
        let hasCopy = false;

        if(this.state.servicePersonnelArr.length !==0 ){

            this.state.servicePersonnelArr.map(function(data){
                // compute
                subtotal += data.total;

                // check id
                if(data.personnelId === tempObj.personnelId ){
                    hasCopy = true;
                } 

                if(hasCopy){
                    if(confirm('Cannot add the same position.')){
                        return false;
                    }
                    return false;
                } else {
                    scope.state.servicePersonnelArr.push(tempObj);
                    scope.setState({ servicePersonnelArr: scope.state.servicePersonnelArr });
                }
            }); 
                
        } else {
            this.state.servicePersonnelArr.push(tempObj);
            this.setState({ servicePersonnelArr: this.state.servicePersonnelArr });
            subtotal += this.state.servicePersonnelArr[0].total;
        }

        this.setState({ subtotal: subtotal });
    }

    callbackDeleteSelf(id){
        let scope = this;
        this.state.servicePersonnelArr.map(function(data, idx){
            if(data.personnelId === id){
                scope.state.servicePersonnelArr.splice(idx, 1);
                scope.setState({ servicePersonnelArr: scope.state.servicePersonnelArr });
            }
        });
    }

    render(){
        let scope = this;
        let level2SelectOptions = null;
        let level3SelectOptions = null;
        let personnelList = null;

        if(this.state.level2Arr.length!==0){
            level2SelectOptions = 
            <div className="form-group">
                <label>Service Sub Category </label>
                <select className="form-control" value={this.state.level2ValueId} onChange={this.onLevel2Change.bind(this)}>
                { this.state.level2Arr.map(function(data){
                    return (
                        <option key={data.id} value={data.id}>{data.name}</option>
                    )
                } ) }
                </select>
            </div>
        }

        if(this.state.level3Arr.length!==0){
            level3SelectOptions = 
            <div className="form-group">
                <label>Inner Service Sub Category </label>
                <select className="form-control" value={this.state.level3ValueId} onChange={this.onLevel3Change.bind(this)}>
                { this.state.level3Arr.map(function(data){
                    return (
                        <option key={data.id} value={data.id}>{data.name}</option>
                    )
                } ) }
                </select>
            </div>
        }

        if(this.state.servicePersonnelArr.length!==0){
            personnelList = 
            this.state.servicePersonnelArr.map(function(data, index){
                // console.log('data>>', data);
                return ( <ServicePersonnel 
                            personnelId={data.personnelId} 
                            onDeleteSelf={scope.callbackDeleteSelf.bind(scope)} 
                            isEnable={false} 
                            position={data.position} 
                            manhour={data.manhour} 
                            key={index} /> )
            } )
        }

        return ( 
            <div>
                <h3 className="sky">Manage Services: <small>{this.state.titleRef}</small></h3>
                
                <br />

                <Link to="/services/manage">Return to full list</Link>

                <br />

                {/* LEFT SIDE */}
                <div className="col-xs-6">
                    <div className="form-group">
                        <label>Service ID</label>
                        <input className="form-control" type="text" value={this.state.serviceId} disabled />
                    </div>

                    <div className="form-group">
                        <label>Service Name</label>
                        <input type="text" className="form-control" value={this.state.serviceName} onChange={this.onServiceNameChange.bind(this)} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows="5"  value={this.state.description} onChange={this.onDescriptionChange.bind(this)}  ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Service Category</label>
                        <input type="text" className="form-control" value={ this.state.titleRef } disabled />
                    </div>

                    {level2SelectOptions}

                    {level3SelectOptions}

                    <div className="form-group">
                        <label>Rate Type</label>
                        <select className="form-control" onChange={this.onRateTypeChange.bind(this)}>
                        { this.state.rateTypeArr.map(function(data){
                            return (
                                <option key={data.id} value={data.id}>{data.name}</option>
                            )
                        } ) }
                        </select>
                    </div>






                    {/*S E R V I C E  P E R S O N N E L*/}

                    <ServicePersonnel 
                        isEnable={true} 
                        personnelId={""} 
                        position={""} 
                        manhour={0} 
                        ref={(child) => { this._child = child; }} />

                    <p className="personnel-btn-wrapper">
                        <button type="button" className="btn btn-default" onClick={this.onAddPersonnel.bind(this)}>Add More Personnel</button>
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-xs-6">
                    <div className="form-group">
                        <label>Create By</label>
                        <input type="text" className="form-control" value={this.state.accountName} disabled/>
                    </div>

                    <div className="form-group">
                        <label>Date Created</label>
                        <input type="text" className="form-control" value={this.state.createdAt} disabled/>
                    </div>

                    <div className="form-group">
                        <label>Last Updated</label>
                        <input type="text" className="form-control" value={this.state.updatedAt} disabled/>
                    </div>

                    <div className="status text-right">
                        <label><input type="radio" name="service_status" />Active</label>
                        <label><input type="radio" name="service_status" />Inactive</label>
                    </div>

                    <br className="clearfix"/>

                    <p className="text-right">
                        <strong>Subtotal:</strong>&nbsp;<span>{this.state.subtotal}</span>
                    </p>
                </div>

                <p className="text-right">
                    <button type="button" className="btn btn-success">Save</button>
                </p>

                <br className="clearfix" />
                <br />

                <p>-----------------------------------------------</p>
                
                <div className="col-xs-6">
                    {personnelList}
                </div>
                <div className="col-xs-6"></div>

                <br className="clearfix"/>
            </div>
        )
    }
}


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
