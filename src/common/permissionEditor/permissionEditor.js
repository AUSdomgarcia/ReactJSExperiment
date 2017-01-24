import React, {Component} from 'react';
import './permissionEditor.scss';

export default class PermissionEditor extends Component {
    render(){
        return(
            <div>

                <h4>Choose user to give permission</h4>
                        
                <div className='input-group'>
                    <span className='input-group-btn'>
                        <button className='btn btn-default' type='button'>
                            <i className='fa fa-search'></i>
                        </button>
                    </span>
                    <input type='text' className='form-control' placeholder='Search for...' />
                </div>

                <br />

                {/* Searched People */}
                <div className='searched-people'>
                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Monica Climaco</td>
                                <td>
                                    <button className='btn btn-primary'>Add</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Dominador Garcia</td>
                                <td>
                                    <button className='btn btn-primary'>Add</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Permitted People */}
                <div className='permitted-people'>
                    <h4>Permitted User</h4>

                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Monica Climaco</td>
                                <td>
                                    <button className='btn btn-danger'>Remove</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Dominador Garcia</td>
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