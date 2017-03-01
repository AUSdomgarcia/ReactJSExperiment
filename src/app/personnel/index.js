import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';
import xhr from 'jquery';

import {PersonnelInputField} from '../../common/_personnel/personnelInputField';
import {PersonnelList} from '../../common/_personnel/personnelList';
import {FilteredList} from '../../common/_personnel/filteredList';
import {getServicePersonnels, postPersonnelsDelete, getPersonnelSearch} from '../../common/http';

import {ActionButton} from '../../common/actionButton/actionButton';

export class Personnel extends Component {

  constructor(props){
      super(props);
      this.state = {
        personnels: [],
        hasFilter: false,
        isUpdated: false,

        search_ratetype: "",
        search_position: "",
        search_department: "",
        search_manhour_rate: "",
      }
  }

  componentWillMount(){
    let scope = this;
    
    getServicePersonnels().then(function(response){
      if(response.data.payload.length!==0){
        
        console.log(response.data.payload);

        scope.setState({ personnels: response.data.payload });
      }
    });
  }

  componentWillReceiveProps(nextProps){} 

  callbackPersonnelAdded(newValue){
    console.log('add', newValue);
    this.setState({personnels: newValue});
    this.setState({isUpdated:false});
  }

  callbackPersonnelUpdate(newValue){
    this.setState({personnels: newValue});
    this.setState({isUpdated:true});
    this.context.router.push('/personnel');
  }
  
  callbackDeletePersonnel(id){
    let scope = this;
     this.state.personnels.map(function(data, index){
        if(data.id === +id){
          scope.state.personnels.splice(index, 1);
          scope.setState({ personnels: scope.state.personnels });   
        }
    });
    alert('Deleted Personnel');
    this.redirectPersonnel();
  }

  redirectPersonnel(){
    if(this.state.personnels.length===0){
      this.context.router.push('/personnel');
    }
  }

  onShowFilter(){
    let toggle = !this.state.hasFilter;
    this.setState({hasFilter: toggle});
  }

  onDeletePersonnel(id){
      let scope = this;

      if(confirm('Are you sure you want to delete?')){
            //
        } else {
            return;
        }

      postPersonnelsDelete({ id: id })
          .then(function(response){
            let _personnels = scope.state.personnels;
            _personnels.map(function(data, index, arr){
              if(+data.id === +id){
                _personnels.splice(index, 1);
              }

              if(index === arr.length-1){
                scope.setState({personnels: _personnels}, function(){
                  alert('Personnel deleted.')
                })
              }
            });

          })
          .catch(function(response){
              if(response.data.error){
                  alert(response.data.message);
              }
          }) 
  }

  onSearch(evt){
    let scope = this;
    let ratetype = this.state.search_ratetype || '';
    let position = this.state.search_position || '';
    let department = this.state.search_department || '';
    let manhour_rate = this.state.search_manhour_rate || '';

    let params = [];
        params.push( ratetype.trim() );
        params.push( position.trim() );
        params.push( department.trim() );
        params.push( manhour_rate.trim() );

    let paramsStr = '?rate_type='+ params[0] + '&position='+ params[1] + '&department='+ params[2] + '&manhour_rate='+ params[3];

    console.log(paramsStr);

    getPersonnelSearch(paramsStr).then(function(response){
      console.log('search results', response);
      let payload = response.data.payload;
      if(payload.length!==0){
        scope.setState({personnels: payload});
      } else {
        scope.setState({personnels: []});
      }
    })
    .catch(function(response){
      if(response.data.error){
        if(response.data.message);
      }
    });
  }

  onDepartmentValue(evt){
    let word = evt.target.value;
    this.setState({search_department: word});
  }

  onPositionValue(evt){
    let word = evt.target.value;
    this.setState({search_position: word});
  }

  onManhourRateValue(evt){
    let word = evt.target.value;
    this.setState({search_manhour_rate: word});
  }

  onRateTypeValue(evt){
    let word = evt.target.value;
    this.setState({search_ratetype: word});
  }

  render() {
    let personnelComponent = null;
    let personnelTable = <tr><td colSpan={5}>No data.</td></tr>
    let scope = this;

    if(this.props.params.hasOwnProperty('id')) {

      personnelComponent =
        ( <PersonnelInputField 
          btnName='Update'
          isEdit={true}
          isUpdated={scope.state.isUpdated}
          personnelData={scope.props.params}
          onUpdate={scope.callbackPersonnelUpdate.bind(scope)}/>
        )

    } else {

      personnelComponent =
        ( <PersonnelInputField 
          btnName='Add'
          isUpdated={scope.state.isUpdated}
          isEdit={false}
          onUpdate={scope.callbackPersonnelAdded.bind(scope)}/>
        )
    }

    if(this.state.personnels.length!==0){
      personnelTable = 
      this.state.personnels.map(function(data){
        return (
          <tr key={data.id}>
            <td>{data.rate_type.name}</td>
            <td>{data.position.name}</td>
            <td>{data.department.name}</td>
            <td>{data.manhour_rate}</td>
            <td>
              <Link className='btn btn-primary' 
                  to={'/personnel/edit' + 
                      '/' + data.id +
                      '/' + data.rate_type.id + 
                      '/' + data.department._id +
                      '/' + data.position._id +
                      '/' + data.manhour_rate } >Edit</Link> &nbsp;

              <ActionButton
                hasEdit={false}
                hasDelete={true}     
                id={data.id}     
                onDelete={scope.onDeletePersonnel.bind(scope)}      
               />

            </td>
          </tr>
        )
      });
    }

    return (
      <div>
        <div className='header-wrap'>
          <h3 className='sky'>Personnel</h3>
          <small>Create New Personnel</small>
        </div>
              
        {personnelComponent}

        <br />
      
        <div className='search-wrap'>
          
          <div className='col-xs-12'>

            <div className={"row " + (this.state.hasFilter ? '' : 'hidden')}>
              <div className="col-xs-6">
                <label>Rate Type</label>
                <input type="text" 
                  className="form-control" 
                  value={this.state.search_ratetype}
                  onChange={this.onRateTypeValue.bind(this)} />  
              </div>

              <div className="col-xs-6">
                <label>Position</label>
                <input type="text" 
                  className="form-control" 
                  value={this.state.search_position}
                  onChange={this.onPositionValue.bind(this)} />  
              </div>

              <div className="col-xs-6">
                <label>Department</label>
                <input type="text" 
                  className="form-control" 
                  value={this.state.search_department}
                  onChange={this.onDepartmentValue.bind(this)} />    
              </div>

              <div className="col-xs-6">
                <label>Manhour Rate</label>
                <input type="text" 
                  className="form-control" 
                  value={this.state.search_manhour_rate}
                  onChange={this.onManhourRateValue.bind(this)} />    
              </div>

              <div className="col-xs-12 text-right">
                <div className="form-group">
                  <br />
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={this.onSearch.bind(this)}>Search</button>
                </div>
              </div>

            <br className="clearfix" />
            </div>  

            <button 
                type="button" 
                className={"btn " + (this.state.hasFilter ? 'btn-primary' : 'btn-primary') }
                onClick={this.onShowFilter.bind(this)}>{(this.state.hasFilter ? 'Hide Filter' : 'Show Filter')}</button>
          </div>
          
          <br className="clearfix" />
          <br />

          <table className="table table-striped table-bordered table-hover">
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
              {personnelTable}
            </tbody>
          </table>

          <br className="clearfix"/>
        </div>

      </div>
    )
  }
}

Personnel.contextTypes = {
  router: React.PropTypes.object.isRequired
};


/*<PersonnelList
  parentData={this.state.personnels_copy} 
  onDelete={this.callbackDeletePersonnel.bind(this)}/>
*/

/*<FilteredList 
    data={this.state.personnels}
    onFilter={this.callbackFiltered.bind(this)}
  />

  <span className="input-group-btn">
    <button className="btn btn-default" type="button">Go!</button>
  </span>
*/

/*
  callbackFiltered(filters){
    this.setState({ personnels_copy: filters });
  }
 */