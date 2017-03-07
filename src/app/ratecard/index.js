import React, {Component} from 'react';
import {Link} from 'react-router';

import jquery from 'jquery';

import toastr from 'toastr';

import './ratecard.scss';

import { 
    getRateCards,
    getServiceRateTypes,
    getRateCardServicesById,
    getRateCardsPersonnelEmployees,
    getRateCardById,
    postRateCardAction,
    getRateCardsDefault } from '../../common/http';

export class RateCard extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            rateCardArr: [],
            archiveRateCardArr: [],
            has_changed: false,
            final_services: []
        };
    }

    componentDidMount(){
        //
    }

    segregateRateCard(dataArr){
        let tempRateCard = [];
        let tempArchived = [];

        dataArr.map(function(data){
            if(data.is_archived==='0'){
                tempRateCard.push(data);
            } else {
                tempArchived.push(data);
            }
        });
        console.log('active', tempRateCard.length, 'archive', tempArchived.length);
        this.setState({rateCardArr: tempRateCard});
        this.setState({archiveRateCardArr: tempArchived });
    }

    componentWillMount(){
        let scope = this;
        // window.sessionStorage.clear();
        getRateCardsDefault().then(function(response){
            console.log('/ratecard', response);
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                // filter archive and ratecard
                scope.segregateRateCard(response.data.payload);
            }
        });
    }

    setupEditModeById(id, cb){
        let scope = this;
        window.sessionStorage.clear();
        getRateCardById(id).then(function(response){
            console.log('>>>>', id, response);
            // original
            window.sessionStorage.setItem('id', id);
            window.sessionStorage.setItem('ratecardname', response.data.payload[0].name);
            window.sessionStorage.setItem('ratecarddesc', response.data.payload[0].description);
            window.sessionStorage.setItem('selectedRateTypeId', response.data.payload[0].rate_type_id);
            window.sessionStorage.setItem('includedServiceArr', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('permittedUserArr', JSON.stringify(response.data.payload[0].permitted_users));
            console.log('raw', response.data.payload[0].permitted_users);

            // bckup
            window.sessionStorage.setItem('bck_id', id);
            window.sessionStorage.setItem('bck_ratecardname', response.data.payload[0].name);
            window.sessionStorage.setItem('bck_ratecarddesc', response.data.payload[0].description);
            window.sessionStorage.setItem('bck_selectedRateTypeId', response.data.payload[0].rate_type_id);
            window.sessionStorage.setItem('bck_includedServiceArr', JSON.stringify(response.data.payload[0].services));
            window.sessionStorage.setItem('bck_permittedUserArr', JSON.stringify(response.data.payload[0].permitted_users));
            // callback
            cb();
        });
    }

    onEdit(evt){
        let id = jquery(evt.target)[0].dataset.storeid;
        let scope = this;
        if(id===undefined || id===null) return;
        
        this.setupEditModeById(id, function(){
            let delay = setTimeout(function(){
                clearTimeout(delay);
                window.sessionStorage.setItem('ratecardAction', 'edit');
                scope.context.router.push('/ratecard/add');
            }, 16);
        });
    }

    onViewArchive(evt){
        let id = jquery(evt.target)[0].dataset.storeid;
        let scope = this;
        if(id===undefined || id===null) return;
        
        window.sessionStorage.clear();

        this.setupEditModeById(id, function(){
            window.sessionStorage.setItem('ratecardAction', 'view');
            scope.context.router.push('/ratecard/save');
        });
    }

    onViewActivate(evt){
        let id = jquery(evt.target)[0].dataset.storeid;
        let scope = this;
        if(id===undefined || id===null) return;
        
        window.sessionStorage.clear();

        this.setupEditModeById(id, function(){
            window.sessionStorage.setItem('ratecardAction', 'archive_view');
            scope.context.router.push('/ratecard/save');
        });
    }

    onArchive(evt){
        let id = jquery(evt.target)[0].dataset.storeid;
        let action = jquery(evt.target)[0].dataset.action;
        let scope = this;

        if(id===undefined || id===null) return;

        console.log('before send archived', id, action);

        if(action==='activate'){
            if(confirm('Are you sure you want to activate this Rate Card?')){
                //
            } else {
                return;
            }
        }

        if(action==='archive'){
            if(confirm('Are you sure you want to archive this Rate Card?')){
                //
            } else {
                return;
            }
        }

        postRateCardAction({
            id: id,
            action: action
        }).then(function(response){
            console.log('return', response);
            // alert('Ratecard '+ action +'d successfully');

            toastr.success('Ratecard '+ action +'d successfully');
            
            scope.segregateRateCard(response.data.payload);
        })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
        });
    }

    onCreate(){
        window.sessionStorage.clear();
        window.sessionStorage.setItem('ratecardAction', 'create');
        this.context.router.push('/ratecard/add');
    }

    render(){
        let activeRateCards = <tr><td colSpan={5}>No data.</td></tr>;
        let archiveRateCards = <tr><td colSpan={5}>No data.</td></tr>;
        let scope = this;

        if(this.state.rateCardArr.length !== 0){
            activeRateCards = 
            this.state.rateCardArr.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>{data.version}</td>
                        <td>
                            <button className='btn btn-primary' data-storeid={data.id} onClick={scope.onEdit.bind(scope)}>Edit</button>&nbsp;
                            <button className='btn btn-primary' data-storeid={data.id} onClick={scope.onViewArchive.bind(scope)}>View</button>&nbsp;
                            <button className='btn btn-warning' data-action="archive" data-storeid={data.id} onClick={scope.onArchive.bind(scope)} >Archive</button>
                        </td>
                    </tr>
                )
            })
        }

        if(this.state.archiveRateCardArr.length !== 0){
            archiveRateCards = 
            this.state.archiveRateCardArr.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>{data.version}</td>
                        <td>
                            <button className='btn btn-primary' data-storeid={data.id} onClick={scope.onViewActivate.bind(scope)}>View</button>&nbsp;
                            <button className='btn btn-warning' data-action="activate" data-storeid={data.id} onClick={scope.onArchive.bind(scope)} >Activate</button>
                        </td>
                    </tr>
                )
            })
        }
        

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
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Version</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {activeRateCards}
                            </tbody>
                        </table>

                            <div className='footer-container clearfix'>
                            <button type="button" className="btn btn-primary pull-right" onClick={this.onCreate.bind(this)}>Create Rate Card</button>
                        </div>
                    </div>

                    {/* Archived Rate Card Listing */}
                    <div className='col-md-12'>
                        <h3 className='sky'>Archive Rate Card</h3>

                        <table className='table table-hover table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Version</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {archiveRateCards}
                            </tbody>
                        </table>
                    </div>

            </div>
        <br className="clearfix" /><br />
        </div>
        )
    }
}

RateCard.contextTypes = {
  router: React.PropTypes.object.isRequired
};






















{/* R A T E C A R D  A D D */}
import { AsideRateCard } from './asideRateCard.js';

export class RateCardAdd extends Component {

    constructor(props){
        super(props);
        this.state = {
            ratecardname: "",
            ratecarddesc: ""
        };
    }

    componentWillMount(){
        if(window.sessionStorage.getItem('ratecardname')){
            this.setState({ ratecardname: window.sessionStorage.getItem('ratecardname') });
        }
        if(window.sessionStorage.getItem('ratecarddesc')){
            this.setState({ ratecarddesc: window.sessionStorage.getItem('ratecarddesc') });
        }
    }

    componentDidMount(evt){
        // 
    }

    onRateCardNameHandler(evt){
        this.setState({ ratecardname: evt.target.value });
        window.sessionStorage.setItem('ratecardname', evt.target.value);
    }

    onRateCardDescriptionHandler(evt){
        this.setState({ ratecarddesc: evt.target.value });
        window.sessionStorage.setItem('ratecarddesc', evt.target.value);
    }

    onNext(){
        let ratecarddesc = window.sessionStorage.getItem('ratecarddesc') || "";
        let ratecardname = window.sessionStorage.getItem('ratecardname')  || "";

        // if(ratecardname.length===0 || ratecarddesc.length===0){
        //     if(confirm('Kindly input rate card name or rate card decription')){
        //         return;
        //     }
        //     return;
        // }

        if(ratecardname.length===0){
            toastr.error('No ratecard name specified.');
            return;
        }

        if(ratecarddesc.length===0){
            toastr.error('No ratecard description specified.');
            return;
        }

        this.context.router.push('/ratecard/choose');
    }

    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>
                        <div className='form-group'>
                            <label>Rate Card name</label>
                            <input className='form-control' type='text' value={this.state.ratecardname} onChange={this.onRateCardNameHandler.bind(this)} />
                            <label>Rate Card Description</label>
                            <input className='form-control' type='text' value={this.state.ratecarddesc} onChange={this.onRateCardDescriptionHandler.bind(this)} />
                        </div>
                        
                        <Link className='btn btn-default pull-left' to='/ratecard'>Back</Link>
                    {/*<Link className='btn btn-primary pull-right' to='/ratecard/choose'>Next</Link>*/}
                        <button type="button" className="btn btn-primary pull-right" onClick={this.onNext.bind(this)}>Next</button>
                    </div>

                </div>

            <br className="clearfix" /><br />
            </div>
        )
    }
}

RateCardAdd.contextTypes = {
  router: React.PropTypes.object.isRequired
};






















{/* R A T E C A R D  C H O O S E */}
export class RateCardChoose extends Component {

    constructor(props){
        super(props);
        this.state = {
            rateTypeValue: 0,
            rateTypeArr: [],

            serviceArr: [],
            includedServiceArr: [],
            selectedRateTypeId: 0,
            totalServices: 0,
        }
    }

    componentWillMount(){
        // Update when available
        let arr = JSON.parse(window.sessionStorage.getItem('includedServiceArr')) || [];
        let scope = this;
        let id = 0;
        let wsratetypeid = window.sessionStorage.getItem('selectedRateTypeId');

        console.log('/RatecardChoose', arr);

        if(arr.length!==0){
            this.setState({ totalServices: arr.length });
            this.setState({ includedServiceArr: arr });
        }

        // getRateTypes
        getServiceRateTypes().then(function(response){
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                scope.setState({ rateTypeArr: response.data.payload });        

                if(wsratetypeid){
                    id = wsratetypeid;
                    scope.setState({rateTypeValue: id});
                } else {
                    // Fetch rateType automatically
                    id = scope.state.rateTypeArr[0].id;
                    window.sessionStorage.setItem('selectedRateTypeId', id);
                    scope.setState({rateTypeValue: id});
                }
                
                getRateCardServicesById(id).then(function(response){
                    console.log('get_services_by_id', response.data.payload);
                    if(response.data.hasOwnProperty('payload')===false) return;
                    if(response.data.payload.length!==0){
                        scope.setState({ serviceArr: response.data.payload })
                    }
                });
            }
        });
    }

    componentDidMount(){
        //   
    }

    onChangeRateType(evt){
        let id = evt.target.value;
        let scope = this;
        // 
        getRateCardServicesById(id).then(function(response){
            console.log(response.data);
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                scope.setState({ serviceArr: response.data.payload })
            } else {
                scope.setState({ serviceArr: [] });
            }
        });

        this.setState({rateTypeValue: id});

        this.setState({includedServiceArr: []});

        this.setState({ totalServices: 0});

        let resetArr = [];
        
        window.sessionStorage.setItem('includedServiceArr', JSON.stringify(resetArr) );

        window.sessionStorage.setItem('selectedRateTypeId', evt.target.value);
    }

    onCheckBoxHandler(evt){

        let id = jquery( jquery(evt.target)[0] ).val();

        let bool = jquery( jquery(evt.target)[0] ).is(':checked');

        this.updateIncludedServiceArr(id, bool);
        
        this.setState({ totalServices: this.state.includedServiceArr.length});
    }

    updateIncludedServiceArr(id, bool){
        // console.log(id, bool);
        let scope = this;
        let exists = false;
        let currIndex = 0;

        // initial when 0
        if(this.state.includedServiceArr.length===0){
            console.log('once');
            this.state.includedServiceArr.push({ "service_id": id });
            this.setState({ includedServiceArr: this.state.includedServiceArr });

            window.sessionStorage.setItem('includedServiceArr', JSON.stringify(this.state.includedServiceArr) );
            console.log('Included service', window.sessionStorage.getItem('includedServiceArr') );
            return;
        }

        // checking availability
        for (let i = 0; i < this.state.includedServiceArr.length; i++) {
            if (+this.state.includedServiceArr[i].service_id === +id) {
                currIndex = i;
                exists = true;
            }
        }

        if(bool===false){
            this.state.includedServiceArr.splice(currIndex, 1);
        }

        if(exists===false){
            this.state.includedServiceArr.push({ "service_id": id });
        }

        this.setState({ includedServiceArr: this.state.includedServiceArr });

        let updatedArr = JSON.stringify(this.state.includedServiceArr);
        window.sessionStorage.setItem('includedServiceArr', updatedArr);
        
        // console.log('includedServiceArr', window.sessionStorage.getItem('includedServiceArr') );

        console.log('>>', this.state.includedServiceArr.length); 
    }
    
    // getCategoryName(data){
    //     let name = "no-name";
    //     if(data.category!==null){
    //         if(data.category.hasOwnProperty('name')){
    //             name = data.category.name;
    //         }
    //     }
    //     return name;
    // }

    onNext(){
        let selectedRateTypeId = window.sessionStorage.getItem('selectedRateTypeId') || 0;
        let includedServiceArr = window.sessionStorage.getItem('includedServiceArr') || [];
            
        let checkArr = (includedServiceArr.length!==0) ? JSON.parse(includedServiceArr) : [];

        // console.log(selectedRateTypeId, includedServiceArr);

        if(checkArr.length===0){
            // if(confirm('No selected Service')){
            //     return;
            // } else {
            //     return;
            // }
            toastr.error('No selected service(s).');
            return;
        }

        this.context.router.push('/ratecard/permission');
    }

    checkStored(id){
        let bool = false;
        let checkBoxer = JSON.parse(window.sessionStorage.getItem('includedServiceArr')) || this.state.includedServiceArr;
        
        checkBoxer.map(function(data){
            if(+id===+data.service_id){
                bool = true;
            }
        });
        return bool;
    }

    render(){
        let selectRateTypes = <option>No data.</option>;
        let scope = this;

        if(this.state.rateTypeArr.length!==0){
            selectRateTypes =
            this.state.rateTypeArr.map(function(data){
                return (
                    <option key={data.id} value={data.id}>{data.name}</option>
                )
            })
        }

        let servicesDynamic = <tr><td colSpan={5}>No data.</td></tr>      

        if(this.state.serviceArr.length!==0 && this.state.rateTypeArr.length!==0){
            servicesDynamic = 
            this.state.serviceArr.map(function(data){
                if(data.category!==null){
                    return (
                        <tr key={data.id}>
                            <td>
                                <label data-storeid={data.id} 
                                    onChange={scope.onCheckBoxHandler.bind(scope)}>
                                    <input type="checkbox" value={data.id} defaultChecked={scope.checkStored(data.id)}/>
                                    <span>{data.service_id}</span>
                                </label>
                            </td>
                            <td>{data.category.name}</td>
                            <td>
                                {data.name}
                            </td>
                            <td>
                                {data.description}
                            </td>
                            <td>
                                {+data.subtotal}
                            </td>
                        </tr>
                    )
                }
            });
        }

        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>

                        <div className='rc-type'>
                            <label><span>Rate Type &nbsp;&nbsp;</span></label>
                            <select value={this.state.rateTypeValue} onChange={this.onChangeRateType.bind(this)}>
                                {selectRateTypes}
                            </select>
                        </div>
                    
                    <div className='service-checklist'>
                        <div className="table-responsive">
                            <table className='table table-hover table-bordered table-striped table-responsive'>
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
                                    {servicesDynamic}
                                </tbody>                           
                            </table>
                        </div>

                        <hr />

                        <div className='selected-count'>Total Services:&nbsp;<span>{this.state.totalServices}</span></div>
                    </div>

                    <br />

                    <Link className='btn btn-default pull-left' to='/ratecard/add'>Back</Link>

                    <button type="button" className="btn btn-primary pull-right" onClick={this.onNext.bind(this)}>Next</button>
                    
                    {/*<Link className='btn btn-primary pull-right' to='/ratecard/permission'>Next</Link>*/}

                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}

RateCardChoose.contextTypes = {
  router: React.PropTypes.object.isRequired
};





















{/* R A T E C A R D  P E R M I S S I O N */}
import {PermissionEditor} from '../../common/permissionEditor/permissionEditor.js';

export class RateCardPermission extends Component {
    constructor(props){
        super(props);
        this.state = {
            permittedUserArr: []
        };     
    }

    componentDidMount(){
        // 
    }

    componentWillMount(){
        let arr = JSON.parse(window.sessionStorage.getItem('permittedUserArr')) || [];
        
        console.log('RateCardPermission', arr);

        if(arr.length!==0){
            this.setState({permittedUserArr: arr});
        }
    }

    callbackonUpdateArray(arrObject){
        console.log('callback to parent', arrObject);

        this.setState({permittedUserArr: arrObject});
        window.sessionStorage.setItem('permittedUserArr', JSON.stringify(arrObject) );
    }
    
    onNext(){
        let arr = JSON.parse(window.sessionStorage.getItem('permittedUserArr')) || [];
        if(arr.length===0){
            // if(confirm('No selected user')){
            //     return;
            // }else{
            //     return;
            // }
            toastr.error('No selected user(s).');
            return;
        }
        this.context.router.push('/ratecard/save');
    }

    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>
                
                <div className='package-content'>

                    <div className='col-md-12'>
                        
                        <PermissionEditor 
                        users={this.state.permittedUserArr} 
                        onUpdateArray={this.callbackonUpdateArray.bind(this)} />

                        <br />

                        <Link className='btn btn-default pull-left' to='/ratecard/choose'>Back</Link>
                        <button type="button" className="btn btn-primary pull-right" onClick={this.onNext.bind(this)}>Next</button>
                        {/*<Link className='btn btn-primary pull-right' to='/ratecard/save'>Next</Link>*/}
                    </div>
                </div>

            <br className="clearfix" /><br />
            </div>
        )
    }
}

RateCardPermission.contextTypes = {
  router: React.PropTypes.object.isRequired
};





















{/* R A T E C A R D  E D I T */}
export class RateCardEdit extends Component {

    constructor(props){
        super(props);
    }

    componentWillMount(){

    }

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

{/* R A T E C A R D  V I E W */}
export class RateCardView extends Component {
    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>
                        XXX
                        
                        <Link className='btn btn-default pull-left' to='/ratecard'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/ratecard/choose'>Next</Link>
                    </div>

                </div>

            <br className="clearfix" /><br />
            </div>
        )
    }
}

























{/* R A T E C A R D  S A V E */}
import {CategoryTreeView} from '../../common/categoryTreeView/categoryTreeView.js';
import {PermissionView} from '../../common/permissionView/permissionView.js';
import {postRateCardCreate, postRateCardUpdate, postRateCardPreview} from '../../common/http';

export class RateCardSave extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: "",
            rate_type_id: 0,
            service_ids: "",
            permitted_user_ids: "",
            serviceCategory: [],
            enableSave: true,
            isChanged: '0',
            isViewMode: false,
        }
    }

    // FIRST CHECK SESSION then change state
    componentWillMount(){
        if(window.sessionStorage.getItem('ratecardname')) this.setState({ name : window.sessionStorage.getItem('ratecardname') });
        if(window.sessionStorage.getItem('ratecarddesc')) this.setState({ description : window.sessionStorage.getItem('ratecarddesc') });
        if(window.sessionStorage.getItem('selectedRateTypeId')) this.setState({ rate_type_id : window.sessionStorage.getItem('selectedRateTypeId') });
        if(window.sessionStorage.getItem('permittedUserArr')) this.setState({ permitted_user_ids : window.sessionStorage.getItem('permittedUserArr') });

        // Prepare Service Category
        let includedServiceArr = JSON.parse(window.sessionStorage.getItem('includedServiceArr')) || []; 
        let scope = this;

        let servicesWithOrder = [];
        if(includedServiceArr.length!==0){
            includedServiceArr.map(function(data, index){
                servicesWithOrder.push({ service_id: data.service_id, order: index });
            });

            let json = JSON.stringify(servicesWithOrder);
            let id = window.sessionStorage.getItem('id') || 0;
            let ratecardAction = window.sessionStorage.getItem('ratecardAction') || null;

            console.log('current selected services:', json, id); 

            switch(ratecardAction){
                case 'view': case 'archive_view': 
                postRateCardPreview({rate_card_id: parseInt(id) })
                .then(function(response){
                    console.log('ratecard/save/view_only', response, parseInt(id));
                    scope.setState({ serviceCategory: response.data.payload });
                });
                scope.setState({isViewMode:true});
                
                break;
                ///
                case 'edit':
                    let isRetain = window.sessionStorage.getItem('includedServiceArr')===window.sessionStorage.getItem('bck_includedServiceArr');
                    console.log('using edit_mode, isRetain:', isRetain);

                    if(isRetain){
                        postRateCardPreview({rate_card_id: parseInt(id)})
                        .then(function(response){
                            console.log('ratecard/save/edit_only', response, parseInt(id));
                            scope.setState({ serviceCategory: response.data.payload });
                        });
                    } else {
                        postRateCardPreview({service_ids: json, rate_card_id: parseInt(id)})
                        .then(function(response){
                            console.log('ratecard/save/edit_only', response, parseInt(id));
                            scope.setState({ serviceCategory: response.data.payload });
                        });
                    }
                break;
                ///
                case 'create':
                postRateCardPreview({ service_ids: json })
                .then(function(response){
                    console.log('ratecard/save/create_only', response);
                    scope.setState({ serviceCategory: response.data.payload });
                });
                break;
            }
        }
    }

    componentDidMount(){
        //
    }
    
    callbackUpdateServiceCategory(serviceCategory){
        this.setState({serviceCategory});
    }

    getChanges(){
        let changed = '0';
        
        if(window.sessionStorage.getItem('bck_ratecardname')!==this.state.name){
            changed = '1';
            console.log('#1', window.sessionStorage.getItem('bck_ratecardname'), this.state.name);
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_ratecarddesc')!==this.state.description){
            changed = '1';
            console.log('#2', window.sessionStorage.getItem('bck_ratecarddesc'), this.state.description);
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_selectedRateTypeId')!==this.state.rate_type_id){
            changed = '1';
            console.log('#3', window.sessionStorage.getItem('bck_selectedRateTypeId'), this.state.rate_type_id);
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_includedServiceArr')!==window.sessionStorage.getItem('includedServiceArr')){
            changed = '1';
            console.log('#4', window.sessionStorage.getItem('bck_includedServiceArr'));
            console.log('#4', JSON.stringify(this.state.service_ids));
            console.log('------------------------------');
        }
        if(window.sessionStorage.getItem('bck_permittedUserArr')!==this.state.permitted_user_ids){
            changed = '1';
            console.log('#5', window.sessionStorage.getItem('bck_permittedUserArr'), this.state.permitted_user_ids);
            console.log('------------------------------');
        }
        if(this.state.isChanged==='1'){
            changed = '1';
        }
        console.log('changed:', changed);

        return changed;
    }

    onSave(){
        let scope = this;
        let ratecardAction = window.sessionStorage.getItem('ratecardAction') || null;
        let id = window.sessionStorage.getItem('id') || 0;

        console.log('ratecardAction:', ratecardAction, 'id:', id);

        // View
        if(ratecardAction==='view' && this.state.enableSave===true){
            window.sessionStorage.setItem('ratecardAction','edit');
            this.setState({isViewMode:false});
            this.context.router.push('/ratecard/add');

        // Update
        } else if( ratecardAction==='edit' && this.state.enableSave===true){
            console.log('update');

            let service_ids = [];
            this.state.serviceCategory.map(function(data){
                service_ids = service_ids.concat(data.services);
            });

            this.setState({service_ids}, function(){
                postRateCardUpdate({
                has_changed: scope.getChanges(),
                id: id,
                name: scope.state.name,
                description: scope.state.description,
                rate_type_id: scope.state.rate_type_id,
                service_ids: JSON.stringify(service_ids),
                permitted_user_ids: scope.state.permitted_user_ids,

                }).then(function(response){
                    console.log(response);

                    // alert('Rate Card Updated.');
                    toastr.success('Rate Card Updated.');

                    scope.context.router.push('/ratecard');
                })
                .catch(function(response){
                    if(response.data.error){
                        // alert(response.data.message);
                        toastr.error(response.data.message);
                    }
                });
            });
            
        // Create
        } else if(ratecardAction==='create' && this.state.enableSave===true){
            console.log('create');

            let service_ids = [];
            this.state.serviceCategory.map(function(data){
                service_ids = service_ids.concat(data.services);
            });

            console.log(JSON.stringify(service_ids));

            postRateCardCreate({
            name: this.state.name,
            description: this.state.description,
            rate_type_id: this.state.rate_type_id,
            service_ids: JSON.stringify(service_ids),
            permitted_user_ids: this.state.permitted_user_ids,

            }).then(function(response){
                console.log(response);
                
                // alert('Created new RateCard Successfully.');
                toastr.success('Rate card added successfully.');

                scope.context.router.push('/ratecard');
            })
            .catch(function(response){
                if(response.data.error){
                    // alert(response.data.message);
                    toastr.error(response.data.message);
                }
            });
        }
    }

    callbackOndrag(){
        this.setState({enableSave:false});
    }

    callbackOndrop(changeService){
        console.log('services/output/ratecard/save', changeService.json);
        
        if(this.state.serviceCategory.length===0) return;

        this.state.serviceCategory.map(function(data){
            let services = data.services;
                (function(array){
                    array.map(function(servicesData){
                        changeService.json.map(function(changeData){   
                            if(+servicesData.id === +changeData.id){
                                servicesData.order = changeData.order;
                                console.log('called', data);
                            }
                        })
                    });
                })(services);
        });

        console.log('before send', JSON.stringify(this.state.serviceCategory));

        this.setState({serviceCategory: this.state.serviceCategory}, function(){
            this.setState({enableSave: true});
        });

        this.setState({isChanged:changeService.changed});
    }

    onBack(){
        let ratecardAction = window.sessionStorage.getItem('ratecardAction');
        if(ratecardAction==='view' || ratecardAction==='archive_view'){
            this.context.router.push('/ratecard');
        } else{
            this.context.router.push('/ratecard/permission');
        }
    }

    onActivateRateCard(){
        let scope = this;
        let id = window.sessionStorage.getItem('id'); 

        if(confirm('Are you sure you want to activate this Rate Card?')){
            //
        } else {
            return;
        }

        postRateCardAction({
            id: id,
            action: 'activate'
        }).then(function(response){
            if(response.data.payload.length!==0){
                // alert('Rate card activated successfully.');
                toastr.success('Rate card activated successfully.');

                scope.context.router.push('/ratecard');
            }
        })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
        });
    }

    render(){
        let ratecardAction = window.sessionStorage.getItem('ratecardAction') || null;
        let rightButton = <button className="btn btn-primary disabled">Back</button>;

        if(ratecardAction!==null){
            if(ratecardAction ==='archive_view' ){
                rightButton =
                 <button 
                    type="button" 
                    className="btn btn-warning pull-right" 
                    onClick={this.onActivateRateCard.bind(this)}>Activate</button>
            
            } else {
                rightButton =
                <button 
                    type="button" 
                    className={"btn btn-primary pull-right " + (this.state.enableSave ? '' : 'disabled')} 
                    onClick={this.onSave.bind(this)}>{ (this.state.isViewMode ? 'Edit' : 'Save') }
                </button>
            }
        }

        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>

                <div className='package-content'>

                    <div className='col-md-12'>

                        <CategoryTreeView
                            serviceCategory={this.state.serviceCategory}
                            ratecardname={this.state.name}
                            ratecarddesc={this.state.description}
                            onUpdateServiceCategory={this.callbackUpdateServiceCategory.bind(this)}
                            onDrag={this.callbackOndrag.bind(this)}
                            onDrop={this.callbackOndrop.bind(this)}
                         />

                        <br />

                        <h3>Rate Card Permission</h3>
                        
                        <PermissionView permittedUser={this.state.permitted_user_ids}/>

                        <br />
                    
                        <button 
                            type="button" 
                            className="btn btn-default pull-left" 
                            onClick={this.onBack.bind(this)}>Back
                        </button>

                        {rightButton}
                    </div>
                </div>

                <br className="clearfix" /><br />
            </div>
        )
    }
}

RateCardSave.contextTypes = {
  router: React.PropTypes.object.isRequired
};
