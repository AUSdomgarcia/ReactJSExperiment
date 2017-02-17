import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';

import {PersonnelInputField} from '../../common/_personnel/personnelInputField';
import {PersonnelList} from '../../common/_personnel/personnelList';

import xhr from 'jquery';

// import {Filter} from 'react-filter';

import {FilteredList} from '../../common/_personnel/filteredList';

import {getServicePersonnels} from '../../common/http';

export class Personnel extends Component {

  constructor(props){
      super(props);

      this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
      // this.BASE_URL = "http://cerebrum-api.dev:8096/api";

      this.state = {
        personnels: [],
        personnelscopy: [],
        isUpdated: false
      }
  }

  componentWillMount(){
    let scope = this;
    let ta = null;

    // xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
    //     console.log('current personnels', data.payload);
    //     scope.setState({ personnels: data.payload });
    //     // copy
    //     scope.setState({ personnelscopy: data.payload });
    // });

    getServicePersonnels().then(function(response){
      console.log('personnels', response.data.payload);
        scope.setState({ personnels: response.data.payload });
        // copy
        scope.setState({ personnelscopy: response.data.payload });
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log(this.props.params);
  }

  callbackAdded(addValue){
    this.setState({personnels: addValue});
    this.setState({isUpdated:false});
    // copy
    this.setState({ personnelscopy: addValue });
  }

  callbackUpdate(addValue){
    this.setState({personnels: addValue});
    this.context.router.push('/personnel');
    this.setState({isUpdated:true});
    // copy
    this.setState({ personnelscopy: addValue });
  }
  
  callbackDeletePersonnel(id){
    let scope = this;
     this.state.personnels.map(function(data, index){
        if(data.id === +id){
          scope.state.personnels.splice(index, 1);
          scope.setState({ personnels: scope.state.personnels });   
          // copy
          scope.setState({ personnelscopy: scope.state.personnels });
        }
    });

    this.redirectPersonnel();
  }

  redirectPersonnel(){
    if(this.state.personnels.length===0){
      this.context.router.push('/personnel');
    }
  }

  callbackFiltered(filters){
    this.setState({ personnelscopy: filters });
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
                data={this.state.personnels}
                onFilter={this.callbackFiltered.bind(this)}
              />

              <span className="input-group-btn">
                <button className="btn btn-default" type="button">Go!</button>
              </span>
            </div>
          </div>
          
          <br className="clearfix"/>
        </div>

        <PersonnelList
          parentData={this.state.personnelscopy} 
          onDelete={this.callbackDeletePersonnel.bind(this)}/>

      </div>
    )
  }
}

Personnel.contextTypes = {
  router: React.PropTypes.object.isRequired
};