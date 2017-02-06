import React, {Component} from "react";
import Jquery from 'jquery';
import "./categories.scss";

import {LevelOne} from '../../common/_categories/levelone';

export class Categories extends Component {
  
  constructor(props){
    super(props);
    this.BASE_URL = "http://172.16.100.141/api.cerebrum/public";
    this.state = {
      categoryList : [],
      categoryName:  "",
    };
  }

  componentDidMount(){
    // GET state rateType, department, position 
    let scope = this;

    Jquery.get(this.BASE_URL+'/rate-cards/service-categories', function(data){
      scope.setState({ categoryList: data.payload })
    });
  }
  
  onAddLevel(evt){
    console.log('onAddLevel');
    Jquery('.category-input').removeClass('hide');
  }

  onCancelHandler(evt){
    Jquery('.category-input').addClass('hide');
    this.setState({categoryName: ''});
  }

  onSaveHandler(evt){
    // testing adding
    var category = { "id": Math.floor(Math.random()*9999), "name": this.state.categoryName, "level": 2, "order": 1, "sub_categories": [] };
    
    this.state.categoryList.push(category);
    this.setState({ categoryList: this.state.categoryList });
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
              <button type="button" className="btn btn-default">Rearrange</button>
              <button type="button" className="btn btn-primary" onClick={this.onAddLevel.bind(this)}>Add Level</button>
            </div>
          </div>
        </div>

        <br className="clearfix"/>
        <br />

        {/* Category Listing */}
        <div className="category-list">
          <ul>
            { 
              this.state.categoryList.map(function(data, index){
                return ( 
                  <li key={data.id}>
                    <LevelOne curData={data} />
                  </li>
                  )
              })
            }
            </ul>
        </div>

        <br />

        {/* Hidden Input for new Category */}
        <div className="category-input hide">
          <div className="col-xs-6">
            <input type="text" className="form-control" value={this.state.categoryName} onChange={this.onCategoryNameHandler.bind(this)} placeholder="Enter Product Category Name" />
          </div>
          <div className="col-xs-6">
            <div className="pull-right">
              <button type="button" className="btn btn-danger" onClick={this.onCancelHandler.bind(this)}>Cancel</button>
              &nbsp;
              <button type="button" className="btn btn-success" onClick={this.onSaveHandler.bind(this)}>Save</button>
            </div>
          </div>
          <br className="clearfix"/>
        </div>

        <br />

      </div>
    );
  }
}
