import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';

import {PersonnelInputField} from '../../common/_personnel/personnelInputField';
import {PersonnelList} from '../../common/_personnel/personnelList';

export class Personnel extends Component {
  render() {
    return (
      <div>
        <div className='header-wrap'>
          <h3 className='sky'>Personnel</h3>
          <small>Create New Personnel</small>
        </div>
              
        <PersonnelInputField btnName='Add'/>

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
        </div>
      
        <PersonnelList />
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
              
        <PersonnelInputField btnName='Update'/>

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
        </div>
      
        <PersonnelList />
      </div>
    )
  }
}