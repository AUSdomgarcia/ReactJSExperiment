import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';

import {PersonnelEditor} from '../../common/_personnelEdit/personnelEdit';

export class Personnel extends Component {
  render() {
    return (
      <div>

        <div className='header-wrap'>
          <h3 className='sky'>Personnel</h3>
          <small>Create New Personnel</small>
        </div>
        
        <br />
          
        <PersonnelEditor btnName='Add'/>

        <br />

        <div className='search-wrap'>
          <div className='col-xs-8'>col-xs-8</div>

          <div className='col-xs-4'>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for..." />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button">Go!</button>
              </span>
            </div>
          </div>
        
        <br />
        </div>

        <br />

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
    
    <br />
    </div>
    )
  }
}


export class PersonnelEdit extends Component {
  render(){

    return (
      <div>

        <div className='header-wrap'>
          <h3 className='sky'>Personnel</h3>
          <small>Create New Personnel</small>
        </div>
        
        <br />
          
        <PersonnelEditor btnName='Update'/>

        <br />

        <div className='search-wrap'>
          <div className='col-xs-8'>...</div>

          <div className='col-xs-4'>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for..." />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button">Go!</button>
              </span>
            </div>
          </div>
        
        <br />
        </div>

        <br />

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
    
    <br />
    </div>
    )
  }
}