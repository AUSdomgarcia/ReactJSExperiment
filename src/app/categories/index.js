import React, {Component} from "react";

import xhr from 'jquery';

import "./categories.scss";

import {LevelTwo} from '../../common/_categories/leveltwo';
import {RateType} from '../../common/rateType/index';

import sortable from 'sortablejs';

export class Categories extends Component {
  
  constructor(props){
    super(props);

    this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
    // this.BASE_URL = "http://cerebrum-api.dev:8096/api";

    this.state = {
      categoryLevelOne : [],
      categoryName:  "",
      response_last_id: null,
    };
  }

  componentDidMount(){
    // GET state rateType, department, position 
    let scope = this;

    xhr.get(this.BASE_URL+'/rate-cards/service-categories', function(data){
      scope.setState({ categoryLevelOne: data.payload });

      console.log(data.payload);

      if(data.payload.length!==0){
        scope.setState({response_last_id: data.payload[data.payload.length-1].id});
      }
    });

    sortable.create(SortableLevelOne ,
    {
      animation: 100,
      handle: '.myHandle',
      ghostClass: 'ghost'
    });
  }
  
  onAddLevel(evt){
    // alert('LAST_ID ' + this.state.response_last_id);
    xhr('.category-input').removeClass('hide');
  }

  onCancelHandler(evt){
    xhr('.category-input').addClass('hide');
    this.setState({categoryName: ''});
  }

  onSaveHandler(evt){

    if(this.state.categoryName.length===0){
      alert('No category name');
      return;
    }

    let scope = this;
    let category = { "id": this.state.response_last_id+1, "name": this.state.categoryName, "order": this.state.response_last_id+1, "sub_categories": [] };
    let level1Arr = this.state.categoryLevelOne;
        level1Arr.push(category);

    xhr.post(this.BASE_URL+'/rate-cards/service-categories/create', 
    {
      name: scope.state.categoryName
    },
    function(data){
      scope.setState({ categoryLevelOne: data.payload });
      scope.setState({ response_last_id: data.payload[data.payload.length-1].id });
    });

    this.setState({ categoryName: ""});
    xhr('.category-input').addClass('hide');
  }

  onCategoryNameHandler(evt){
    this.setState({categoryName: evt.target.value });
  }

  callbackDelete(id){
    let scope = this;
  
    scope.state.categoryLevelOne.map(function(el, index){
      if(el.id === id){
        scope.state.categoryLevelOne.splice(index, 1);
      }
    });
    
    scope.setState({ categoryLevelOne: scope.state.categoryLevelOne });
  }

  callbackUpdate(value, id){
    // alert('FCK'+ ', value: ' + value + ', id: ' + id );

    let scope = this;

    scope.state.categoryLevelOne.map(function(data){
      if(data.id === id){
        data.name = value;
      }
    });

    xhr.post(this.BASE_URL+'/rate-cards/service-categories/update', {
      name: value,
      id: id
    },
    function(data){
      console.log('[Edit] Level one success', data);
    });
  }

  render() {
    var scope = this;

    return (
      <div>
        

        {/* Title */}
        <h3 className="sky">Manage Categories and Rate Type</h3>
        





        {/* Menu */}
        <div className="col-md-12">
          <div className="col-xs-6">
            <strong>Service Category</strong>
          </div>
          <div className="col-xs-6">
            <div className="pull-right">
              <button type="button" className="btn btn-default">Rearrange</button>&nbsp;
              <button type="button" className="btn btn-primary" onClick={this.onAddLevel.bind(this)}>Add Level</button>
            </div>
          </div>
        </div>

        <br className="clearfix"/>






        {/* Category Listing */}
        <div className="category-list">
          <ul style={{margin:"0"}} id="SortableLevelOne">
            { scope.state.categoryLevelOne.map(function(currentData, index){
                return ( 
                  <li key={currentData.id}>
                    <span className="myHandle">::</span>
                    <LevelTwo parentData={currentData} 
                              sortableId={currentData.id} 
                              onDelete={scope.callbackDelete.bind(scope)} 
                              onUpdate={scope.callbackUpdate.bind(scope)} />
                  </li>
                  )
              } ) }
            </ul>
        </div>






      {/* Hidden Input for new Category */}
        <div className="category-input hide">
          <div className="col-xs-6">
            <input type="text" className="form-control" value={this.state.categoryName} onChange={this.onCategoryNameHandler.bind(this)} placeholder="Enter Product Category Name" />
          </div>
          <div className="col-xs-6">
            <div className="text-right">
              <button type="button" className="btn btn-danger" onClick={this.onCancelHandler.bind(this)}>Cancel</button>
              &nbsp;
              <button type="button" className="btn btn-success" onClick={this.onSaveHandler.bind(this)}>Save</button>
            </div>
          </div>
          <br className="clearfix"/>
        </div>
      
        <br />
        <br />
        <br />

        {/* Rate Type */}
        <RateType />

      </div>
    );
  }
}
