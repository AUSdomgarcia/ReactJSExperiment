import React, {Component} from 'react';
import {Link} from 'react-router';
import './personnel.scss';

import {PersonnelInputField} from '../../common/_personnel/personnelInputField';
// import {PersonnelList} from '../../common/_personnel/personnelList';
// import {Filt eredList} from '../../common/_personnel/filteredList';
import {getServicePersonnels, 
        postPersonnelsDelete, 
        getPersonnelSearch, 
        getRateCardPersonnelPagination,
      
        getServiceRateTypes,
        getPersonnelsPositions,
        getPersonnelsDepartment

      } from '../../common/http';

import {ActionButton} from '../../common/actionButton/actionButton';

import Pagination from 'react-js-pagination';

import jquery from 'jquery';

import toastr from 'toastr';

export class Personnel extends Component {

  constructor(props){
      super(props);
      this.state = {
        personnels: [],
        hasFilter: false,
        isUpdated: false,

        search_manhour_rate: "",

        itemsCountPerPage: 10,
        totalItemsCount: 0,
        pageRangeDisplayed: 0,
        activePage: 1,
        globalSearchWord: "",

        personnelKeyword: "",

        filter_rate_types: [],
        filter_positions: [],
        filter_departments: [],

        rate_type_value: "",
        position_value: "",
        department_value: "",
      }
  }

  componentWillMount(){
    this.mypagination(this.state.activePage, this.state.itemsCountPerPage);
    let scope = this;
    
    getServiceRateTypes().then(function(response){
      if(response.data.payload.length!==0){
        let rate_types = response.data.payload;
            rate_types.unshift({id:12345, name: 'Select rate type'});
        scope.setState({ filter_rate_types: rate_types });
      }
    });

    getPersonnelsPositions().then(function(response){
      if(response.data.payload.length!==0){
        let positions = response.data.payload;
            positions.unshift({_id:12345, name: 'Select position'});
        scope.setState({ filter_positions: positions });
      }
    });

    getPersonnelsDepartment().then(function(response){
      if(response.data.payload.length!==0){
        let departments = response.data.payload;
            departments.unshift({_id:12345, name: 'Select department'});
        scope.setState({ filter_departments: departments });
      }
    });
  }

  mypagination(page, limit){
    let scope = this;

    getRateCardPersonnelPagination(page, limit)
    .then(function(response){
      if(response.data.payload.length!==0){
        console.log('pagination:', response);

        let pagination = response.data.pagination;
        // data
        scope.setState({ personnels: response.data.payload });

        scope.setState({ activePage: pagination.current_page });
        scope.setState({ totalItemsCount: pagination.total_records });
        scope.setState({ itemsCountPerPage: pagination.limit });
        // scope.setState({ pageRangeDisplayed: pagination.total_pages });
        scope.setState({ pageRangeDisplayed: pagination.total_records });
      }
    })
    .catch(function(response){
      if(response.data.error){
        alert(response.data.message);
      }
    });
  }

  componentDidMount(){
    //
  }

  componentWillReceiveProps(nextProps){} 

  callbackPersonnelAdded(newValue){
    console.log('add', newValue);
    this.setState({personnels: newValue});
    this.setState({isUpdated:false});

    this.mypagination(this.state.activePage, this.state.itemsCountPerPage);
  }

  callbackPersonnelUpdate(newValue){
    this.setState({personnels: newValue});
    this.setState({isUpdated:true});
    this.context.router.push('/personnel');
    
    // this.mypagination(this.state.activePage, this.state.itemsCountPerPage);
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

      if(confirm('Are you sure you want to delete this personnel?')){
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
                  // alert('Personnel deleted.')
                  toastr.success('Personnel deleted.'); //, 'Cerebrum Notification');
                })
              }
            });

          })
          .catch(function(response){
              if(response.data.error){
                  // alert(response.data.message);
                  toastr.error(response.data.message);
              }
          });
  }

  onSearch(evt){
    let scope = this;
    let ratetype = ( ! this.state.rate_type_value.includes('Select rate type')) ? this.state.rate_type_value : '';
    let position = ( ! this.state.position_value.includes('Select position')) ? this.state.position_value : '';
    let department = ( ! this.state.department_value.includes('Select department')) ? this.state.department_value : '';
    let manhour_rate = this.state.search_manhour_rate || 0.00;

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

        scope.setState({ activePage: response.data.pagination.current_page });
        scope.setState({ totalItemsCount: response.data.pagination.total_records });
        scope.setState({ itemsCountPerPage: response.data.pagination.limit });
        scope.setState({ pageRangeDisplayed: response.data.pagination.total_records });

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

  onManhourRateValue(evt){
    let word = evt.target.value;
    this.setState({search_manhour_rate: word});
  }

  callbackPageChange(pageNumber){
    console.log(`active page is ${pageNumber}`);
    let scope = this;

    this.setState({activePage: pageNumber}, function(){
      scope.mypagination(scope.state.activePage, scope.state.itemsCountPerPage);
    });
  }

  onPaginationLimit(evt){
    let scope = this;
    let value = +evt.target.value
    this.setState({activePage: 1}, function(){
      scope.setState({itemsCountPerPage: value}, function(){
        scope.mypagination(scope.state.activePage, scope.state.itemsCountPerPage);
      });
    });
  }

  onGlobalSearchInput(evt){
    let word = evt.target.value;
    this.setState({personnelKeyword: word});
  }

  onGlobalSearch(evt){
    let scope = this;
    let params = "?keyword=" + this.state.personnelKeyword;

    getPersonnelSearch(params).then(function(response){
      if(response.data.payload.length!==0){

        scope.setState({ personnels: response.data.payload });

        scope.setState({ activePage: response.data.pagination.current_page });
        scope.setState({ totalItemsCount: response.data.pagination.total_records });
        scope.setState({ itemsCountPerPage: response.data.pagination.limit });
        scope.setState({ pageRangeDisplayed: response.data.pagination.total_records });

      } else {
         scope.setState({ personnels: [] });
      }
    })
    .then(function(response){
      // if(response.data.error){
        // toastr.error(response.data.message);
      // }
      console.log('ERR<>', response);
    })
  }  

  render() {
    let personnelComponent = null;
    let paginationComponent = null;
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
            <td>{ ( + data.manhour_rate ).formatMoney(2, '.', ',') }</td>
            <td>
              <Link className='btn btn-default' 
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

      paginationComponent =
        <div>
          <div className="col-xs-6">
            <Pagination
              activePage={ this.state.activePage }
              itemsCountPerPage={ this.state.itemsCountPerPage }
              totalItemsCount={ this.state.totalItemsCount }
              pageRangeDisplayed={ this.state.pageRangeDisplayed }
              onChange={this.callbackPageChange.bind(this)}
            />
          </div>
          
          <div className="col-xs-6">
            <div className="row">
              
              <div className="col-xs-6">
                <label>Page display limit:</label>
              </div>
              
              <div className="col-xs-6">
                <select className="form-control" value={this.state.itemsCountPerPage} onChange={this.onPaginationLimit.bind(this)}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={60}>60</option>
                  <option value={70}>70</option>
                  <option value={80}>80</option>
                  <option value={90}>90</option>
                  <option value={100}>100</option>
                </select>
              </div>
            
            <br className="clearfix" />
            </div>
          </div>
        
        <br className="clearfix" />     
        </div>
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
                <select className="form-control" 
                    value={this.state.rate_type_value} 
                    onChange={ (e) => { 
                        scope.setState({ rate_type_value: e.target.value}); 
                    } }>

                    { this.state.filter_rate_types.map(function(data){
                      return (
                        <option key={data.id} value={data.name}>{data.name}</option>
                      )
                    })}
                </select>
              </div>

              <div className="col-xs-6">
                <label>Position</label>
                <select className="form-control" 
                    value={this.state.position_value} 
                    onChange={ (e) => { 
                        scope.setState({ position_value: e.target.value}); 
                    } }>

                    { this.state.filter_positions.map(function(data){
                      return (
                        <option key={data._id} value={data.name}>{data.name}</option>
                      )
                    })}
                </select>
              </div>

              <div className="col-xs-6">
                <label>Department</label>
                <select className="form-control" 
                    value={this.state.department_value} 
                    onChange={ (e) => { 
                        scope.setState({ department_value: e.target.value}); 
                    } }>

                    { this.state.filter_departments.map(function(data){
                      return (
                        <option key={data._id} value={data.name}>{data.name}</option>
                      )
                    })}
                </select>
              </div>

              <div className="col-xs-6">
                <label>Manhour Rate <small>(integer)</small></label>
                <input type="number" 
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
                    onClick={this.onSearch.bind(this)}>Submit</button>
                </div>
              </div>

            <br className="clearfix" />
            </div>  

            <div className="col-xs-6">
              <div className="form-group">
                <button 
                  type="button" 
                  className={"btn " + (this.state.hasFilter ? 'btn-primary' : 'btn-primary') }
                  onClick={this.onShowFilter.bind(this)}>{(this.state.hasFilter ? 'Hide Filter' : 'Show Filter')}
                </button>
              </div>
            </div>

            <div className="col-xs-6">
              <div className="navbar-form navbar-left"> 
                <div className="form-group"> 
                  <input className="form-control" placeholder="Search"
                     value={this.state.personnelKeyword} 
                     onChange={this.onGlobalSearchInput.bind(this)}
                     />
                </div>&nbsp;
                <button type="submit" 
                  onClick={this.onGlobalSearch.bind(this)}
                  className="btn btn-primary">Submit
                </button> 
              </div>
              
              <br className="clearfix" />
            </div>

            <br className="clearfix" />
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

          {paginationComponent}

          <br className="clearfix"/>
        </div>

      </div>
    )
  }
}

Personnel.contextTypes = {
  router: React.PropTypes.object.isRequired
};
