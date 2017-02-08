import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';

import {PersonnelInputField} from '../../common/_personnel/personnelInputField';
import {PersonnelList} from '../../common/_personnel/personnelList';

import xhr from 'jquery';

export class Personnel extends Component {

  constructor(props){
      super(props);

      this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";

      this.state = {
        rateTypeArr: [],
        editData: []
      }
  }

  callbackAddPersonnel(addValue){
    this.setState({rateTypeArr:addValue});
  }

  callbackDeletePersonnel(deleteVal){
    this.setState({rateTypeArr:deleteVal});  
  }
  callbackEditPersonnel(id, ratetype_id, dapartment_id, position_id, manhour ){
    
  }
  
  render() {
    return (
      <div>
        <div className='header-wrap'>
          <h3 className='sky'>Personnel</h3>
          <small>Create New Personnel</small>
        </div>
              
        <PersonnelInputField isEdit={false} btnName='Add' onSuccess={this.callbackAddPersonnel.bind(this)}/>

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
          
          <br className="clearfix"/>
        </div>

        <PersonnelList onEdit={this.callbackEditPersonnel.bind(this)} updatedRateType={this.state.rateTypeArr} onDelete={this.callbackDeletePersonnel.bind(this)}/>

      </div>
    )
  }
}


export class PersonnelEdit extends Component {

  constructor(props){
      super(props);
      this.state = {
        rateTypeArr: [],
        editData: []
      }
  }

  componentDidMount(){
    // console.log('ON EDIT ONLY', this.props.location.query , this.props.params.value);
    let scope = this;
      xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
          scope.setState({ rateTypeArr: data.payload });
      });
  }

  callbackAddPersonnel(addValue){
    this.setState({rateTypeArr:addValue});
  }

  callbackDeletePersonnel(deleteVal){
    this.setState({rateTypeArr:deleteVal});  
  }

  callbackEditPersonnel(id, ratetype_id, dapartment_id, position_id, manhour ){
    this.setState({editData: [] });
    this.state.editData.push( { id: id, rid: ratetype_id, did: dapartment_id, pid: position_id, mh: manhour });


  }
  
  render() {
    return (
      <div>
        <div className='header-wrap'>
          <h3 className='sky'>Personnel</h3>
          <small>Create New Personnel</small>
        </div>
              
        <PersonnelInputField 
          replaceData={this.state.editData} 
          isEdit={true} 
          btnName='Update'
          onSuccess={this.callbackAddPersonnel.bind(this)}/>

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
          
          <br className="clearfix"/>
        </div>

        <PersonnelList onEdit={this.callbackEditPersonnel.bind(this)} updatedRateType={this.state.rateTypeArr} onDelete={this.callbackDeletePersonnel.bind(this)}/>

      </div>
    )
  }
}