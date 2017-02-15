import React, {Component} from 'react';
import './connectedTable.scss';
import {getRateCards} from '../../common/http';

export class ConnectedTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            ratecards: [],
            ratecard_id: 0,
        }
    }

    componentDidMount(){
        //
    }

    componentWillMount(){
        let scope = this;

        getRateCards().then(function(response){
            if(response.data.payload.length!==0){
                scope.setState({ratecards:response.data.payload});
                scope.manageRateType(response);
            }
        });
    }

    manageRateType(res){
        let WSratecardId = window.sessionStorage.getItem('rateCardId');

        if(WSratecardId){
            this.setState({ratecard_id: WSratecardId});
        } else {
            this.setState({ratecard_id: res.data.payload[0].id});
        }

        // do some server request
    }
    
    onSelectRateCard(evt){
        let id = evt.target.value;
        let scope = this;

        if(id===null || id===undefined) return;

        this.setState({ratecard_id: id});
        window.sessionStorage.setItem('rateCardId', id);
    }
    
    render(){
        let ratecardOptions = <option>No options.</option>

        if(this.state.ratecards.length!==0){
            ratecardOptions = 
            this.state.ratecards.map(function(data){
                return (
                    <option value={data.id} key={data.id}>{data.name}</option>
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
                            <tr>
                                <td>S-001</td>
                                <td>Digital Strategy</td>
                                <td>Digital Consultation</td>
                                <td>Is a global Solutions</td>
                                <td>70,000</td>
                                <td>
                                    <button className='btn btn-primary'>Add</button>
                                </td>
                            </tr>
                            
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
                            <tr>
                                <td>S-001</td>
                                <td>Digital Strategy</td>
                                <td>Digital Consultation</td>
                                <td>Is a global Solutions</td>
                                <td>70,000</td>
                                <td>
                                    <button className='btn btn-danger'>Remove</button>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}