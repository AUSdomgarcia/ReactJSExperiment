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

    componentDidMount(){
        let scope = this;
        getRateCardPackages().then(function(response){
            console.log('/packages', response);
            
            if(response.data.payload.length!==0){
                scope.setState({packages: response.data.payload });
            }
        });
    }

    componentWillMount(){
        window.sessionStorage.clear();
    }

    onManagePackage(evt){
        let id = xhr(evt.target)[0].dataset.id;
        let scope = this;

        if(id===null||id===undefined){ return; }

        getRateCardPackageById(id).then(function(response){
            console.log('on manage', response);

            window.sessionStorage.setItem('packageId', id);
            window.sessionStorage.setItem('packagename', response.data.payload[0].name);
            window.sessionStorage.setItem('packagedesc', response.data.payload[0].description);
            window.sessionStorage.setItem('added_services', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('permittedPackageUser', JSON.stringify(response.data.payload[0].permitted_users));
            window.sessionStorage.setItem('package_discount', response.data.payload[0].discount);
            window.sessionStorage.setItem('rateCardId', response.data.payload[0].rate_card_id);

            let delay = setTimeout(function(){
                clearTimeout(delay);
                window.sessionStorage.setItem('packageEditMode', 'ok');
                scope.context.router.push('/packages/add');
            }, 100);
        });
    }

    onDeletePackage(evt){
        let id = xhr(evt.target)[0].dataset.id;
        let scope = this;

        if(id===null||id===undefined) return;

        if(confirm('Do you want to delete')){
            //
        } else {
            return;
        }
        
        this.state.packages.map(function(data, index){
            if(+data.id === +id){   
                scope.state.packages.splice(index, 1);
            }
        });

        this.setState({packages:this.state.packages});

        postPackageDelete({id:id}).then(function(response){
            console.log(response);
        });
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
                            <button className='btn btn-primary' data-id={data.id} onClick={scope.onManagePackage.bind(scope)}>Manage</button>
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
    }
    componentDidMount(){
        //
    }

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
            if(confirm('No description or name.')){
                return;
            } else {
                return;
            }
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

    componentDidMount(){
        //
    }

    componentWillMount(){
        let WSaddedServices = window.sessionStorage.getItem('added_services');
        console.log(WSaddedServices);

        let temp = (WSaddedServices)? JSON.parse(WSaddedServices) : [];
        
        if(temp.length!==0){
            this.setState({added_services:temp});
            this.setState({count:temp.length});
        }
    }

    callbackUpdate(addedServices){
        this.setState({added_services: addedServices});
        window.sessionStorage.setItem('added_services', JSON.stringify(addedServices));
        window.sessionStorage.setItem('package_discount', 1);
    }

    onNext(){
        let WSaddedServices = window.sessionStorage.getItem('added_services');
        let temp = (WSaddedServices)? JSON.parse(WSaddedServices) : [];
        
        if(temp.length===0){
            if(confirm('No added Services.')){
                return;
            } else { return; }
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
                            onUpdate={this.callbackUpdate.bind(this)}/>  
                      
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
        let WSaddedServices = window.sessionStorage.getItem('added_services');
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

    componentDidMount(){
        //
    }

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












import {postRateCardPreview, postPackageCreate, postPackageUpdate} from '../../common/http';
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

            savingMode: null,
        }
    }

    componentDidMount(){
        //
    }

    componentWillMount(){
        let scope = this;

        let WSname = window.sessionStorage.getItem('packagename') || "Default";
        let WSdecription = window.sessionStorage.getItem('packagedesc') || "Default";
        // Name
        this.setState({name: WSname});
        // Description
        this.setState({description: WSdecription});

        let includedServices = JSON.parse(window.sessionStorage.getItem('added_services')) || [];
            
        if(includedServices.length!==0){
            let services = JSON.stringify(includedServices);
            this.setState({service_ids: services});

            postRateCardPreview({ service_ids: services })
            .then(function(response){
                console.log('/package/save', response);
                scope.setState({categories: response.data.payload});
            });
        }
        // Total Package by Services
        let comulative = 0;
        let WSservices = JSON.parse(window.sessionStorage.getItem('added_services')) || [];
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
        let WSpermittedUsers = window.sessionStorage.getItem('permittedPackageUser');
        console.log(WSpermittedUsers)
        this.setState({permitted_user_ids: WSpermittedUsers });

        let WSratecardId = window.sessionStorage.getItem('rateCardId') || 0;
            this.setState({ratecard_id: +WSratecardId});

        let WSpackageId = window.sessionStorage.getItem('packageId') || 0;
            this.setState({ packageId: WSpackageId });

        let WSsavingMode = window.sessionStorage.getItem('savingMode') || null;
            this.setState({ savingMode: WSsavingMode });
    }

    onSave(){
        let scope = this;
        let packageEditMode = window.sessionStorage.getItem('packageEditMode') || null;

        console.log('id:', this.state.packageId);
        console.log('name:', this.state.name);
        console.log('description:', this.state.description);
        console.log('package_rate:', this.state.rate);
        console.log('total_package_rate:', this.state.total);
        console.log('discount:', this.state.discount);
        console.log('rate_card_id:', this.state.ratecard_id);
        console.log('service_ids:', this.state.service_ids);
        console.log('permitted_user_ids:', this.state.permitted_user_ids);

        if(packageEditMode!=null){
            postPackageUpdate({
                id: this.state.packageId,
                name: this.state.name,
                description: this.state.description,
                package_rate: this.state.rate,
                total_package_rate: this.state.total,
                discount: this.state.discount,
                rate_card_id: this.state.ratecard_id,
                service_ids: this.state.service_ids,
                permitted_user_ids: this.state.permitted_user_ids
            }).then(function(response){
                console.log('jeffreyWay update', response);
                alert('Package Updated');
            });

        } else {
            postPackageCreate({
                name: this.state.name,
                description: this.state.description,
                package_rate: this.state.rate,
                total_package_rate: this.state.total,
                discount: this.state.discount,
                rate_card_id: this.state.ratecard_id,
                service_ids: this.state.service_ids,
                permitted_user_ids: this.state.permitted_user_ids
            }).then(function(response){
                console.log('jeffreyWay create', response);
                let id = response.data.payload;
                window.sessionStorage.setItem('packageId', id);

                scope.previewById(id);
            });
        }
    }

    previewById(id){
        let scope = this;
        // Edit button should Show after
        window.sessionStorage.setItem('savingMode', 'ok');

        getRateCardPackageById(id).then(function(response){
            window.sessionStorage.setItem('packageId', id);
            window.sessionStorage.setItem('packagename', response.data.payload[0].name);
            window.sessionStorage.setItem('packagedesc', response.data.payload[0].description);
            window.sessionStorage.setItem('added_services', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('permittedPackageUser', JSON.stringify(response.data.payload[0].permitted_users));
            window.sessionStorage.setItem('package_discount', response.data.payload[0].discount);
            window.sessionStorage.setItem('rateCardId', response.data.payload[0].rate_card_id);

            let delay = setTimeout(function(){
                clearTimeout(delay);
                window.location.reload()
                // scope.context.router.push('/packages/save');
                // window.location.href = window.location.origin + '/packages/save'; 
            }, 100);
        });
    }


    onEdit(){
        let id = window.sessionStorage.getItem('packageId', id);
        let scope = this;
        getRateCardPackageById(id).then(function(response){
            console.log('onEdit', response, id);

            window.sessionStorage.clear();

            window.sessionStorage.setItem('packageId', id);
            window.sessionStorage.setItem('packagename', response.data.payload[0].name);
            window.sessionStorage.setItem('packagedesc', response.data.payload[0].description);
            window.sessionStorage.setItem('added_services', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('permittedPackageUser', JSON.stringify(response.data.payload[0].permitted_users));
            window.sessionStorage.setItem('package_discount', response.data.payload[0].discount);
            window.sessionStorage.setItem('rateCardId', response.data.payload[0].rate_card_id);

            let delay = setTimeout(function(){
                clearTimeout(delay);
                window.sessionStorage.setItem('packageEditMode', 'ok');
                scope.context.router.push('/packages/add');
            }, 100);
        });
    }

    render () {
        let scope = this;
        let saveAndBackBtn = <span></span>;
        let editBtn = <span></span>;

        if(this.state.savingMode!==null){
            editBtn =
            <button type="button" className="btn btn-primary pull-right" onClick={this.onEdit.bind(this)}>Edit</button>
        } else {
            saveAndBackBtn =
            <div>
                <Link className='btn btn-default pull-left' to='/packages/permission'>Back</Link>
                <button type="button" className="btn btn-primary pull-right" onClick={this.onSave.bind(this)}>Save</button>
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

                   {editBtn}
                   {saveAndBackBtn}
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













    