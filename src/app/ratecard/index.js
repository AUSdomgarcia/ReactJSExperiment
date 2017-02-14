import React, {Component} from 'react';
import {Link} from 'react-router';

import xhr from 'jquery';

import './ratecard.scss';
import { 
    getRateCards,
    getServiceRateTypes,
    getRateCardServicesById,
    getRateCardsPersonnelEmployees } from '../../common/http';

export class RateCard extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            rateCardArr: [],
            archiveRateCardArr: []
        };
    }

    componentDidMount(){
        let scope = this;
        getRateCards().then(function(response){
            console.log('response', response);
            if(response.data.payload.length!==0){
                return;
                // filter archive and ratecard
                scope.setState({rateCardArr:response.data.payload});
                scope.setState({archiveRateCardArr:response.data.payload});
            }
        });
    }

    componentWillMount(){
        //
    }

    handleEdit(evt){
        this.context.router.push('/ratecard/edit')
    }
    
    render(){
        let activeRateCards = null;
        let archiveRateCards = null;

        if(this.state.rateCardArr.length !== 0){
            activeRateCards = 
            this.state.rateCardArr.map(function(data){
                return (
                    <tr>Some tables tds</tr>
                )
            })
        }

        if(this.state.archiveRateCardArr.length !== 0){
            archiveRateCards = 
            this.state.archiveRateCardArr.map(function(data){
                return (
                    <tr>Some tables tds</tr>
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
                                        <button className='btn btn-primary' onClick={this.handleEdit.bind(this)}>Edit</button>
                                        <button className='btn btn-primary'>View</button>
                                        <button className='btn btn-warning'>Archive</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className='footer-container clearfix'>
                            <Link to='/ratecard/add' className='btn btn-primary pull-right'>Create Rate Card</Link> {/* <------------------------------------- CREATE CARD */}
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
        let ratecarddesc = window.sessionStorage.getItem('ratecarddesc');
        let ratecardname = window.sessionStorage.getItem('ratecardname');

        if(ratecardname.length===0 || ratecarddesc.length===0){
            if(confirm('Kindly input rate card name or rate card decription')){
                return;
            }
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
        let arr = JSON.parse(window.sessionStorage.getItem('includedServiceArr'));

        console.log('/RatecardChoose', arr);

        if(arr.length!==0){
            this.setState({ includedServiceArr: arr });
        }
        this.setState({ totalServices: this.state.includedServiceArr.length });

        let scope = this;
        let id = 0;
        let wsratetypeid = window.sessionStorage.getItem('selectedRateTypeId');

        getServiceRateTypes().then(function(response){
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
            if(response.data.payload.length!==0){
                scope.setState({ serviceArr: response.data.payload })
            }
        });

        this.setState({rateTypeValue: id});

        this.setState({includedServiceArr: []});

        this.setState({ totalServices: 0});
        
        window.sessionStorage.setItem('includedServiceArr', JSON.stringify(this.state.includedServiceArr) );

        window.sessionStorage.setItem('selectedRateTypeId', evt.target.value);
    }

    onCheckBoxHandler(evt){

        let id = xhr( xhr(evt.target)[0] ).val();

        let bool = xhr( xhr(evt.target)[0] ).is(':checked');

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

        window.sessionStorage.setItem('includedServiceArr', JSON.stringify(this.state.includedServiceArr) );
        
        console.log('includedServiceArr', window.sessionStorage.getItem('includedServiceArr') );
    }
    
    getCategoryName(data){
        let name = "no-name";
        if(data.category!==null){
            if(data.category.hasOwnProperty('name')){
                name = data.category.name;
            }
        }
        return name;
    }

    onNext(){
        let selectedRateTypeId = window.sessionStorage.getItem('selectedRateTypeId');
        let includedServiceArr = window.sessionStorage.getItem('includedServiceArr');
            
        let checkArr = JSON.parse(includedServiceArr);

        console.log(selectedRateTypeId, includedServiceArr);

        if(checkArr.length===0){
            if(confirm('No selected Service')){
                return;
            } else {
                return;
            }
        }

        this.context.router.push('/ratecard/permission');
    }

    checkStored(id){
        let bool = false;
        let checkBoxer = JSON.parse(window.sessionStorage.getItem('includedServiceArr'));
        
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
                return (
                    <tr key={data.id}>
                        <td>
                            <label data-storeid={data.id} 
                                onChange={scope.onCheckBoxHandler.bind(scope)}>
                                <input type="checkbox" value={data.id} defaultChecked={scope.checkStored(data.id)}/>
                                <span>{data.service_id}</span>
                            </label>
                        </td>
                        <td>
                            { scope.getCategoryName(data) }
                        </td>
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
        let arr = JSON.parse(window.sessionStorage.getItem('permittedUserArr'));
        
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
        let arr = JSON.parse(window.sessionStorage.getItem('permittedUserArr'));
        if(arr.length===0){
            if(confirm('No selected user')){
                return;
            }else{
                return;
            }
        }
        this.context.router.push('/ratecard/save');
    }

    render(){
        
        return(
            <div>
                <AsideRateCard path={this.props.location.pathname}/>
                
                <div className='package-content'>

                    <div className='col-md-12'>
                        
                        <PermissionEditor defaultArr={this.state.permittedUserArr} onUpdateArray={this.callbackonUpdateArray.bind(this)} />

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
