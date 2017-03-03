import React, {Component} from 'react';
import {Link} from 'react-router';

import './services.scss';

import {InputHelper} from '../../common/helpers/inputhelpers';

import {ServicePersonnel} from '../../common/_services/servicePersonnel';
import { Logs } from '../../common/_services/logs';

import jquery from 'jquery';

import toastr from 'toastr';

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

    getServiceByServiceIdWithServiceCategoryId,
    getRateCardsServiceByServiceCategoryByServiceCategoryId

 } from '../../common/http';


export class Services extends Component {

    constructor(props){
        super(props);
        this.state = {
            categoriesArr: []
        };
    }

    componentWillMount(){
        window.sessionStorage.clear();

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
        let id = jquery(evt.target)[0].dataset.storeid;
        let scope = this;

        if(id===undefined || id===null) return;

        if(confirm('Are you sure you want to delete this category?')){
            //
        } else {
            return;
        }
        
        console.log(this.state.categoriesArr);

        postServiceCategoriesDelete({id: id})
        .then(function(response){
            console.log('deleted', response);

            // alert('Category deleted.');
            if(response.data.payload.length!==0){
            
                scope.setState({ categoriesArr: response.data.payload }, function(){
                    toastr.success('Category deleted.');
                });    
            }

            scope.state.categoriesArr.map(function(data, idx){
                if(data.id.toString() === id.toString() ){
                    scope.state.categoriesArr.splice(idx, 1);
                }
            });

            scope.setState({categoriesArr: scope.state.categoriesArr });
            
        })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
        });
    }

    render(){
        let categories = <tr><td colSpan={4}>No data.</td></tr>;
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
                                
                                <button type="button" data-storeid={data.id} className="btn btn-danger"  onClick={scope.onDelete.bind(scope)} >&times;</button>
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































import {CategoryController} from '../../common/_services/categoryController';

export class ManageServices extends Component {

    constructor(props){
        super(props);
        this.state = {
            services: [],
            service_category_id: "",
            title: "",
            category_level2: []
        };
    }

    componentWillMount(){
        let id = this.props.params.serviceCategoryId;

        this.setState({ title: this.props.params.title });
        this.setState({ service_category_id: id }); 

        // not yet in use
        let scope = this;

        getServiceByCategoryId(id).then(function(response){
            console.log('manage_service', response);
            scope.setState({ services: response.data.payload })
        });

        // /rate-cards/services/by-service-category?service_category_id=

        getRateCardsServiceByServiceCategoryByServiceCategoryId(id)
        .then(function(response){
            if(response.data.payload.length!==0){
                scope.setState({ category_level2: response.data.payload });
                console.log('hello_world', response.data.payload);
            }
        })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
        });

        // Hold service_category_id to return here after Add or Edit.
        // window.sessionStorage.setItem('service_category_id', id);
    }

    componentDidMount(){
        //
    }

    onDelete(evt){
        let scope = this;
        let id = jquery(evt.target)[0].dataset.serviceid;

        if(id === undefined || id===null) return;

        if(confirm('Are you sure you want to delete this service?')){
            //
        } else {
            return;
        }

         postServiceDelete({id: id}).then(function(response){
            // alert('Service deleted.');
            scope.state.services.map(function(data, idx){
                if(data.id.toString() === id.toString()){
                    scope.state.services.splice(idx, 1);
                }
            });
            scope.setState({ services: scope.state.services }, function(){
                toastr.success('Service deleted.');
            });
       })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
        });
    }

    render(){
        let scope = this;
        let servicesTable = <tr><td colSpan={5}>No Service.</td></tr>;
        let categoryLevel2List = <li>No category level 2.</li>

        if(this.state.services.length!==0){
            servicesTable = 
            this.state.services.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{ data.name }</td>
                        <td>{ data.rate_type.name }</td>
                        <td>{ data.subtotal } </td>
                        <td>{(data.is_active==='1' ? 'Active' : 'Inactive')}</td>
                        <td>
                            <Link 
                                className="btn btn-default" 
                                to={'/services/edit/' 
                                + scope.state.service_category_id + '/' 
                                + scope.state.title + '/'
                                + 1 + '/'
                                + data.id }>Edit
                            </Link>
                            &nbsp;
                            <button 
                                type="button"
                                className="btn btn-danger" 
                                data-serviceid={data.id} 
                                onClick={scope.onDelete.bind(scope)}>&times;</button>
                        </td>
                    </tr>
                )
            });

        } else {
            servicesTable = 
            <tr><td colSpan={5}>No Service.</td></tr>;
        }

        if(this.state.category_level2.length!==0){
            categoryLevel2List =
                this.state.category_level2.map(function(data){
                    return (
                        <CategoryController 
                            key={data.id} 
                            data={data} 
                            service_category_id={scope.state.service_category_id} 
                            title={scope.state.title}/>
                    )
                });
        
        } else {
            categoryLevel2List = null;
        }

        return (
            <div>
                <h3 className="sky">Category Services: <small>{this.state.title}</small></h3>
                
                <div className="header">
                    <div className="col-xs-6 text-left">
                        <div className="row">
                            <Link to="/services">Return to Full List</Link>
                        </div>
                    </div>

                    <div className="col-xs-6 text-right">
                        <Link 
                            className="btn btn-primary" 
                            to={'/services/add/' 
                            + this.state.service_category_id + '/' 
                            + this.state.title + '/'
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
                        {servicesTable}
                    </tbody>                           
                </table>

                <ul>
                   {categoryLevel2List}
                </ul>
            </div>
        )
    }
}

ManageServices.contextTypes = {
  router: React.PropTypes.object.isRequired
};































import {getServicePersonnelsByRateTypeId, getServiceCategoriesRoot} from '../../common/http';
export class ServiceAdd extends Component {

    constructor(props){
        super(props);

        this.state = {
            titleReference: "",
            serviceCategoryIdReference: "",
            isEditmode: '0',

            level1Arr: "",
            level1ValueId: "",
            
            level2Arr: "",
            level2ValueId: "",
            
            level3Arr: "",
            level3ValueId: "",

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
            
            isAddedServiceInsideCategory: false,

            service_category_temp_name: "",
        }
    }

    componentWillMount(){
        let scope = this;
        this.setState({isEditmode: this.props.params.editmode }, function(){
            scope.switchMode();
        });

        window.sessionStorage.setItem('service_category_id', this.props.params.serviceCategoryId);

        console.log('>>>Holding>>>', window.sessionStorage.getItem('service_category_id') );
    }

    switchMode(){
        let scope = this;
        
        let serviceId = this.props.params.serviceid;
        
        let serviceCategoryId = this.props.params.serviceCategoryId;
    
        this.setState({ titleReference: this.props.params.title });
        
        this.setState({ serviceCategoryIdReference: serviceCategoryId },
            function(){
                window.sessionStorage.setItem('serviceCategoryIdReference', serviceCategoryId )
            });


        /////////////////////////////////
        // EDIT MODE
        /////////////////////////////////
        if(this.props.params.editmode==='1'){ console.log('your on editmode')

            getServiceByServiceIdWithServiceCategoryId(
                serviceCategoryId,                  // service_category_id
                serviceId                           // service_id itself
                ).then(function(response){
                    console.log('EDIT-EDIT', response, serviceCategoryId, serviceId);
                    
                    if(response.data.payload.length===0) return; 

                    console.log('EditModeResponse', response);

                    let resZero = response.data.payload[0];
                    let outer_resZero = resZero;

                    // #1 Default Details
                    scope.setState({serviceId: resZero.service_id});
                    scope.setState({serviceName: resZero.name});
                    scope.setState({description: resZero.description});
                    scope.setState({createdAt: resZero.created_at});
                    scope.setState({updatedAt: resZero.updated_at});
                    scope.setState({accountName: resZero.user.name});

                    // #2 Rate Types
                    getServiceRateTypes().then(function(response){
                        let id = outer_resZero.rate_type_id;
                        scope.setState({ rateTypeArr: response.data.payload });
                        scope.setState({ rateTypeValue: id });

                        getServicePersonnelsByRateTypeId(id).then(function(response){
                            if(response.data.payload.length!==0){
                                scope.setState({personnels_data: response.data.payload});
                            }
                        });
                    });

                    // #3 Service Category (Just to call all possible Layer)
                    
                    getServiceCategoriesRoot().then(function(response){
                        if(response.data.payload.length!==0){
                            let resZero = response.data.payload[0];

                            scope.setState({ level1Arr: response.data.payload}, function(){
                                scope.setState({level1ValueId: outer_resZero.service_category_id});
                            });

                            scope.setState({serviceCategoryIdReference: outer_resZero.service_category_id },function(){
                                console.log('Category:', outer_resZero.service_category_id, scope.state.serviceCategoryIdReference, response.data.payload);
                            });
                            
                        } else {
                            scope.setState({level1Arr: []});
                            scope.setState({level1ValueId:""});
                        }
                    });

                    // #4 Subtotal
                    // let subtotal = resZero.subtotal;
                    // scope.setState({subtotal: +subtotal});

                    let subtotal = 0;
                    resZero.personnel_users.map(function(data, idx, arr){
                        subtotal += (+data.manhour_rate * +data.manhours);
                        
                        if(idx === arr.length-1){
                            scope.setState({subtotal: +subtotal});
                        }
                    });


                    // #5 Status
                    let status = resZero.is_active;
                    scope.setState({activeStatus: +status});    
                    
                    // #6 Personnel User
                    let personnel_users = resZero.personnel_users;
                    scope.setState({servicePersonnelArr: personnel_users}); //       <------------ Focus here

                    console.log('service_category_id',resZero.service_category_id);
                    console.log('service_sub_category_id',resZero.service_sub_category_id);
                    console.log('sub_service_sub_category_id',resZero.sub_service_sub_category_id);

                    // #7 Selected Category
                    // I make an improvise copy to forcedly select
                    if(resZero.service_category_id!==null){
                        getServiceCategories_subCategories_level2_byParentId( resZero.service_category_id ).then(function(response){
                            if(response.data.payload.length!==0){

                                response.data.payload.unshift({ id: 222222222, name: "- - - ", service_sub_category_id: null});
                                
                                scope.setState({level2Arr: response.data.payload },
                                function(){
                                    scope.setState({service_sub_category_id: resZero.service_sub_category_id });
                                    scope.setState({level2ValueId: (resZero.service_sub_category_id===null ? "" : resZero.service_sub_category_id) });
                                });
                            }
                        });
                    }

                    if(resZero.service_sub_category_id!==null){
                        getServiceCategories_subCategories_level3_byParentId( resZero.service_sub_category_id ).then(function(response){
                            if(response.data.payload.length!==0){
                                
                                response.data.payload.unshift({ id: 333333333, name: "- - - ", sub_service_sub_category_id: null});
                                
                                scope.setState({level3Arr: response.data.payload },
                                function(){
                                    scope.setState({sub_service_sub_category_id: resZero.sub_service_sub_category_id });
                                    scope.setState({level3ValueId: (resZero.sub_service_sub_category_id===null ? "" : resZero.sub_service_sub_category_id) });
                                });
                            }
                        });
                    }
                    
                    if(resZero.sub_service_sub_category_id!==null){
                        // :D nothing to adjust
                    }
            });

        /////////////////////////////////
        // NORMAL MODE
        /////////////////////////////////

        } else if(this.props.params.editmode==='0'){ console.log('your on normal mode');

            // #1 Default Details
            getServiceCreateDetails().then(function(response){
                scope.setState({serviceId: response.data.payload.service_id });
                scope.setState({accountName: response.data.payload.name });
                scope.setState({updatedAt: response.data.payload.updated_at});
                scope.setState({createdAt: response.data.payload.created_at});
            });

            // #2 Rate Types
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

            // #3 Service Category
            getServiceCategoriesRoot().then(function(response){
                if(response.data.payload.length!==0){
                    
                    let resZero = response.data.payload[0];

                    scope.setState({level1Arr: response.data.payload},

                    function(){
                        let service_category_id = window.sessionStorage.getItem('service_category_id'); // || resZero.id;
                        
                        if(service_category_id !==null && 
                            service_category_id !== 'undefined' && 
                            service_category_id !== undefined){
                            scope.setState({ level1ValueId: service_category_id });
                            scope.setState({ isAddedServiceInsideCategory: true});
                            scope.setState({serviceCategoryIdReference: service_category_id });
                            // trigger 
                            scope.checkSubCategoyById(service_category_id); console.log('edit|add-inside', service_category_id);
                                
                        } else {
                            scope.setState({ level1ValueId: resZero.id });
                            scope.setState({ isAddedServiceInsideCategory: false});
                            scope.setState({serviceCategoryIdReference: resZero.id });
                            scope.setState({service_category_temp_name: resZero.name});
                            // trigger
                            scope.checkSubCategoyById(resZero.id); console.log('add-outside', resZero.id);
                        }

                    });
                    
                } else {
                    scope.setState({level1Arr: []});
                    scope.setState({level1ValueId:""});
                }
            });

        } else if(this.props.params.editmode==='2'){
            console.log('nothing to happened getting from session');
        }  
    }

    checkSubCategoyById(layerOneId){
        let scope = this;

        getServiceCategories_subCategories_level2_byParentId(layerOneId)
        .then(function(response){
            // console.log('layer2', layerOneId, response);

            if(response.data.payload.length!==0){
                // Stored id
                let resZero = response.data.payload[0];
                // prepend null values
                response.data.payload.unshift({ id: 222222222, name: "- - - ", service_sub_category_id: null});
                // Apply to Array
                scope.setState({level2Arr: response.data.payload}, function(){
                    scope.setState({level2ValueId: scope.state.level2Arr[0].id });
                    scope.setState({service_sub_category_id: scope.state.level2Arr[0].service_sub_category_id });
                    // scope.checkSubInnerCategoryById(resZero.id);
                });
            } else {
                scope.setState({level2Arr: []});
                scope.setState({service_sub_category_id: null});
                scope.setState({level2ValueId:""});
            }
        });
    }

    checkSubInnerCategoryById(layerTwoId){
        let scope = this;
        getServiceCategories_subCategories_level3_byParentId(layerTwoId)
        .then(function(response){
            // console.log('layer3', layerTwoId, response);

            if(response.data.payload.length!==0){
                // Stored id
                let resZero = response.data.payload[0];
                // prepend null values
                response.data.payload.unshift({ id: 333333333, name: "- - - ", sub_service_sub_category_id: null});
                // Apply to Array
                scope.setState({level3Arr: response.data.payload},function(){
                    scope.setState({level3ValueId: scope.state.level3Arr[0].id });
                    scope.setState({sub_service_sub_category_id: scope.state.level3Arr[0].sub_service_sub_category_id });
                    // nothing more..
                });
            } else {
                scope.setState({level3Arr: []});
                scope.setState({sub_service_sub_category_id: null});
                scope.setState({level3ValueId:""});
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
        let target = evt.target.value;
        // populate level 2
        this.setState({level1ValueId: target}, function(){
            scope.checkSubCategoyById(target);
            scope.setState({serviceCategoryIdReference: target});
            // temporary tracked category name
            scope.state.level1Arr.map(function(data){
                if(+data.id === +target){
                    scope.setState({service_category_temp_name: data.name });
                }
            })
        });
    }

    onLevel2Change(evt){
        let scope = this;
        let target = evt.target.value;
        // populate level 3
        this.setState({level2ValueId: target}, function(){
            scope.checkSubInnerCategoryById(target);
            scope.setState({service_sub_category_id: (target.includes('222') ? null : target) });
        });
    }

    onLevel3Change(evt){
        let target = evt.target.value;
        this.setState({ level3ValueId: target }, function(){
            this.setState({sub_service_sub_category_id: (target.includes('333') ? null : target) });
        });
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

        if(hasCopy===true){
            // if(confirm('Cannot add with the same position.')){
            //     return;
            // } else {
            //     return;
            // }
            toastr.error('Cannot add personnel with the same position.');            
            return;
        }

        this.calculateSubtotal();
    }

    calculateSubtotal(){
        let subtotal = 0;
        
        this.state.servicePersonnelArr.map(function(data){
            // subtotal += +data.subtotal || 0;
            subtotal += (+data.manhour_rate * +data.manhours) || 0;
        });

        console.log('hest', subtotal);

        this.setState({ subtotal: subtotal });

        console.log('onCalculateSubtotal -> Personnel_', this.state.servicePersonnelArr);
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
        if(this.state.serviceName.length===0){
            toastr.error('No service name specified.');
            return;
        }

        if(this.state.description.length===0){
            toastr.error('No description specified.');
            return;
        }

        if(this.state.servicePersonnelArr.length===0){
            toastr.error('No selected personnel(s).');
            return;
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
        console.log('Category_ID:', this.state.serviceCategoryIdReference );
        console.log('Level_2:', this.state.service_sub_category_id );
        console.log('Level_3:', this.state.sub_service_sub_category_id );
        console.log('RateType_ID:', this.state.rateTypeValue );
        console.log('Personnels:', JSON.stringify( PersonnelJSON )); // Not use 
        console.log('Subtotal:', this.state.subtotal );
        console.log('Created_Time:', this.state.createdAt); // Not use 
        console.log('========== POST END ========================');

        // Edit False
        if(this.props.params.editmode==='0'){
            console.log('create', 'service_category_id', this.state.serviceCategoryIdReference);
            postServiceCreate({
                name: this.state.serviceName,
                description: this.state.description,
                service_category_id: this.state.serviceCategoryIdReference,
                service_sub_category_id: this.state.service_sub_category_id,
                sub_service_sub_category_id: this.state.sub_service_sub_category_id,
                rate_type_id: this.state.rateTypeValue,
                is_active: this.state.activeStatus,
                personnels: PersonnelJSON,
                subtotal: this.state.subtotal,
                created_at: this.state.createdAt,
            }).then(function(response){
                console.log('onCreate', response);
                // alert('Created service successfully.');
                toastr.success('Created service successfully.');

                let id = scope.state.serviceCategoryIdReference;

                console.log('sdada>>', scope.state.service_category_temp_name, scope.state.titleReference);

                let name = (scope.state.titleReference===undefined ? scope.state.service_category_temp_name : scope.state.titleReference);
                
                // switch redirect..
                let toServiceAll = window.sessionStorage.getItem('service_redirect_all') || null;

                console.log('create', toServiceAll);
                
                if(toServiceAll!==null){
                    scope.context.router.push('/services/all');
                } else {
                    scope.context.router.push('/services/manage/' + id + '/' + name);
                }
                
            })
            .catch(function(response){
                if(response.data.error){
                    toastr.error(response.data.message);
                }
                // alert(JSON.stringify(response.data.message));
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
                service_category_id: this.state.serviceCategoryIdReference,
                service_sub_category_id: this.state.service_sub_category_id,
                sub_service_sub_category_id: this.state.sub_service_sub_category_id,
                rate_type_id: this.state.rateTypeValue,
                is_active: this.state.activeStatus,
                personnels: PersonnelJSON,
                subtotal: this.state.subtotal,
                created_at: this.state.createdAt,
            }).then(function(response){
                // scope.context.router.push('/services');
                // alert('Save successfully!');
                toastr.success('Service updated successfully.');

                let id = scope.state.serviceCategoryIdReference;
                let name = scope.state.titleReference;

                // switch redirect..
                let toServiceAll = window.sessionStorage.getItem('service_redirect_all') || null;

                console.log('update', toServiceAll);

                if(toServiceAll!==null){
                    scope.context.router.push('/services/all');
                } else {
                    scope.context.router.push('/services/manage/' + id + '/' + name);
                }
            })
            .catch(function(response){
                if(response.data.error){
                    toastr.error(response.data.message);
                }
                // alert(JSON.stringify(response.data.message))
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
        let level1SelectOptions = <select className="form-control"><option>Loading..</option></select>
        let level2SelectOptions = undefined; //<select><option>Loading..</option></select>;
        let level3SelectOptions = undefined; //<select><option>Loading..</option></select>;
        let personnelList = undefined;
        let defaultStatus = undefined;
        let personnelsWarining = undefined;
        let sameRateType = <span></span>

        if(this.state.level1Arr.length!==0 && this.state.isEditmode==='0'){ //&& this.state.level1ValueId !== 'default' 
            level1SelectOptions = 
            <div className="form-group">
                <select 
                    className="form-control"  
                    onChange={scope.onLevel1Change.bind(scope)} 
                    value={scope.state.level1ValueId} disabled={this.state.isAddedServiceInsideCategory}> {/* Level One Add Only */}
                    
                    {this.state.level1Arr.map(function(data, index){
                        return (
                        <option key={index} value={data.id}>{data.name}</option>
                        )
                    })}
                </select>
            </div>
        
        } else {
            if(this.state.level1Arr.length!==0){
                level1SelectOptions =
                <div className="form-group">
                    <select 
                        className="form-control"  
                        onChange={scope.onLevel1Change.bind(scope)} 
                        value={scope.state.level1ValueId} disabled> {/* Level One Add Inside category */}
                        
                        {this.state.level1Arr.map(function(data, index){
                            return (
                            <option key={index} value={data.id}>{data.name}</option>
                            )
                        })}
                    </select>
                </div>
            }
        }
        
        if(this.state.level2Arr.length!==0 && this.state.level2ValueId !== 'default'){
            level2SelectOptions = 
            <div className="form-group">
                <label>Service Sub Category </label> {/* Level Two */}
                <select 
                    className="form-control" 
                    value={this.state.level2ValueId} 
                    onChange={this.onLevel2Change.bind(this)}>

                {this.state.level2Arr
                    .map(function(data, index){
                        return (
                            <option key={index} value={data.id}>{data.name}</option>
                        )
                    })}
                </select>
            </div>
        }

        if(this.state.level3Arr.length!==0 && this.state.level3ValueId !== 'default'){
            level3SelectOptions = 
            <div className="form-group">
                <label>Inner Service Sub Category </label> {/* Level Three */}
                <select className="form-control" 
                    value={this.state.level3ValueId} 
                    onChange={this.onLevel3Change.bind(this)}>
 
                {this.state.level3Arr.map(function(data, index){
                        return (
                            <option key={index} value={data.id}>{data.name}</option>
                        )
                } )}
                </select>
            </div>
        }

        // READING PERSONNELS
        if(this.state.servicePersonnelArr.length!==0){
            defaultStatus = <span></span>
            
            personnelsWarining = 
            <span>({ this.state.servicePersonnelArr.length })</span>
            
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
            defaultStatus = <strong>No added personnels.</strong>
        }

        return ( 
            <div>
                <h3 className="sky">Manage Service: <small>{this.state.titleReference}</small></h3>
                
                {/*this.displayAlert()*/}

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
                        <input type="text" 
                            className="form-control" 
                            value={this.state.serviceName} 
                            onChange={this.onServiceNameChange.bind(this)} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows="5"  value={this.state.description} onChange={this.onDescriptionChange.bind(this)}  ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Service Category</label>
                        {level1SelectOptions}
                        {level2SelectOptions}
                        {level3SelectOptions}
                    </div>

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

                    <h3>Added Personnel(s) {personnelsWarining}</h3>
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
































import {getRateCardServicesAll, getServicesById, getRateCardServicesSearch} from '../../common/http';

export class ServiceAll extends Component {

    constructor(props){
        super(props);
        this.state = {
            services: [],
            showFilter: false,
            service_id: "",
            category: "",
            name: "",
            description: "",
            rate_type: "",
            cost: "",
            status: "",
        }
    }
    
    componentWillMount(){
        let scope = this;
        getRateCardServicesAll().then(function(response){
            if(response.data.hasOwnProperty('payload')){
                if(response.data.payload.length!==0){
                    console.log('service all', JSON.stringify(response));
                    scope.setState({services: response.data.payload});

                    // console.log(JSON.stringify(response.data.payload));
                }
            }
        })
    }
    
    componentDidMount(){
        // 
    }

    addSevice(){
        window.sessionStorage.clear();
        this.context.router.push('/services/new/0');
        window.sessionStorage.setItem('service_redirect_all', '1');
    }

    extractAll(){
        // 
    }

    onEdit(evt){
        let id = jquery(evt.target)[0].dataset.storeid;
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

                    window.sessionStorage.setItem('service_redirect_all', '1');
                }
            }
        });
    }

    onDelete(evt){
        let id = jquery(evt.target)[0].dataset.storeid;
        let scope = this;

        console.log('delete', id );

        if(id===undefined || id===null ) return;

        if(confirm('Are you sure you want to delete this service?')){
            //
        } else {
            return;
        }
        // delete
        postServiceDelete({id:id}).then(function(response){
            // alert('Service deleted.');

            scope.state.services.map(function(data, index){
                if(+data.id === +id){
                    scope.state.services.splice(index, 1);
                    scope.setState({services: scope.state.services}, 
                    
                    function(){
                        toastr.success('Service deleted.');
                    });
                }
            });
        })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
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

    showFilterHandler(){
        let toggle = !this.state.showFilter;
        this.setState({showFilter: toggle});
    }

    serviceGlobalSearchHandler(){
        let scope = this;
        
        let service_id = this.state.service_id || '';
        let category = this.state.category || '';
        let name = this.state.name || '';
        let description = this.state.description || '';
        let rate_type = this.state.rate_type || '';
        let cost = this.state.cost || '';
        let status = this.state.status || '';

        let params = [];
            params.push( service_id.trim() );
            params.push( category.trim() );
            params.push( name.trim() );
            params.push( description.trim() );
            params.push( rate_type.trim() );
            params.push( cost.trim() );
            params.push( status.trim() );

        let paramsStr = '?service_id='+ params[0] + 
                        '&category='+ params[1] + 
                        '&name='+ params[2] + 
                        '&description='+ params[3] +
                        '&rate_type='+ params[4] +
                        '&cost='+ params[5] + 
                        '&status='+ params[6];

        console.log(paramsStr);

        getRateCardServicesSearch(paramsStr).then(function(response){
            console.log('search results', response);

            let payload = response.data.payload;
            
            if(payload.length!==0){
                scope.setState({services: payload});
            } else {
                scope.setState({services: []});
            }
        })
        .catch(function(response){
            if(response.data.error){
                toastr.error(response.data.error);
            }
        });
    }

    serviceInputHandler(evt){
        this.setState({ service_id: evt.target.value });
    }
    categoryInputHandler(evt){
        this.setState({ category: evt.target.value });
    }
    nameInputHandler(evt){
        this.setState({ name: evt.target.value });
    }
    descriptionInputHandler(evt){
        this.setState({ description: evt.target.value });
    }
    rateTypeInputHandler(evt){
        this.setState({ rate_type: evt.target.value });
    }
    costInputHandler(evt){
        this.setState({ cost: evt.target.value });
    }
    statusInputHandler(evt){
        this.setState({ status: evt.target.value });    
    }

    render(){
        let scope = this;
        let servicesTable = <tr><td colSpan={8}>No data.</td></tr>;
        let searchFilter = null;

        if(this.state.services.length!==0){
            servicesTable = 
            this.state.services.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.service_id}</td>
                        <td>{data.category.name}</td>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>{data.rate_type.name}</td>
                        <td>{data.subtotal}</td>
                        <td>{(data.is_active==='0' ? 'Inactive' : 'Active')}</td>
                        <td>
                            <button type="button" className="btn btn-default" data-storeid={data.id} onClick={scope.onEdit.bind(scope)}>Edit</button>&nbsp;
                            <button type="button" className="btn btn-danger"  data-storeid={data.id} onClick={scope.onDelete.bind(scope)}>&times;</button>
                        </td>
                    </tr>
                )
            });

        } else {
            servicesTable = <tr><td colSpan={8}>No data.</td></tr>;
        }

        if(this.state.showFilter){
            searchFilter =
            <div className="filter-content">
                <div>
                    <div className="col-xs-3">
                        <div className="form-group">
                            <label>Sevice ID</label>
                            <input type="text" 
                                value={this.state.service_id} 
                                onChange={this.serviceInputHandler.bind(this)} 
                                className="form-control" />
                        </div>    
                    </div>
                    <div className="col-xs-3">
                        <div className="form-group">
                            <label>Category</label>
                            <input type="text" 
                                value={this.state.category} 
                                onChange={this.categoryInputHandler.bind(this)} 
                                className="form-control" />
                        </div>    
                    </div>
                    <div className="col-xs-3">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" 
                                value={this.state.name} 
                                onChange={this.nameInputHandler.bind(this)} 
                                className="form-control" />
                        </div>    
                    </div>
                    <div className="col-xs-3">
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" 
                                value={this.state.description} 
                                onChange={this.descriptionInputHandler.bind(this)} 
                                className="form-control" />
                        </div>    
                    </div>
                    <br className="clearfix" />
                </div>

                <div>
                    <div className="col-xs-3">
                        <div className="form-group">
                            <label>Rate Type</label>
                            <input type="text" 
                                value={this.state.rate_type} 
                                onChange={this.rateTypeInputHandler.bind(this)} 
                                className="form-control" />
                        </div>    
                    </div>
                    <div className="col-xs-3">
                        <div className="form-group">
                            <label>Cost</label>
                            <input type="text" 
                                value={this.state.cost} 
                                onChange={this.costInputHandler.bind(this)}
                                className="form-control" />
                        </div>    
                    </div>
                    <div className="col-xs-3">
                        <div className="form-group">
                            <label>Status</label>
                            <input type="text" 
                                value={this.state.status} 
                                onChange={this.statusInputHandler.bind(this)}
                                className="form-control" />
                        </div>    
                    </div>
                    <div className="col-xs-3">
                        <div className="form-group">
                        <label className="center-block">&nbsp;</label>
                        <button type="button" 
                            className="btn btn-primary"
                            onClick={this.serviceGlobalSearchHandler.bind(this)}
                            >Submit</button>
                        </div>  
                    </div>
                    <br className="clearfix" />
                </div>
                
                <br />
                <br />

                <div className="divider"></div>
            </div>
        }


        return (
            <div>
                <h3 className="sky">All Services</h3>
                
                <Link to="/services">Return to Manage Services</Link>   
                
                <br />
                <br />

                <div className="row">
                    {searchFilter}

                    <div className="col-xs-4">
                        <div className="form-group">
                            <button type="button" 
                                className="btn btn-primary"
                                onClick={this.showFilterHandler.bind(this)}>
                                {( !this.state.showFilter ? 'Show Filter' : 'Hide Filter' )}
                            </button>
                        </div>
                    </div>

                    <div className="col-xs-8">

                        <div className="navbar-form navbar-left pull-right"> 

                            <div className="form-group"> 
                                <input className="form-control" placeholder="Search"/>
                            </div>&nbsp;
                        
                            <button type="button" className="btn btn-primary">Submit</button>&nbsp;
                        
                            <button type="button" className="btn btn-primary" onClick={this.addSevice.bind(this)}>Add Service</button>&nbsp;
                            
                            <button type="button" className="btn btn-primary" onClick={this.extractAll.bind(this)}>Extract All</button>
                        </div>
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
