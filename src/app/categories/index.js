import React, {Component} from "react";
import Jquery from 'jquery';
import "./categories.scss";

import {LevelTwo} from '../../common/_categories/leveltwo';
import {RateType} from '../../common/rateType/index';

export class Categories extends Component {
  
  constructor(props){
    super(props);
    this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
    this.state = {
      categoryLevelOne : [],
      categoryName:  "",
      response_last_id: null,
    };
  }

  componentDidMount(){
    // GET state rateType, department, position 
    let scope = this;

    Jquery.get(this.BASE_URL+'/rate-cards/service-categories', function(data){
      scope.setState({ categoryLevelOne: data.payload });

      if(data.payload.length!==0){
        scope.setState({response_last_id: data.payload[data.payload.length-1].id});
      }
    });
  }
  
  onAddLevel(evt){
    // alert('LAST_ID ' + this.state.response_last_id);
    Jquery('.category-input').removeClass('hide');
  }

  onCancelHandler(evt){
    Jquery('.category-input').addClass('hide');
    this.setState({categoryName: ''});
  }

  onSaveHandler(evt){

    if(this.state.categoryName.length===0){
      alert('No category name');
      console.log('No categorie name');
      return;
    }

    let scope = this;
    let category = { "id": this.state.response_last_id+1, "name": this.state.categoryName, "order": this.state.response_last_id+1, "sub_categories": [] };
    let level1Arr = this.state.categoryLevelOne;
        level1Arr.push(category);

    Jquery.post(this.BASE_URL+'/rate-cards/service-categories/create', 
    {
      name: scope.state.categoryName
    },
    function(data){
      scope.setState({ categoryLevelOne: data.payload });
      scope.setState({ response_last_id: data.payload[data.payload.length-1].id });
    });

    this.setState({ categoryName: ""});
    Jquery('.category-input').addClass('hide');
  }

  onCategoryNameHandler(evt){
    this.setState({categoryName: evt.target.value });
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
          <ul>
            { scope.state.categoryLevelOne.map(function(currentData){
                return ( 
                  <li key={currentData.id}>

                    <LevelTwo parentData={currentData} />

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
            <div className="text-left">
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
        <br />
        <br />

        {/* Rate Type */}
        <RateType />
        <br />

        <pre>
        Todo: <br />
        1. Fix third level not sync after creating new category. <br />
        2. Rate Type Functionality. <br />
        3. Create Pagination.
        </pre>

      </div>
    );
  }
}
