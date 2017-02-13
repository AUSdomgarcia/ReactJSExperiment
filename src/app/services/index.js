import React, {Component} from 'react';
import {Link} from 'react-router';

import './services.scss';

import {InputHelper} from '../../common/helpers/inputhelpers';

import {ServicePersonnel} from '../../common/_services/servicePersonnel';

import {
    getServices,
    getServiceByCategoryId,
    getServiceCreateDetails,
    getServiceRateTypes,

    getServiceCategories_subCategories_level2_byParentId,
    getServiceCategories_subCategories_level3_byParentId,

    postServiceCreate

 } from '../../common/http';


export class Services extends Component {

    constructor(props){
        super(props);
        this.state = {
            categoriesArr: []
        };
    }

    componentDidMount(){
        let scope = this;
        getServices().then(function(response){
            scope.setState({ categoriesArr: response.data.payload })
        });
    }

    onDelete(){}

    render(){
        let categories = null;
        let scope = this;

        if(this.state.categoriesArr !== null){
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
        // not yet in use
        getServiceByCategoryId(this.props.params.serviceCategoryId).then(function(data){
            console.log(data);
        });
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
                            to={'/services/add/' 
                            + this.state.serviceCategoryIdRef + '/' 
                            + this.state.titleRef + '/'
                            + true }>EditSimulate</Link>
                        &nbsp;
                        <Link 
                            className="btn btn-primary" 
                            to={'/services/add/' 
                            + this.state.serviceCategoryIdRef + '/' 
                            + this.state.titleRef + '/'
                            + false }>Add Service</Link>
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































{/*----------------------------------->>> Y O U R  W O R K I N G  H E R E <<<---------------------------------------------*/}

export class ServiceAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            titleRef: "",
            serviceCategoryIdRef: "",

            level2Arr: "",
            level2ValueId: null,
            
            level3Arr: "",
            level3ValueId: null,

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

            personnelComp_previous_myId: 0,
            personnelComp_previous_personnel_id: "",
            personnelComp_previous_position: "",
            personnelComp_previous_manhour: 0,

            activeStatus: 0,

            editMode: false,
        }
    }

    componentWillMount(){
        this.setState({ titleRef: this.props.params.title });
        this.setState({ serviceCategoryIdRef: this.props.params.serviceCategoryId }); 
        this.setState({ editMode: this.props.params.editmode });
    }

    componentDidMount(){
        let scope = this;

        if(this.props.params.editmode===true){
            // If edit mode load data when edit
        }


        if(this.props.params.editmode===false){
            // Get Details when Created From Server
            getServiceCreateDetails().then(function(response){
                scope.setState({serviceId: response.data.payload.service_id });
                scope.setState({accountName: response.data.payload.name });
                scope.setState({updatedAt: response.data.payload.updated_at});
                scope.setState({createdAt: response.data.payload.created_at});
            })
            // Get RateTypes
            getServiceRateTypes().then(function(response){
                scope.setState({ rateTypeArr: response.data.payload });
                scope.setState({ rateTypeValue: response.data.payload[0].id })
            });
            // Get Level2
            getServiceCategories_subCategories_level2_byParentId(this.state.serviceCategoryIdRef)
            .then(function(response){
                if(response.data.payload.length===0){
                    scope.setState({ level2ValueId: null });
                    return;
                }

                scope.setState({ level2Arr: response.data.payload });
                scope.setState({ level2ValueId: response.data.payload[0].id});

                if(scope.state.level2Arr.length !== 0){
                    let level3IndexZeroId = scope.state.level2Arr[0].id;

                    if(level3IndexZeroId !== undefined){
                        // Get Level3
                        if(!isNaN(level3IndexZeroId)){
                            getServiceCategories_subCategories_level3_byParentId(level3IndexZeroId)
                            .then(function(response){
                                scope.setState({ level3Arr: response.data.payload });
                                scope.setState({ level3ValueId: response.data.payload[0].id});
                            });
                        }
                    }
                }
            });
        }
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

        getServiceCategories_subCategories_level3_byParentId(evt.target.value)
        .then(function(response){
            if(response.data.payload.length!==0){
                scope.setState({ level3Arr: response.data.payload });
            } else {
                scope.setState({ level3ValueId: null })
            }
        });
    }

    onLevel3Change(evt){
        this.setState({ level3ValueId: evt.target.value });
    }

    onAddPersonnel(evt){
        // Get data from ServicePersonnel Component        
        this.setState( { personnelComp_previous_myId : this._child.getValue().myId || 0 });
        this.setState( { personnelComp_previous_personnel_id : this._child.getValue().personnelId || "" });
        this.setState( { personnelComp_previous_position : this._child.getValue().position || "" });
        this.setState( { personnelComp_previous_manhour : this._child.getValue().manhour || 0 });

        let tempObj = this._child.getValue();
        let subtotal = 0;
        let scope = this;
        let hasCopy = false;

        if(this.state.servicePersonnelArr.length ===0 ){
            this.state.servicePersonnelArr.push(tempObj);
            this.setState({ servicePersonnelArr: this.state.servicePersonnelArr });
            this.calculateSubtotal();
            console.log('ADDED PERSON!!!!:', scope.state.servicePersonnelArr);
            return;
        }

        // Mapping
        this.state.servicePersonnelArr.map(function(data){
            // check id
            if(data.personnelId === tempObj.personnelId ){
                hasCopy = true;
            }
        });

        if(hasCopy===false){
            scope.state.servicePersonnelArr.push(tempObj);
            scope.setState({ servicePersonnelArr: scope.state.servicePersonnelArr });
            console.log('ADDED PERSON!!!!:', scope.state.servicePersonnelArr);
        }

        this.calculateSubtotal();

        if(hasCopy===true){
            if(confirm('Cannot add with the same position.')){
                return;
            } else {
                return;
            }
        }
    }

    calculateSubtotal(){
        let subtotal = 0;
        this.state.servicePersonnelArr.map(function(data){
            subtotal += data.total;
        });
        this.setState({ subtotal: subtotal });
        console.log('Personnel_', this.state.servicePersonnelArr);
    }

    callbackDeleteSelf(id){
        let scope = this;
        for(var i=0; i < this.state.servicePersonnelArr.length; i++){
            if(scope.state.servicePersonnelArr[i].personnelId.toString() === id.toString()){
                scope.state.servicePersonnelArr.splice(i, 1);
            }
        }
        this.setState({ servicePersonnelArr: this.state.servicePersonnelArr });
        this.calculateSubtotal();
    }

    onActiveStatusFalse(evt){
        this.setState({ activeStatus: 0 });
    }

    onActiveStatusTrue(evt){
        this.setState({ activeStatus: 1 });
    }

    onSaveService(){
        // Will create new Service
        if(this.state.serviceName.length===0 || this.state.description.length===0 || this.state.servicePersonnelArr.length ===0){
            if(confirm('No Service Name or Description or Selected Personnel')){
                return;
            } else {
                return;
            }
        }

        let personnelFormat = [];
        this.state.servicePersonnelArr.map(function(data){
            let tempObj = {};
                tempObj.id = data.myId;
                tempObj.manhours = Math.floor(data.manhour);
            personnelFormat.push(tempObj);
        });

        console.log('========== POST START====================')
        console.log('Service Name:', this.state.serviceName );
        console.log('Description:', this.state.description );
        console.log('Category_ID:', this.state.serviceCategoryIdRef );
        console.log('Level_2:', this.state.level2ValueId );
        console.log('Level_3:', this.state.level3ValueId );
        console.log('RateType_ID:', this.state.rateTypeValue );
        console.log('Personnels:', personnelFormat)
        console.log('Subtotal:', this.state.subtotal );
        console.log('Created_Time:', this.state.createdAt);
        console.log('========== POST END ========================')

        // Edit False
        if(this.props.params.editmode===false){
            postServiceCreate({
                name: this.state.serviceName,
                description: this.state.description,
                service_category_id: this.state.serviceCategoryIdRef,
                service_sub_category_id: this.state.level2ValueId || null,
                sub_service_sub_category_id: this.state.level3ValueId || null,
                rate_type_id: this.state.rateTypeValue,
                is_active: this.state.activeStatus,
                personnels: [{ id: 1, personnel_id: 1, manhours: 100 }],  // <----- Mock Personnels
                subtotal: this.state.subtotal,
                created_at: '2017-02-09 11:14:00' // <------ Mock time ,     this.state.createdAt,
            }).then(function(response){
                console.log(response);
            });
        }

        // Edit True
        if(this.props.params.editmode===true){
            //
        }
    }

    render(){
        let scope = this;
        let level2SelectOptions = null;
        let level3SelectOptions = null;
        let personnelList = null;
        let defaultStatus = null;
        let arrlengthStatus = null;

        if(this.state.level2Arr.length!==0 && this.state.level2ValueId !== null){
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

        if(this.state.level3Arr.length!==0 && this.state.level3ValueId !== null){
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
            defaultStatus = <span></span>
            arrlengthStatus = <span className="btn-warning">({ this.state.servicePersonnelArr.length })</span>
            
            personnelList = 
            this.state.servicePersonnelArr.map(function(data, index){
                // console.log('data>>', data);
                return ( <ServicePersonnel 
                            personnelId={data.personnelId} 
                            onDeleteSelf={scope.callbackDeleteSelf.bind(scope)} 
                            isEnable={false} 
                            myId={data.myId}
                            position={data.position} 
                            manhour={data.manhour} 
                            key={data.personnelId} /> )
            } );

        } else {
            defaultStatus = <strong className="btn-danger">No added personnels.</strong>
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
                        <select className="form-control" value={this.state.rateTypeValue} onChange={this.onRateTypeChange.bind(this)}>
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
                        myId={this.state.personnelComp_previous_myId}
                        personnelId={ this.state.personnelComp_previous_personnel_id} 
                        position={ this.state.personnelComp_previous_position} 
                        manhour={ this.state.personnelComp_previous_manhour} 
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
                        <label><input type="radio" 
                        value={this.state.activeStatus} 
                        checked={this.state.activeStatus === 1}
                        onChange={this.onActiveStatusTrue.bind(this)}

                        name="service_status" />Active
                        </label>

                        <label><input type="radio"
                        value={this.state.activeStatus} 
                        checked={this.state.activeStatus === 0}
                        onChange={this.onActiveStatusFalse.bind(this)}
                        
                        name="service_status" />Inactive
                        </label>
                    </div>
                    
                    <br />

                    <p className="form-control text-left">
                        <strong>Subtotal:</strong>&nbsp;<span>{this.state.subtotal}</span>
                    </p>
                    
                    <br />

                    <p className="text-right">
                        <button type="button" className="btn btn-success" onClick={this.onSaveService.bind(this)}>Save Service</button>
                    </p>

                    <br className="clearfix"/>

                    <h3>Added Personnel(s) {arrlengthStatus}</h3>
                    {defaultStatus}
                    {personnelList}
                    
                </div>
            
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
