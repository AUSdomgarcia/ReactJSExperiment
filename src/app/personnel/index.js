import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';

import {PersonnelInputField} from '../../common/_personnel/personnelInputField';
import {PersonnelList} from '../../common/_personnel/personnelList';

import xhr from 'jquery';

// import {Filter} from 'react-filter';

import {FilteredList} from '../../common/_personnel/filteredList';

export class Personnel extends Component {

  constructor(props){
      super(props);

      this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
      // this.BASE_URL = "http://cerebrum-api.dev:8096/api";

      this.state = {
        rateTypeArr: [],
        editData: [],

        personnelArr: [],
        
        personnelFilter: [],

        isUpdated: false
      }
  }

  componentDidMount(){
    let scope = this;
    let ta = null;

    xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
        
        console.log('current personnels', data.payload);

        scope.setState({ personnelArr: data.payload });
        // copy
        scope.setState({ personnelFilter: data.payload });
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log(this.props.params);
  }

  callbackAdded(addValue){
    this.setState({personnelArr: addValue});
    this.setState({isUpdated:false});
    // copy
    this.setState({ personnelFilter: addValue });
  }

  callbackUpdate(addValue){
    this.setState({personnelArr: addValue});
    this.context.router.push('/personnel');
    this.setState({isUpdated:true});
    // copy
    this.setState({ personnelFilter: addValue });
  }
  
  callbackDeletePersonnel(id){
    let scope = this;
     this.state.personnelArr.map(function(data, index){
        if(data.id === +id){
          scope.state.personnelArr.splice(index, 1);
          scope.setState({ personnelArr: scope.state.personnelArr });   
          // copy
          scope.setState({ personnelFilter: scope.state.personnelArr });
        }
    });

    this.redirectWhenNoArr();
  }

  redirectWhenNoArr(){
    if(this.state.personnelArr.length===0){
      this.context.router.push('/personnel');
    }
  }

  callbackFilter(filteredData){
    // console.log(filteredData);
    this.setState({ personnelFilter: filteredData });
  }

  render() {
    let personnelField = null;
    let scope = this;

    if(this.props.params.hasOwnProperty('id')) {

      personnelField =
        ( <PersonnelInputField 
          btnName='Update'
          isEdit={true}
          isUpdated={scope.state.isUpdated}
          personnelData={scope.props.params}
          onAdded={scope.callbackUpdate.bind(scope)}/>
        )

    } else {

      personnelField =
        ( <PersonnelInputField 
          btnName='Add'
          isUpdated={scope.state.isUpdated}
          isEdit={false}
          onAdded={scope.callbackAdded.bind(scope)}/>
        )
    }

    return (
      <div>
        <div className='header-wrap'>
          <h3 className='sky'>Personnel</h3>
          <small>Create New Personnel</small>
        </div>
              
        {personnelField}

        <br />
      
        <div className='search-wrap'>
          <div className='col-xs-8'> &nbsp; </div>
          
          <div className='col-xs-4'>
            <div className="input-group">
              {/*<input id="personnel-searchbox" type="text" className="form-control" placeholder="Search for..." onChange={this.onFilter.bind(this)} />*/}

              <FilteredList 
                data={this.state.personnelArr}
                onFilter={this.callbackFilter.bind(this)}
              />

              <span className="input-group-btn">
                <button className="btn btn-default" type="button">Go!</button>
              </span>
            </div>
          </div>
          
          <br className="clearfix"/>
        </div>

        <PersonnelList
          parentData={this.state.personnelFilter} 
          onDelete={this.callbackDeletePersonnel.bind(this)}/>

      </div>
    )
  }
}

Personnel.contextTypes = {
  router: React.PropTypes.object.isRequired
};