import React, {Component} from 'react';
import {Link} from 'react-router';
import {AsideNav} from './aside';
import {CalcView} from '../../common/calcview/calcview';
import {CategoryTreeView} from '../../common/categoryTreeView/categoryTreeView';
import {PermissionView} from '../../common/permissionView/permissionView';

import {getRateCardPackages, postPackageDelete, getRateCardPackageById} from '../../common/http';
import xhr from 'jquery';

// Landing Page
export class Packages extends Component {
    constructor(props){
        super(props);
        this.state = {
            packages: []
        }
    }

    componentDidMount(){}

    componentWillMount(){
        let scope = this;
        
        window.sessionStorage.clear();

        getRateCardPackages().then(function(response){
            console.log('/packages', response);
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                scope.setState({packages: response.data.payload });
            }
        });
    }

    setupEditModeById(id, cb){
        let scope = this;
        
        getRateCardPackageById(id).then(function(response){
            console.log('package >', response);
            // origin
            window.sessionStorage.setItem('packageId', id);
            window.sessionStorage.setItem('packagename', response.data.payload[0].name);
            window.sessionStorage.setItem('packagedesc', response.data.payload[0].description);
            window.sessionStorage.setItem('addedServices', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('permittedPackageUser', JSON.stringify(response.data.payload[0].permitted_users));
            window.sessionStorage.setItem('package_discount', response.data.payload[0].discount);
            window.sessionStorage.setItem('rateCardId', response.data.payload[0].rate_card_id);
            // bckup
            window.sessionStorage.setItem('bck_packageId', id);
            window.sessionStorage.setItem('bck_packagename', response.data.payload[0].name);
            window.sessionStorage.setItem('bck_packagedesc', response.data.payload[0].description);
            window.sessionStorage.setItem('bck_added_services', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('bck_permittedPackageUser', JSON.stringify(response.data.payload[0].permitted_users));
            window.sessionStorage.setItem('bck_package_discount', response.data.payload[0].discount);
            window.sessionStorage.setItem('bck_rateCardId', response.data.payload[0].rate_card_id);
            // callback
            cb();
        });
    }

    onEditAsManage(evt){
        let id = xhr(evt.target)[0].dataset.id;
        let scope = this;

        if(id===null||id===undefined){ return; }

        this.setupEditModeById(id, function(){
            let delay = setTimeout(function(){
                clearTimeout(delay);
                
                window.sessionStorage.setItem('packageAction','update');

                window.sessionStorage.setItem('packageId', id);

                scope.context.router.push('/packages/add');
            }, 16);
        });
    }

    onDeletePackage(evt){
        let id = xhr(evt.target)[0].dataset.id;
        let scope = this;

        if(id===null||id===undefined) return;
        if(confirm('Are you sure you want to delete this package?')){//
        } else {return;}
        
        this.state.packages.map(function(data, index){
            if(+data.id === +id){   
                scope.state.packages.splice(index, 1);
            }
        });

        this.setState({packages:this.state.packages});
        postPackageDelete({id:id}).then(function(response){
            console.log(response);
            alert('Selected Package were deleted.')
        });
    }

    onAdd(){
        window.sessionStorage.setItem('packageAction', 'create');
        this.context.router.push('/packages/add');
    }

    render() {
        let package_td = <tr><td colSpan={3} >No data.</td></tr>
        let scope = this;

        if(this.state.packages.length!==0){
            package_td = 
            this.state.packages.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.name}</td>
                        <td>{data.products}</td>
                        <td>
                            <button className='btn btn-primary' data-id={data.id} onClick={scope.onEditAsManage.bind(scope)}>Manage</button>&nbsp;
                            <button className='btn btn-danger'  data-id={data.id} onClick={scope.onDeletePackage.bind(scope)}>Delete</button>
                        </td>
                    </tr>
                )
            });
        }

        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                <div className='manage-packages'>

                    <h3 className='sky'>Manage Packages</h3>

                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Packages</th>
                                <th>Products</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {package_td}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-block btn-primary" onClick={this.onAdd.bind(this)}><i className="fa fa-plus"></i>&nbsp; Add Packages</button>
                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}

Packages.contextTypes = {
  router: React.PropTypes.object.isRequired
};

































































// Step1 - Add Service
export class PackageAdd extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: ""
        }
    }
    componentWillMount(){
        let WSpackagename = window.sessionStorage.getItem('packagename');
        let WSpackagedesc = window.sessionStorage.getItem('packagedesc');
        
        if(WSpackagename){
            this.setState({name: WSpackagename})
        }
        if(WSpackagedesc){
            this.setState({description: WSpackagedesc})
        }
        console.log('packageidistore', window.sessionStorage.getItem('packageId'));
    }

    componentDidMount(){}

    onChangeName(evt){
        this.setState({name:evt.target.value});
        window.sessionStorage.setItem('packagename',evt.target.value);
    }

    onChangeDescription(evt){
        this.setState({description:evt.target.value});
        window.sessionStorage.setItem('packagedesc',evt.target.value);
    }

    onNext(){
        let WSname = window.sessionStorage.getItem('packagename') || "";
        let WSdesc = window.sessionStorage.getItem('packagedesc') || "";
        if(WSname.length===0 || WSdesc.length===0){
            if(confirm('No description or name.')){return;} else {return;}
        }else{
            this.context.router.push('/packages/choose');
        }
    }

    render(){
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                <div className='package-content'>
                    <div className='col-md-12'>
                        <form>
                            <div className='form-group'>
                                <label>Package name</label>
                                <input className='form-control' type='text' value={this.state.name} onChange={this.onChangeName.bind(this)} />
                                <label>Package Description</label> 
                                <input className='form-control' type='text'  value={this.state.description} onChange={this.onChangeDescription.bind(this)} />
                            </div>
                        </form>
                        
                        <Link className='btn btn-default pull-left' to='/packages'>Back</Link>
                        <button type="button" className='btn btn-primary pull-right' onClick={this.onNext.bind(this)}>Next</button>
                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}

PackageAdd.contextTypes = {
  router: React.PropTypes.object.isRequired
};

































































import {ConnectedTable} from '../../common/connectedTable/connectedTable.js';

// Step2 - Choose Service
export class PackageChoose extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            count: 0,
            added_services: []
        }
    }

    componentDidMount(){}

    componentWillMount(){
        let temp = JSON.parse(window.sessionStorage.getItem('addedServices')) || [];
        if(temp.length!==0){
            this.setState({ added_services: temp });
            this.setState({ count: temp.length });
        }
    }

    callbackOnUpdate(addedServices){
        let scope = this;
        this.setState({ added_services: addedServices }, function(){
            window.sessionStorage.setItem('addedServices', JSON.stringify(scope.state.added_services));
        });
        // Reset package_discount
        window.sessionStorage.setItem('package_discount', 1);
    }

    onNext(){
        let temp = JSON.parse(window.sessionStorage.getItem('addedServices')) || [];
        if(temp.length===0){
            if(!confirm('No added services')) return false;
        } else {
            this.context.router.push('/packages/rate');
        }
    }

    render(){
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                <div className='package-content'>
                    <div className='col-md-12'>
                        <ConnectedTable 
                            addedServices={this.state.added_services} 
                            onUpdate={this.callbackOnUpdate.bind(this)}/>  
                            
                        <Link className='btn btn-default pull-left' to='/packages/add'>Back</Link>
                        <button type="button" className="btn btn-primary pull-right" onClick={this.onNext.bind(this)}>Next</button>
                    </div>
                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}

PackageChoose.contextTypes = {
  router: React.PropTypes.object.isRequired
};

































































// Step3 - Rate Service
export class PackageRate extends Component {

    constructor(props){
        super(props);

        this.state = {
            'package_total': 0,
            'package_discount': 1,
            'package_rate': 0
        }
    }

    componentDidMount(){
        //
    }

    componentWillMount(){
        let WSaddedServices = window.sessionStorage.getItem('addedServices');
        let temp = (WSaddedServices)? JSON.parse(WSaddedServices) : [];
        let comulative = 0;

        if(temp.length!==0){
            temp.map(function(data){
                comulative += +data.subtotal;
            });
        }

        let WSpackageDiscount = window.sessionStorage.getItem('package_discount') || 1;
        let discount = +WSpackageDiscount;
        this.setState({package_discount: discount});

        this.setState({package_total: comulative}, function(){
            this.computePackageRate(discount);
        });
    }

    computePackageRate(discount){
        console.log('>>discount ', discount);

        let packageTotal = +this.state.package_total;
        let discounted   = packageTotal * discount / 100;
        let packageRate  = packageTotal - discounted;
            packageRate  = packageRate.toFixed(2);

            console.log(discounted, this.state.package_total, packageRate);

        this.setState({package_rate: packageRate });
        window.sessionStorage.setItem('package_rate', packageRate);
    }

    onDiscountChange(evt){
        console.log('called');

        let discount = +evt.target.value;
        if(discount > 100 || discount < 1){
            alert('Should be greater then 1 and not exceed 100');
            discount = 1;
        }
        
        this.setState({package_discount: discount});

        window.sessionStorage.setItem('package_discount', discount);

        this.computePackageRate(discount);
    }

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
                                    <input type='number' className='form-control' value={this.state.package_total} disabled />
                                </div>
                            </div>
                            
                            <br/>

                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Discount</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='number' className='form-control' value={this.state.package_discount} onChange={this.onDiscountChange.bind(this)} />
                                </div>
                            </div>

                            <br/>

                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Package Rate</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='number' className='form-control' value={this.state.package_rate} disabled />
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

import {PermissionEditor} from '../../common/permissionEditor/permissionEditor.js';

export class PackagePermission extends Component {
    constructor(props){
        super(props);
        this.state = {
            permittedUsers: []
        }
    }

    componentDidMount(){}

    componentWillMount(){
        let temp = JSON.parse(window.sessionStorage.getItem('permittedPackageUser')) || [];
        if(temp.length!==0){
            this.setState({permittedUsers: temp});
        }
    }

    callbackUpdate(permittedUsers){
        this.setState({permittedUsers});
        window.sessionStorage.setItem('permittedPackageUser', JSON.stringify(permittedUsers));
    }

    onNext(){
        let temp = JSON.parse(window.sessionStorage.getItem('permittedPackageUser')) || [];
        if(temp.length===0){
            if(confirm('No selected user')){ return;} else {return; }
        }
        this.context.router.push('/packages/save');
    }

    render () {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                
                <div className='package-content'>
                    <div className='col-md-12'>
                        
                        <PermissionEditor 
                            defaultArr={this.state.permittedUsers} 
                            onUpdateArray={this.callbackUpdate.bind(this)} 
                        />

                        <br />

                        <Link className='btn btn-default pull-left' to='/packages/rate'>Back</Link>
                        <button type="button" className="btn btn-primary pull-right" onClick={this.onNext.bind(this)}>Next</button>
                    </div>
                </div>

            <br className='clearfix' /><br />
            </div>
        )
    }
}

PackagePermission.contextTypes = {
  router: React.PropTypes.object.isRequired
};

































































import {postPackagePreview, postPackageCreate, postPackageUpdate} from '../../common/http';
// Step4 - Save Service
export class PackageSave extends Component {

    constructor(props){
        super(props);
        this.state = {
            categories: [],
            name: "",
            description: "",
            permitted_user_ids: "",

            total: 0,
            discount: 0,
            rate: 0,

            ratecard_id: 0,
            service_ids: [],
            
            packageId: 0,

            packageAction: 'none',
            enableSave: true,

            isChanged: '0'
        }
    }

    componentDidMount(){}

    componentWillMount(){
        let scope = this;
        let WSname = window.sessionStorage.getItem('packagename') || "Error Name";
        let WSdecription = window.sessionStorage.getItem('packagedesc') || "Error Description";
        // Name
        this.setState({name: WSname});
        // Description
        this.setState({description: WSdecription});
        // Added Services
        let includedServices = JSON.parse(window.sessionStorage.getItem('addedServices')) || [];
        let servicesWithOrder = [];

        if(includedServices.length!==0){
            // Add "order"
            includedServices.map(function(data, index){
                servicesWithOrder.push({ service_id: data.service_id, order: index });
            });

            console.log('with order', JSON.stringify(servicesWithOrder));
            console.log('action', window.sessionStorage.getItem('packageAction'));

            let json = JSON.stringify(servicesWithOrder);
            let WSpackageAction = window.sessionStorage.getItem('packageAction') || 'none';
            let WSpackageId = window.sessionStorage.getItem('packageId') || 0;

            this.setState({ packageId: WSpackageId });

            console.log('WSpackageId', WSpackageId);

            this.setState({service_ids: json}, function(){
                switch(WSpackageAction){
                    ///
                    case 'create':
                        postPackagePreview({service_ids: json}) // xxxx
                        .then(function(response){
                            console.log('/package/save/:0', response);
                            scope.setState({categories: response.data.payload});
                        });
                    break;
                    ///
                    case 'edit': case 'update':
                        let temp = {};
                        console.log('org',window.sessionStorage.getItem('addedServices'))
                        console.log('old',window.sessionStorage.getItem('bck_added_services'))

                        if(window.sessionStorage.getItem('addedServices') !==  window.sessionStorage.getItem('bck_added_services')){
                            temp = {service_ids: json}
                            console.log('goes here/:0');
                        } else {
                            temp = {package_id: WSpackageId}
                            console.log('goes here/:1');
                        }

                        console.log('given', json, 'id', WSpackageId);

                        postPackagePreview(temp)
                        .then(function(response){
                            console.log('/package/save/:1', response);
                            scope.setState({categories: response.data.payload});
                        });
                    break;
                }
            });
        }

        // Total Package by Services
        let comulative = 0;
        let WSservices = JSON.parse(window.sessionStorage.getItem('addedServices')) || [];
            if(WSservices.length!==0){
                WSservices.map(function(data){
                    comulative += +data.subtotal; 
                });
                this.setState({total: comulative});
            }
        
        // Discount 
        let WSdiscount = window.sessionStorage.getItem('package_discount') || 0;
            this.setState({discount: WSdiscount});

        // Package Rate
        let discounted = comulative * (WSdiscount/100);
            discounted = comulative - discounted;
            this.setState({rate: discounted.toFixed(2)});

        // Permitted User
        let WSpermittedUsers = JSON.parse(window.sessionStorage.getItem('permittedPackageUser')) || [];
            if(WSpermittedUsers.length!==0){
                this.setState({permitted_user_ids: JSON.stringify(WSpermittedUsers) });
            }
        
        // Ratecard ID
        console.log('RATECARDID', window.sessionStorage.getItem('rateCardId') );

        let WSratecardId = window.sessionStorage.getItem('rateCardId') || 0;
        this.setState({ratecard_id: WSratecardId});

        // Action
        let WSpackageAction = window.sessionStorage.getItem('packageAction') || null;
        this.setState({ packageAction: WSpackageAction });

        console.log('>>>>>>>', WSpackageAction);
    }

    onUpdate(){
        this.onSave();        
    }

    getChanges(){ //FFFFFFFF
        let changed = '0';
        
        if(window.sessionStorage.getItem('bck_packagename')!==this.state.name){
            changed = '1';
            console.log('#1', window.sessionStorage.getItem('bck_packagename'), this.state.name);
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_packagedesc')!==this.state.description){
            changed = '1';
            console.log('#2', window.sessionStorage.getItem('bck_packagedesc'), this.state.description);
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_rateCardId')!==this.state.ratecard_id){
            changed = '1';
            console.log('#3', window.sessionStorage.getItem('bck_rateCardId'), this.state.ratecard_id);
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_added_services')!==window.sessionStorage.getItem('addedServices')){
            changed = '1';
            console.log('#4', window.sessionStorage.getItem('bck_added_services'));
            console.log('#4', JSON.stringify(this.state.service_ids));
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_permittedPackageUser')!==this.state.permitted_user_ids){
            changed = '1';
            console.log('#5', window.sessionStorage.getItem('bck_permittedPackageUser'), this.state.permitted_user_ids);
            console.log('------------------------------');
        }
        if(this.state.isChanged==='1'){
            changed = '1';
        }
        console.log('package is changed =', changed);

        return changed;
    }

    onSave(){
        let scope = this;
        let packageAction = window.sessionStorage.getItem('packageAction') || 'none';
        
        console.log('Your action', packageAction);

        console.log('id:', this.state.packageId);
        console.log('name:', this.state.name);
        console.log('description:', this.state.description);
        console.log('package_rate:', this.state.rate);
        console.log('total_package_rate:', this.state.total);
        console.log('discount:', this.state.discount);
        console.log('rate_card_id:', this.state.ratecard_id);
        
        console.log('permitted_user_ids:', this.state.permitted_user_ids);

        console.log('my_new_action', packageAction);

        if(packageAction==='update' ){ //packageAction==='edit'
            console.log('update');

            let service_ids = [];
            this.state.categories.map(function(data){
                service_ids = service_ids.concat(data.services);
            }); 

            console.log('service_ids:', JSON.stringify(service_ids));

            postPackageUpdate({
                id: this.state.packageId,
                name: this.state.name,
                has_changed: scope.getChanges(),
                description: this.state.description,
                package_rate: this.state.rate,
                total_package_rate: this.state.total,
                discount: this.state.discount,
                rate_card_id: this.state.ratecard_id,
                service_ids: JSON.stringify(service_ids),
                permitted_user_ids: this.state.permitted_user_ids
            }).then(function(response){
                alert('Updated Package Successfully');
                console.log('jeffreyWay update', response);
                scope.context.router.push('/packages');
            })
            .catch(function(response){
                if(response.data.error){
                    alert(response.data.message);
                }
            });

        } else if(packageAction==='create'){
            console.log('create');

            let service_ids = [];

            this.state.categories.map(function(data){
                service_ids = service_ids.concat(data.services);
            });
            
            console.log(JSON.stringify(service_ids));

            postPackageCreate({
                name: this.state.name,
                description: this.state.description,
                package_rate: this.state.rate,
                total_package_rate: this.state.total,
                discount: this.state.discount,
                rate_card_id: this.state.ratecard_id,
                service_ids: JSON.stringify(service_ids),
                permitted_user_ids: this.state.permitted_user_ids
            }).then(function(response){
                console.log('jeffreyWay create', response);
                let id = response.data.payload;
                window.sessionStorage.setItem('packageId', id);
                scope.previewById(id);
            })
            .catch(function(response){
                if(response.data.error){
                    alert(response.data.message);
                }
            });
        }
    }

    previewById(id){
        alert('Added Package Successfully');

        let scope = this;
        window.sessionStorage.clear();

        // change create to edit
        window.sessionStorage.setItem('packageAction', 'edit');

        let action = window.sessionStorage.getItem('packageAction');
        
        this.setState({packageAction: action});

        getRateCardPackageById(id).then(function(response){
            console.log('after save', response);
            window.sessionStorage.setItem('packageId', id);
            window.sessionStorage.setItem('packagename', response.data.payload[0].name);
            window.sessionStorage.setItem('packagedesc', response.data.payload[0].description);
            window.sessionStorage.setItem('addedServices', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('permittedPackageUser', JSON.stringify(response.data.payload[0].permitted_users));
            window.sessionStorage.setItem('package_discount', response.data.payload[0].discount);
            window.sessionStorage.setItem('rateCardId', response.data.payload[0].rate_card_id);
        });
    }

    onEdit(){
        let scope = this;
        let id = window.sessionStorage.getItem('packageId');
        
        getRateCardPackageById(id).then(function(response){
            console.log('oackage> onEdit', response, id);

            window.sessionStorage.clear();
            window.sessionStorage.setItem('packageId', id);
            window.sessionStorage.setItem('packagename', response.data.payload[0].name);
            window.sessionStorage.setItem('packagedesc', response.data.payload[0].description);
            window.sessionStorage.setItem('addedServices', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('permittedPackageUser', JSON.stringify(response.data.payload[0].permitted_users));
            window.sessionStorage.setItem('package_discount', response.data.payload[0].discount);
            window.sessionStorage.setItem('rateCardId', response.data.payload[0].rate_card_id);

            let delay = setTimeout(function(){
                clearTimeout(delay);

                window.sessionStorage.setItem('packageAction', 'update');
                
                let action = window.sessionStorage.getItem('packageAction');
                
                scope.setState({packageAction: action});

                scope.context.router.push('/packages/add');
            }, 16);
        });
    }

    callbackUpdateServiceCategory(categories){
        this.setState({categories});
    }

    callbackOndrop(changeService){
        console.log('services/output/packages/save', changeService.json);

        if(this.state.categories.length===0) return;

        this.state.categories.map(function(data){
            let services = data.services;
                (function(array){
                    array.map(function(servicesData){
                        changeService.json.map(function(changeData){   
                            if(+servicesData.id === +changeData.id){
                                servicesData.order = changeData.order;
                            }
                        })
                    });
                })(services);
        });

        console.log('before send', JSON.stringify(this.state.categories));

        this.setState({categories: this.state.categories}, function(){
            this.setState({enableSave: true});
        });

        this.setState({isChanged:changeService.changed});
    }
    
    callbackOndrag(){
        this.setState({enableSave:false});
    }

    render () {
        let scope = this;
        let actionBtn = <span></span>;

        if(this.state.packageAction==='create'){
            actionBtn =
            <div>
                <Link className='btn btn-default pull-left' to='/packages/permission'>Back</Link>
                <button type="button" 
                    className={"btn btn-primary pull-right "+ (this.state.enableSave ? '' : 'disabled')}
                    onClick={this.onSave.bind(this)}>Save</button>
            </div>
        
        } else if(this.state.packageAction==='edit'){
            actionBtn =
            <button type="button" 
                className={"btn btn-primary pull-right "+ (this.state.enableSave ? '' : 'disabled')}
                onClick={this.onEdit.bind(this)}>Edit</button>
        
        } else if(this.state.packageAction==='update'){
            actionBtn =
            <div>
                <Link className='btn btn-default pull-left' to='/packages/permission'>Back</Link>
                <button type="button" 
                    className={"btn btn-success pull-right "+ (this.state.enableSave ? '' : 'disabled')} 
                    onClick={this.onUpdate.bind(this)}>Update</button>
            </div>
        }

        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                
                <div className='package-content'>

                    <div className='col-md-12'>

                        <CategoryTreeView
                            serviceCategory={this.state.categories}
                            ratecardname={this.state.name}
                            ratecarddesc={this.state.description}
                            onUpdateServiceCategory={this.callbackUpdateServiceCategory.bind(this)}
                            onDrag={this.callbackOndrag.bind(this)}
                            onDrop={this.callbackOndrop.bind(this)}
                        />

                        <CalcView 
                            total={this.state.total}
                            discount={this.state.discount}
                            rate={this.state.rate}
                        />
                        
                        <h3>Package Permission</h3>

                        <PermissionView 
                            permittedUser={this.state.permitted_user_ids}
                        />

                        <br />

                   {actionBtn}
                    </div>

                </div>

            <br className='clearfix' /><br />
            </div>
        )
    }
}

PackageSave.contextTypes = {
  router: React.PropTypes.object.isRequired
};

































































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