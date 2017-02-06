import React, {Component} from 'react';
import './connectedTable.scss';

export default class ConnectedTable extends Component {

    constructor(props){
        super(props)
    }
    
    render(){
        return (
            <div>
                <div className='rc-type'>
                    <label><span>Rate Card &nbsp;&nbsp;</span></label>
                    <select>
                        <option>Standard</option>
                        <option>Cheap</option>
                        <option>Expensive</option>
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