import React, {Component} from 'react';
import './connectedTable.scss';
import {getRateCardsActive, getRateCardById} from '../../common/http';
import xhr from 'jquery';

export class ConnectedTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            ratecards: [],
            services:[],
            added_services:[],
            ratecard_id: 0,
        }
    }

    componentDidMount(){
        //
    }

    componentWillMount(){
        let scope = this;
        
        if(this.props.addedServices!==this.state.added_services){
            this.setState({added_services:this.props.addedServices});
        }

        getRateCardsActive().then(function(response){
            console.log('getRateCards', response);
            if(response.data.hasOwnProperty('payload')){
                if(response.data.payload.length!==0){
                    scope.setState({ratecards:response.data.payload});
                    scope.manageSelectedRateCard(response);
                }
            }
        });
    }

    manageSelectedRateCard(res){
        let scope = this;
        let WSratecardId = +window.sessionStorage.getItem('rateCardId') || 0;
        let id = 0;

        if(WSratecardId!==0){
            id = WSratecardId;
        } else {
            id = res.data.payload[0].id;
        }
        this.setState({ratecard_id: id});
        this.getRateCardServicesById(id);
    }

    getRateCardServicesById(id){
        let scope = this;
        getRateCardById(id).then(function(response){
            console.log('/getServices_byRateCardId', response);
            if(response.data.hasOwnProperty('payload')){
                if(response.data.payload.length!==0){
                    let services = response.data.payload[0].services;
                    scope.setState({services});
                }
            }
        });
    }
    
    onSelectRateCard(evt){
        let id = evt.target.value;
        if(id===null || id===undefined) return;

        this.setState({ratecard_id: id});
        this.getRateCardServicesById(id);
        window.sessionStorage.setItem('rateCardId', id);

        let empty = [];
        window.sessionStorage.setItem('added_services', JSON.stringify(empty));
        this.setState({added_services: empty}, function(){
            this.props.onUpdate(this.state.added_services);
        });
    }

    onAddService(evt){
        let index = xhr(evt.target)[0].dataset.index;
        let id = xhr(evt.target)[0].dataset.id;

        if(id===null || id===undefined) return;
        let exists = false;
        let currIndex = 0;
        let services = this.state.services;

        if(this.state.added_services.length===0){
            this.state.added_services.push(services[index]);
            this.setState({added_services:this.state.added_services});
            window.sessionStorage.setItem('added_services', JSON.stringify(this.state.added_services));
            this.props.onUpdate(this.state.added_services);
            return;
        }
        // Check Availability
        for (let i = 0; i < this.state.added_services.length; i++) {
            if (+this.state.added_services[i].id === +id) {
                currIndex = i;
                exists = true;
            }
        }

        if(exists===true){
            if(confirm('Already in use.')){return;} else {return;}
        }
        if(exists===false){
            this.state.added_services.push(services[index]);
        }
        this.setState({added_services: this.state.added_services});
        this.props.onUpdate(this.state.added_services);
    }

    onRemoveService(evt){
        let index = xhr(evt.target)[0].dataset.index;
        if(index===undefined || index===null) return;

        this.state.added_services.splice(index, 1);
        this.setState({added_services: this.state.added_services});
        this.props.onUpdate(this.state.added_services);
    }
    
    render(){
        let scope = this;
        let ratecardOptions = <option>No options.</option>;
        let servicesTable = <tr><td colSpan={6}>No data.</td></tr>;
        let addedServicesTable = <tr><td colSpan={6}>No data.</td></tr>;

        if(this.state.ratecards.length!==0){
            ratecardOptions = 
            this.state.ratecards.map(function(data){
                return (
                    <option value={data.id} key={data.id}>{data.name}</option>
                )
            });
        }

        if(this.state.services.length!==0){
            servicesTable =
            this.state.services.map(function(data, index){
                return (
                    <tr key={data.id}>
                        <td>{data.service_id}</td>
                        <td>{data.category.name}</td>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>{data.subtotal}</td>
                        <td>
                            <button type="button" 
                            data-index={index}
                            data-id={data.id}
                            className="btn btn-primary" 
                            onClick={scope.onAddService.bind(scope)}>Add</button>
                        </td>
                    </tr>
                )
            });
        }

        if(this.state.added_services.length!==0){
            addedServicesTable =
            this.state.added_services.map(function(data, index){
                return (
                    <tr key={data.id}>
                        <td>{data.service_id}</td>
                        <td>{data.category.name}</td>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>{data.subtotal}</td>
                        <td>
                            <button type="button" 
                            data-index={index}
                            data-id={data.id} 
                            className="btn btn-danger" 
                            onClick={scope.onRemoveService.bind(scope)}>Remove</button>
                        </td>
                    </tr>
                )
            });
        }

        return (
            <div>
                <div className='rc-type'>
                    <label><span>Rate Card &nbsp;&nbsp;</span></label>
                    <select value={this.state.ratecard_id} onChange={this.onSelectRateCard.bind(this)}>
                        {ratecardOptions}
                    </select>
                </div>
                
                <br />
                
                <div className='service-listing'>
                    <h4>Services</h4>

                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Category</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {servicesTable}
                        </tbody>
                    </table>
                </div>

                <br />

                <div className='added-services'>
                    <h4>Added Services</h4>
                    
                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Category</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {addedServicesTable}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}