import React, {Component} from 'react';
import {Link} from 'react-router';

import './services.scss';

import {InputHelper} from '../../common/helpers/inputhelpers';

import {ServicePersonnel} from '../../common/_services/servicePersonnel';
import { Logs } from '../../common/_services/logs';

import xhr from 'jquery';

import {
    getServices,
    getServiceByCategoryId,
    getServiceCreateDetails,
    getServiceRateTypes,

    getServiceCategories_subCategories_level2_byParentId,
    getServiceCategories_subCategories_level3_byParentId,

    postServiceCreate,
    postServiceUpdate,
    postServiceDelete,

    postServiceCategoriesDelete,

    getServiceByServiceIdWithServiceCategoryId

 } from '../../common/http';


export class Services extends Component {

    constructor(props){
        super(props);
        this.state = {
            categoriesArr: []
        };
    }

    componentWillMount(){
        let scope = this;
        getServices().then(function(response){
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                scope.setState({ categoriesArr: response.data.payload })    
            }
        });
    }
    
    componentDidMount(){ 
        //
    }

    onDelete(evt){
        let id = xhr(evt.target)[0].dataset.storeid;
        let scope = this;

        if(id===undefined) return;

        if(confirm('Do you want to delete?')){
            //
        } else {
            return;
        }

        this.state.categoriesArr.map(function(data, idx){
            if(data.id.toString() === id.toString() ){
                scope.state.categoriesArr.splice(idx, 1);
            }
        });
        this.setState({categoriesArr: this.state.categoriesArr });

        postServiceCategoriesDelete({id: id}).then(function(response){
            console.log('deleted', response);
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                scope.setState({ categoriesArr: response.data.payload });    
            }
        });
    }

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
                <p><Link to="/services/all">View All</Link></p>

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

        // not yet in use
        let scope = this;

        getServiceByCategoryId(this.props.params.serviceCategoryId).then(function(response){
            console.log('manage_service', JSON.stringify(response));
            scope.setState({ serviceArr: response.data.payload })
        });

    }

    componentDidMount(){
        //        
    }

    onEdit(){
        this.context.router.push('/services/edit');
    }

    onDelete(evt){
        let scope = this;
        let id = xhr(evt.target)[0].dataset.serviceid;
        
        console.log('id', id);

        if(id === undefined ) return;

        this.state.serviceArr.map(function(data, idx){
            if(data.id.toString() === id.toString()){
                scope.state.serviceArr.splice(idx, 1);
            }
        });

        this.setState({ serviceArr: this.state.serviceArr });

        postServiceDelete({id: id}).then(function(response){
            console.log('onDelete Service', response);
        });
    }

    render(){
        let scope = this;
        let services = <tr><td colSpan={5}>No Data.</td></tr>;

        if(this.state.serviceArr.length!==0){
            services = 
            this.state.serviceArr.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{ data.name }</td>
                        <td>{ data.rate_type.name }</td>
                        <td>{ data.subtotal } </td>
                        <td>{ (data.is_active==='1')? 'Active' : 'Inactive' }</td>
                        <td>

                            {/*<button type="button" className="btn btn-default" onClick={scope.onEdit.bind(scope)}>Edit</button>*/}

                            <Link 
                                className="btn btn-primary" 
                                to={'/services/edit/' 
                                + scope.state.serviceCategoryIdRef + '/' 
                                + scope.state.titleRef + '/'
                                + 1 + '/'
                                + data.id }>Edit
                            </Link>

                            &nbsp;
                            <button type="button" className="btn btn-danger" data-serviceid={data.id} onClick={scope.onDelete.bind(scope)}><i className="fa fa-times"></i></button>

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

                        {/*<Link 
                            className="btn btn-primary" 
                            to={'/services/edit/' 
                            + this.state.serviceCategoryIdRef + '/' 
                            + this.state.titleRef + '/'
                            + 1 + '/'
                            + 'service_id' }>EditSimulate</Link>
                        &nbsp;*/}

                        <Link 
                            className="btn btn-primary" 
                            to={'/services/add/' 
                            + this.state.serviceCategoryIdRef + '/' 
                            + this.state.titleRef + '/'
                            + 0 }>Add Service</Link>
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

import {getServicePersonnelsByRateTypeId, getServiceCategoriesRoot} from '../../common/http';
export class ServiceAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            titleRef: "",
            serviceCategoryIdRef: "",

            level1Arr: "",
            level1ValueId: "default",
            
            level2Arr: "",
            level2ValueId: "default",
            
            level3Arr: "",
            level3ValueId: "default",

            serviceId: "",
            accountName: "",
            updatedAt: "",
            createdAt: "",

            serviceName: "",
            description: "",

            rateTypeArr: [],
            rateTypeValue: "",

            servicePersonnelArr: [],
            personnels_data: [],
            subtotal: 0,

            personnelComp_previous_myId: 0,
            personnelComp_previous_personnel_id: "",
            personnelComp_previous_position: "",
            personnelComp_previous_manhour: 0,

            activeStatus: 0,
            
            is_rate_type_changed: false,
        }
    }

    // componentWillMount(){
    //     this.setState({ titleRef: this.props.params.title });
    //     this.setState({ serviceCategoryIdRef: this.props.params.serviceCategoryId }); 
    // }

    componentWillMount(){
        this.setState({ titleRef: this.props.params.title });
        this.setState({ serviceCategoryIdRef: this.props.params.serviceCategoryId }); 
        
        window.sessionStorage.setItem('serviceCategoryIdRef', this.props.params.serviceCategoryId)


        console.log('EDIT_MODE', this.props.params.editmode, '1=true, 0=false');
        let scope = this;

        let serviceCategoryId = this.props.params.serviceCategoryId;
        // serviceId
        let paramsServiceId = this.props.params.serviceid;

        /////////////////////////////////
        // EDIT MODE
        /////////////////////////////////
        if(this.props.params.editmode==='1'){
            // If edit mode load data when edit
            console.log( serviceCategoryId, paramsServiceId );

            getServiceByServiceIdWithServiceCategoryId(serviceCategoryId, paramsServiceId ).then(function(response){
                
                console.log('EditModeResponse', response);

                let res = response.data.payload[0];

                if(response.data.hasOwnProperty('payload')===false) return;
                if(response.data.payload.ength===0) return;

                // INPUT FIELDS 
                scope.setState({serviceName: res.name});
                scope.setState({description: res.description});
                scope.setState({updatedAt: res.updated_at});
                scope.setState({createdAt: res.created_at});
                scope.setState({accountName: res.user.name});
                scope.setState({serviceId: res.service_id});

                // SET RATETYPE OPTION
                let id = res.rate_type.id;
                getServiceRateTypes().then(function(response){
                    scope.setState({ rateTypeArr: response.data.payload });
                    scope.setState({ rateTypeValue: id });
                }); 

                // SET PERSONNEL OPTION INSIDE COMPONENT
                getServicePersonnelsByRateTypeId(id).then(function(response){
                    if(response.data.payload.length!==0){
                        scope.setState({personnels_data: response.data.payload});
                    }
                });

                // SET Subtotal
                let subtotal = res.subtotal;
                scope.setState({subtotal: +subtotal});

                // SET PERSONNELS
                let personnel_users = res.personnel_users;
                scope.setState({servicePersonnelArr: personnel_users});

                // Active state
                let status = res.is_active;
                scope.setState({activeStatus: +status});      
            });


            

        /////////////////////////////////
        // NORMAL MODE
        /////////////////////////////////
        } else if(this.props.params.editmode==='0'){
            // Get Details when Created From Server
            getServiceCreateDetails().then(function(response){
                console.log('getCreateDetails', response);
                scope.setState({serviceId: response.data.payload.service_id });
                scope.setState({accountName: response.data.payload.name });
                scope.setState({updatedAt: response.data.payload.updated_at});
                scope.setState({createdAt: response.data.payload.created_at});
            });

            getServiceRateTypes().then(function(response){
                let id = response.data.payload[0].id;
                scope.setState({ rateTypeArr: response.data.payload });
                scope.setState({ rateTypeValue: id });

                getServicePersonnelsByRateTypeId(id).then(function(response){

                    if(response.data.payload.length!==0){
                        scope.setState({personnels_data: response.data.payload});
                    }
                });
            }); 

            // Get Level 1
            // ....
            
            if(window.sessionStorage.getItem('serviceCategoryIdRef')!=='undefined') {
                // Get Level2
                scope.getLevel2AndLevel3ById(scope.state.serviceCategoryIdRef);

            } else {
                // initiate level 1
                getServiceCategoriesRoot().then(function(response){
                    if(response.data.hasOwnProperty('payload')===false) return;

                    if(response.data.payload.length!==0){
                        let res = response.data.payload[0];

                        scope.setState({level1Arr: response.data.payload});

                        scope.setState({ serviceCategoryIdRef: res.id }, function(){

                            scope.getLevel2AndLevel3ById(scope.state.serviceCategoryIdRef);
                            
                            scope.setState({ level1ValueId: res.id });

                        });
                    }
                });
            }
        


        } else if(this.props.params.editmode==='2'){
            console.log('nothing to happen getting from session');
        }  
    }

    getLevel2AndLevel3ById(id){
        let scope = this;

        getServiceCategories_subCategories_level2_byParentId(id)
        .then(function(response){
            if(response.data.hasOwnProperty('payload')===false) return;
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
                            if(response.data.hasOwnProperty('payload')===false) return;
                            if(response.data.payload.length===0) return;
                            scope.setState({ level3Arr: response.data.payload });
                            scope.setState({ level3ValueId: response.data.payload[0].id});
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
        if(evt.target.value === null || evt.target.value === undefined ) return;
        let id = evt.target.value;
        let scope = this;

        if(this.props.params.editmode==='1') {
            this.setState({is_rate_type_changed: true},
            function(){
                console.log('is_rate_type_changed:', this.state.is_rate_type_changed );
            });
        }
        
        this.setState({ rateTypeValue: id });

        getServicePersonnelsByRateTypeId(id).then(function(response){
            scope.setState({ personnels_data: response.data.payload });
        });
        
        let empty = [];
        this.setState({servicePersonnelArr: empty}, function(){
            console.log('------------------- stub');
            scope.calculateSubtotal();
        });
    }

    onLevel1Change(evt){
        let scope = this;
        this.setState({level1ValueId: evt.target.value});
        this.setState({serviceCategoryIdRef: evt.target.value});
        
        let id = evt.target.value;
        scope.getLevel2AndLevel3ById(id);
    }

    onLevel2Change(evt){
        let scope = this;
        this.setState({level2ValueId: evt.target.value});

        getServiceCategories_subCategories_level3_byParentId(evt.target.value)
        .then(function(response){
            if(response.data.hasOwnProperty('payload')===false) return;
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
        if(this._child.getIsReady() === false) return;

        // Get data from ServicePersonnel Component        
        this.setState( { personnelComp_previous_myId         : this._child.getValue().id || 0 });
        this.setState( { personnelComp_previous_personnel_id : this._child.getValue().personnel_id || "" });
        this.setState( { personnelComp_previous_position     : this._child.getValue().position.name || "" });
        this.setState( { personnelComp_previous_manhour      : this._child.getValue().manhours || 0 });

        console.log( this._child.getValue().id );
        console.log( this._child.getValue().personnel_id );
        console.log( this._child.getValue().position.name );
        console.log( this._child.getValue().manhours );

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
            if(data.personnel_id === tempObj.personnel_id ){
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
            subtotal += data.subtotal || 0;
        });

        console.log('hest', subtotal);

        this.setState({ subtotal: subtotal });
        console.log('Personnel_', this.state.servicePersonnelArr);
    }

    calbackDelete(id){
        let scope = this;
        for(var i=0; i < this.state.servicePersonnelArr.length; i++){
            if(scope.state.servicePersonnelArr[i].personnel_id.toString() === id.toString()){
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

        let scope = this;
        let personnelFormat = [];

        this.state.servicePersonnelArr.map(function(data){
            let tempObj = {};
                tempObj.id = data.id;
                tempObj.personnel_id = data.personnel_id;
                tempObj.manhours = +data.manhours;
            personnelFormat.push(tempObj);
        });

        let PersonnelJSON = JSON.stringify(personnelFormat);

        console.log('========== POST START====================')
        console.log('Service Name:', this.state.serviceName );
        console.log('Description:', this.state.description );
        console.log('Category_ID:', this.state.serviceCategoryIdRef );
        console.log('Level_2:', this.state.level2ValueId );
        console.log('Level_3:', this.state.level3ValueId );
        console.log('RateType_ID:', this.state.rateTypeValue );
        console.log('Personnels:', JSON.stringify( PersonnelJSON )); // Not use 
        console.log('Subtotal:', this.state.subtotal );
        console.log('Created_Time:', this.state.createdAt); // Not use 
        console.log('========== POST END ========================');

        // Edit False
        if(this.props.params.editmode==='0'){
            postServiceCreate({
                name: this.state.serviceName,
                description: this.state.description,
                service_category_id: this.state.serviceCategoryIdRef,
                service_sub_category_id: (this.state.level2ValueId==="default" ? null : this.state.level2ValueId) ,
                sub_service_sub_category_id: (this.state.level3ValueId==="default" ? null : this.state.level3ValueId ),
                rate_type_id: this.state.rateTypeValue,
                is_active: this.state.activeStatus,
                personnels: PersonnelJSON, // JSON.stringify( [{ "id": 1, "personnel_id": 1, "manhours": 100 }] ),  // <----- Mock Personnels
                subtotal: this.state.subtotal,
                created_at: this.state.createdAt, // '2017-02-09 11:14:00' // <------ Mock time ,     this.state.createdAt,
            }).then(function(response){
                console.log('onCreate', response);
                scope.context.router.push('/services');

            })
            .catch(function(response){
                if(response.data.error)
                alert(JSON.stringify(response.data.message))
            })
        }

        // Edit True 
        if(this.props.params.editmode==='1'){

            console.log('Saving Update Edit Mode', this.state.is_rate_type_changed);

            postServiceUpdate({
                is_rate_type_changed: this.state.is_rate_type_changed,
                id: +this.state.serviceId,
                name: this.state.serviceName,
                description: this.state.description,
                service_category_id: this.state.serviceCategoryIdRef,
                service_sub_category_id: (this.state.level2ValueId==="default" ? null : this.state.level2ValueId) ,
                sub_service_sub_category_id: (this.state.level3ValueId==="default" ? null : this.state.level3ValueId ),
                rate_type_id: this.state.rateTypeValue,
                is_active: this.state.activeStatus,
                personnels: PersonnelJSON,
                subtotal: this.state.subtotal,
                created_at: this.state.createdAt,
            }).then(function(response){
                // scope.context.router.push('/services');
                console.log('onUpdate', response);
                alert('Save successfully!');
            })
            .catch(function(response){
                if(response.data.error)
                alert(JSON.stringify(response.data.message))
            })
        }
    }

    displayAlert(isShow){   
        let markup = <div></div>;

        if(isShow){
            markup = 
            <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign"></span> 
                <span className="sr-only">Error:</span> Enter a valid email address 
            </div>
        }

        return markup;
    }

    serviceLogs(){
        let markup = <div></div>
        if(this.props.params.editmode==='1'){
            markup = (<Logs serviceid={this.props.params.serviceid}/>)
        }
        return markup;
    }

    

    render(){
        let scope = this;
        let level2SelectOptions = null;
        let level3SelectOptions = null;
        let personnelList = null;
        let defaultStatus = null;
        let personnelsArrNotice = null;
        let sameRateType = <span></span>

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

        // READING PERSONNELS
        if(this.state.servicePersonnelArr.length!==0){
            defaultStatus = <span></span>
            
            personnelsArrNotice = 
            <span 
                className="btn-warning">({ this.state.servicePersonnelArr.length })
            </span>
            
            personnelList = 
            this.state.servicePersonnelArr.map(function(data, index){
                return ( <ServicePersonnel 
                            onDeleteSelf={scope.calbackDelete.bind(scope)} 
                            isEnable={false} 
                            
                            personnel_id={data.personnel_id} 
                            id={data.id}
                            position={data.position} 
                            manhours={data.manhours} 
                            key={data.personnel_id} /> )
            } );

        } else {
            defaultStatus = <strong className="btn-danger">No added personnels.</strong>
        }

        let level1Selection = <select><option>Loading..</option></select>

        if(this.state.level1Arr.length!==0){
            level1Selection = 
            <select 
                className="form-control"
                onChange={scope.onLevel1Change.bind(scope)} 
                value={scope.state.level1ValueId}>
                
                {this.state.level1Arr.map(function(data){
                    return (
                     <option key={data.id} value={data.id}>{data.name}</option>
                    )
                })}
            </select>
        
        } else {
            level1Selection =
            <input type="text" className="form-control" value={ this.state.titleRef } disabled />
        }

        return ( 
            <div>
                <h3 className="sky">Manage Services: <small>{this.state.titleRef}</small></h3>
                
                <br />

                {this.displayAlert()}

                <br />

                <Link to="/services">Return to full list</Link>

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
                        {level1Selection}
                    </div>

                    {level2SelectOptions}

                    {level3SelectOptions}

                    <div className="form-group">
                        {sameRateType}
                        <label>Rate Type</label>
                        <select className="form-control" 
                            value={this.state.rateTypeValue} 
                            onChange={this.onRateTypeChange.bind(this)}>
                            { this.state.rateTypeArr.map(function(data){
                                return (
                                    <option key={data.id} value={data.id}>{data.name}</option>
                                )
                            } ) }
                        </select>
                    </div>

                    {/* PERSONNELS INPUT SOURCES */}
                    <ServicePersonnel 
                        isEnable={true} 
                        personnelsOption={this.state.personnels_data}

                        personnel_id={ this.state.personnelComp_previous_personnel_id} 

                        id={this.state.personnelComp_previous_myId}
                        
                        position={ this.state.personnelComp_previous_position} 

                        manhours={ this.state.personnelComp_previous_manhour} 

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

                    <h3>Added Personnel(s) {personnelsArrNotice}</h3>
                    {defaultStatus}
                    {personnelList}
                    
                </div>

                <br />
            
                { this.serviceLogs() }

            <br className="clearfix"/>
            </div>
        )
    }
}

ServiceAdd.contextTypes = {
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
































import {getRateCardServicesAll, getServicesById} from '../../common/http';

export class ServiceAll extends Component {

    constructor(props){
        super(props);
        this.state = {
            services: []
        }
    }
    
    componentWillMount(){
        let scope = this;
        getRateCardServicesAll().then(function(response){
            if(response.data.hasOwnProperty('payload')){
                if(response.data.payload.length!==0){
                    console.log('service all', JSON.stringify(response));
                    scope.setState({services: response.data.payload})
                }
            }
        })
    }
    
    componentDidMount(){
        // 
    }

    addSevice(){
        this.context.router.push('/services/new/0');
    }

    extractAll(){
        // 
    }

    onEdit(evt){
        let id = xhr(evt.target)[0].dataset.storeid;
        let scope = this;

        if(id===undefined || id===null ) return;

        getServicesById(id).then(function(response){
            console.log('work around', response);

            if(response.data.hasOwnProperty('payload')){
                if(response.data.payload.length!==0){
                    let res = response.data.payload[0];
                    let service_category_id = res.service_category_id;
                    let title = res.name;
                    let id = res.id;
                    
                    // parang yung dati but this time gagamit ako ng sessionStorage
                    scope.context.router.push('/services/edit/'+service_category_id+'/'+title+'/'+ 1 +'/'+id);

                    window.sessionStorage.setItem('service_created_at', res.created_at);
                    window.sessionStorage.setItem('service_updated_at', res.updated_at);
                    window.sessionStorage.setItem('service_created_by', res.user.name);
                    window.sessionStorage.setItem('service_name', res.name);
                    window.sessionStorage.setItem('service_description', res.description);
                    window.sessionStorage.setItem('service_is_active', res.is_active);
                    window.sessionStorage.setItem('service_rate_type', res.rate_type.id);
                    
                    // layer 1
                    window.sessionStorage.setItem('service_category_id', res.service_category_id);
                    
                    // layer 2
                    if(res.service_sub_category_id!==null){
                        // window.sessionStorage.setItem('service_sub_category_id', res.service_sub_category_id);
                    }

                    // layer 3
                    if(res.sub_service_sub_category_id!==null){
                        // window.sessionStorage.setItem('sub_service_sub_category_id', res.sub_service_sub_category_id);
                    }

                    // Personnel users
                    // window.sessionStorage.setItem('personnel_users', JSON.stringify(res.personnel_users));

                }
            }
        });
    }

    onDelete(evt){
        let id = xhr(evt.target)[0].dataset.storeid;
        let scope = this;

        console.log('delete', id );

        if(id===undefined || id===null ) return;

        if(confirm('Do you want to delete?')){
            //
        } else {
            return;
        }
        
        this.state.services.map(function(data, index){
            if(+data.id === +id){
                scope.state.services.splice(index, 1);
                scope.setState({services: scope.state.services});
            }
        });

        // delete
        postServiceDelete({id:id}).then(function(response){
            console.log('after delete', response);
        });
    }

    getRateTypeBy(data){
        let name = "no-data";
        if(data.hasOwnProperty('rate_type')){
            if(data.hasOwnProperty('rate_type')){
                if(data.rate_type.hasOwnProperty('name') ){
                    name = data.rate_type.name;
                }
            }
        }
        return name;
    }

    render(){
        let scope = this;
        let servicesTable = <tr><td colSpan={8}>No data.</td></tr>

        if(this.state.services.length!==0){
            servicesTable = 
            this.state.services.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.service_id}</td>
                        <td>{'inconsistent_category'}</td>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>{'inconsistent_name'}</td>
                        <td>{data.subtotal}</td>
                        <td>{data.is_active}</td>
                        <td>
                            <button type="button" className="btn btn-default" data-storeid={data.id} onClick={scope.onEdit.bind(scope)}>Edit</button>&nbsp;
                            <button type="button" className="btn btn-danger"  data-storeid={data.id} onClick={scope.onDelete.bind(scope)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                )
            });
        }


        return (
            <div>
                <h3 className="sky">Manage Services</h3>

                <div>
                    <div className="col-xs-6">
                        <Link to="/services">Return to Manage Services</Link>   
                    </div>
                    <div className="col-xs-6 text-right">
                        <button type="button" className="btn btn-primary" onClick={this.addSevice.bind(this)}>Add Service</button>&nbsp;
                        <button type="button" className="btn btn-primary" onClick={this.extractAll.bind(this)}>Extract All</button>
                    </div>    
                    <br className="clearfix" />                
                </div>
                
                <p>Total Services: {(this.state.services.length!==0 ? this.state.services.length : 0)}</p>

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
                        {servicesTable}
                    </tbody>                           
                </table>

                    
            <br className="clearfix" />
            </div>
        )
    }
}

ServiceAll.contextTypes = {
  router: React.PropTypes.object.isRequired
};
