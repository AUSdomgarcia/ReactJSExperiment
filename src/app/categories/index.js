import React, {Component} from "react";

import xhr from 'jquery';

import "./categories.scss";

import {LevelTwo} from '../../common/_categories/leveltwo';
import {RateType} from '../../common/rateType/';

import sortable from 'sortablejs';

import {getServiceCategoriesRoot,
        postServiceCategoriesCreate,
        postServiceCategoriesUpdate,
        postRatecardServiceCategoriesSortServiceCategories
      } from '../../common/http';

export class Categories extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      categoryLevelOne : [],
      categoryName:  "",
      response_last_id: null,
    };

    this.parentMe = this;
  }

  componentDidMount(){
    let scope = this;

    getServiceCategoriesRoot().then(function(response){
      console.log('categories', response.data);
      
      scope.setState({ categoryLevelOne: response.data.payload });

      if(response.data.hasOwnProperty('payload')===false) return;
      if(response.data.payload.length!==0){
        scope.setState({response_last_id: response.data.payload[response.data.payload.length-1].id});
      }
    });

    sortable.create(SortableLevelOne ,
    {
      animation: 100,
      handle: '.myHandle',
      ghostClass: 'ghost',
      onSort: function(e){
        let items = e.to.children;
        let result = [];
        
        for (var i = 0; i < items.length; i++) {
            let id = xhr(items[i])[0].dataset.id;
            let order = i;
            result.push({id, order});
        }

        console.log('level1-done', JSON.stringify(result));

        postRatecardServiceCategoriesSortServiceCategories(
          { categories_sort: JSON.stringify(result) }
        )
        .then(function(response){
          console.log(response);
        });

      }
    });
  }
  
  onAddLevel(evt){
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

    // Co-op investigate .. tells setting state during unmount component
    postServiceCategoriesCreate({name: this.state.categoryName }).then(function(response){
      if(response.data.hasOwnProperty('payload')===false) return;
      scope.setState({ categoryLevelOne: response.data.payload });
      scope.setState({ response_last_id: response.data.payload[response.data.payload.length-1].id });
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
    let scope = this;

    scope.state.categoryLevelOne.map(function(data){
      if(data.id === id){
        data.name = value;
      }
    });

    postServiceCategoriesUpdate({name: value, id: id}).then(function(response){
      console.log('[Edit] Level one success', response.data);
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
            { scope.state.categoryLevelOne.map(function(data, index){
                return ( 
                  <li key={data.id} data-id={data.id}>
                    <span className="myHandle">::</span>
                    <LevelTwo parentData={data} 
                              sortableId={data.id} 
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
