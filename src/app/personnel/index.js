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
      // this.BASE_URL = "http://cerebrum-api.dev:8096/api";

      this.state = {
        rateTypeArr: [],
        editData: [],
        personnelDataArr: []
      }
  }

  componentDidMount(){
    let scope = this;
    xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
        scope.setState({ personnelDataArr: data.payload });
    });
  }

  componentWillReceiveProps(nextProps){
    console.log(this.props.params);
  }

  callbackAddPersonnel(addValue){
    console.log('onAddOrUpdate', addValue);
    this.setState({personnelDataArr: addValue});
  }

  callbackDeletePersonnel(id){
    let scope = this;
     this.state.personnelDataArr.map(function(data, index){
        if(data.id === +id){
          scope.state.personnelDataArr.splice(index, 1);
          scope.setState({ personnelDataArr: scope.state.personnelDataArr });   
        }
    });
  }

  render() {
    let personnel = null;
    let scope = this;

    if(this.props.params.hasOwnProperty('id')) {

      personnel =
        <PersonnelInputField 
          btnName='Update'
          isEdit={true}
          personnelData={scope.props.params}
          onSuccess={scope.callbackAddPersonnel.bind(scope)}/>

    } else {

      personnel =
        <PersonnelInputField 
          btnName='Add'
          isEdit={false}
          onSuccess={scope.callbackAddPersonnel.bind(scope)}/>
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
          parentData={this.state.personnelDataArr} 
          onDelete={this.callbackDeletePersonnel.bind(this)}/>

      </div>
    )
  }
}



// export class PersonnelEdit extends Component {

//   constructor(props){
//       super(props);
//       this.state = {
//         rateTypeArr: [],
//         editData: []
//       }
//   }

//   componentDidMount(){
//     // console.log('ON EDIT ONLY', this.props.location.query , this.props.params.value);
//     let scope = this;
//       xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
//           scope.setState({ rateTypeArr: data.payload });
//       });
//   }

//   callbackAddPersonnel(addValue){
//     this.setState({rateTypeArr:addValue});
//   }

//   callbackDeletePersonnel(deleteVal){
//     this.setState({rateTypeArr:deleteVal});  
//   }
  
//   render() {
//     return (
//       <div>
//         <div className='header-wrap'>
//           <h3 className='sky'>Personnel</h3>
//           <small>Create New Personnel</small>
//         </div>
              
//         <PersonnelInputField 
//           btnName='Update'
//           onSuccess={this.callbackAddPersonnel.bind(this)}/>

//         <br />
      
//         <div className='search-wrap'>
//           <div className='col-xs-8'>col-xs-8</div>
          
//           <div className='col-xs-4'>
//             <div className="input-group">
//               <input type="text" className="form-control" placeholder="Search for..." />
//               <span className="input-group-btn">
//                 <button className="btn btn-default" type="button">Go!</button>
//               </span>
//             </div>
//           </div>
          
//           <br className="clearfix"/>
//         </div>

//         <PersonnelList
//             updatedRateType={this.state.rateTypeArr} 
//             onDelete={this.callbackDeletePersonnel.bind(this)}/>

//       </div>
//     )
//   }
// }