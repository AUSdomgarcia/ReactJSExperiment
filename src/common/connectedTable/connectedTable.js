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

    componentDidMount(){}

    checkForDuplicate(exclude, overall){
        exclude.map(function(data1, index, arr1){
            overall.map(function(data2, parentIndex){
                if(+data1.id === +data2.id){
                    overall.splice(parentIndex, 1);
                }
            });
        });
        return overall;
    }

    componentWillMount(){
        let scope = this;
        
        if(this.props.addedServices!==this.state.added_services){
            this.setState({added_services:this.props.addedServices},

            // #1    
            function(){
                getRateCardsActive().then(function(response){
                    console.log('getRateCards active', response);

                        if(response.data.payload.length!==0){
                            scope.setState({ratecards: response.data.payload});
                            // #2
                            scope.manageSelectedRateCard(response);
                        }
                });
            });
        }
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
        
        window.sessionStorage.setItem('rateCardId', id);

        // #3
        this.getRateCardServicesById(id);
    }

    getRateCardServicesById(id){
        let scope = this;
        getRateCardById(id).then(function(response){
            console.log('/getServices_packages_ratecard_by_id', response);

            if(response.data.payload.length!==0){
                let serviceDisplay = scope.checkForDuplicate(scope.state.added_services, 
                                                            response.data.payload[0].services);

                console.log('1', scope.state.added_services);
                console.log('2', response.data.payload[0].services);

                // #4                               
                scope.setState({services: serviceDisplay});
            }
        });
    }
    
    onSelectRateCard(evt){
        let id = evt.target.value;
        let scope = this;
        if(id===null || id===undefined) return;

        this.setState({ratecard_id: id}, function(){
            scope.getRateCardServicesById(id);
            window.sessionStorage.setItem('rateCardId', id);
        });

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
        let scope = this;

        if(this.state.added_services.length===0){
            this.state.added_services.push(services[index]);

            this.setState({added_services:this.state.added_services});

            // window.sessionStorage.setItem('added_services', JSON.stringify(this.state.added_services));

            let selected_id = services[index].id;

            this.state.services.map(function(data, index, arr){
                if(+data.id === +selected_id){
                    scope.state.services.splice(index, 1);
                }
                if(index===arr.length-1){
                    scope.setState({services: scope.state.services});
                }
            });

            this.props.onUpdate(this.state.added_services);
            // console.log(services[index]);
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
            let selected_id = services[index].id;

            console.log('called.', selected_id);

            let spliced_idx = null;

            this.state.services.map(function(data, idx, arr){
                console.log(data.id, +selected_id)
                
                if(+data.id === +selected_id){
                    spliced_idx = idx;
                }

                if(idx === arr.length-1){

                    let service = scope.state.services.splice(spliced_idx, 1)[0];

                    scope.state.added_services.push(service);

                    scope.setState({services: scope.state.services});

                    scope.setState({added_services: scope.state.added_services},

                    // update
                    function(){
                        scope.props.onUpdate(scope.state.added_services);
                    });
                }
            });
        }
    }

    onRemoveService(evt){
        let scope = this;
        let index = xhr(evt.target)[0].dataset.index;
        if(index===undefined || index===null) return;

        let service = this.state.added_services.splice(index, 1)[0];
        let temp = this.state.services;
            temp.push(service);

        this.setState({ services: temp });

        this.setState({added_services: this.state.added_services}, function(){
            scope.props.onUpdate(this.state.added_services);
        }); 
    }
    
    render(){
        let scope = this;
        let ratecardOptions = <option>Loading..</option>;
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