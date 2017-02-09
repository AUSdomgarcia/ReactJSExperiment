import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';

import {PersonnelInputField} from '../../common/_personnel/personnelInputField';
import {PersonnelList} from '../../common/_personnel/personnelList';

import xhr from 'jquery';

export class Personnel extends Component {

  constructor(props){
      super(props);

      // this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
      this.BASE_URL = "http://cerebrum-api.dev:8096/api";

      this.state = {
        rateTypeArr: [],
        editData: [],
        personnelArr: [],
        isUpdated: false
      }
  }

  componentDidMount(){
    let scope = this;
    xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
        scope.setState({ personnelArr: data.payload });
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log(this.props.params);
  }

  callbackAdded(addValue){
    this.setState({personnelArr: addValue});
    this.setState({isUpdated:false});
  }

  callbackUpdate(addValue){
    this.setState({personnelArr: addValue});
    this.context.router.push('/personnel');
    this.setState({isUpdated:true});
  }
  

  callbackDeletePersonnel(id){
    let scope = this;
     this.state.personnelArr.map(function(data, index){
        if(data.id === +id){
          scope.state.personnelArr.splice(index, 1);
          scope.setState({ personnelArr: scope.state.personnelArr });   
        }
    });

    this.redirectWhenNoArr();
  }

  redirectWhenNoArr(){
    if(this.state.personnelArr.length===0){
      this.context.router.push('/personnel');
    }
  }

  render() {
    let personnel = null;
    let scope = this;

    if(this.props.params.hasOwnProperty('id')) {

      personnel =
        ( <PersonnelInputField 
          btnName='Update'
          isEdit={true}
          isUpdated={scope.state.isUpdated}
          personnelData={scope.props.params}
          onAdded={scope.callbackUpdate.bind(scope)}/>
        )

    } else {

      personnel =
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
              
        {personnel}

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

        <PersonnelList
          parentData={this.state.personnelArr} 
          onDelete={this.callbackDeletePersonnel.bind(this)}/>

      </div>
    )
  }
}

Personnel.contextTypes = {
  router: React.PropTypes.object.isRequired
};