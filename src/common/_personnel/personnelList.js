import React, {Component} from 'react';
import {Link} from 'react-router';

import './personnelEdit.scss';

export class PersonnelList extends Component {
    render(){
        return (
            <div className='personnel-list'>
                <table className='table table-bordered table-hover table-striped'>
                    <thead>
                    <tr>
                        <th>Rate Type</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Manhour Rate</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>Standard</td>
                        <td>Creative Officer</td>
                        <td>Creatives</td>
                        <td>2000</td>
                        <td>
                        <Link className='btn btn-primary' to='/personnel/edit'>Edit</Link>
                        <button className='btn btn-danger'>Delete</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}