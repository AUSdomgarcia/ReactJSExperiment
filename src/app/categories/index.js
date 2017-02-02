import React, {Component} from "react";
import Jquery from 'jquery';
import "./categories.scss";

import SubLevel from '../../common/_categories/sublevel';

export class Categories extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      // categoryList : ["Digital Strategy", "Creative Production", "User Experience", "Dev Production", "Engagement"],
      categoryList : [{ name: "Digital Strategy",    lvlTwo: [{ name: "Sample from Index 0"}] }, 
                      { name: "Creative Production", lvlTwo: [{ name: "Sample from Index 1"}] }, 
                      { name: "User Experience",     lvlTwo: [{ name: "Sample from Index 2"}] }, 
                      { name: "Dev Production",      lvlTwo: [{ name: "Sample from Index 3"}] },
                      { name: "Engagement",          lvlTwo: [{ name: "Sample from Index 4"}] }
                      ],
      categoryName:  ""
    };
  }

  componentDidMount(){
    // GET state rateType, department, position 
  }
  
  addLevelOne(evt){
    Jquery('.category-input').removeClass('hide');
  }

  onCancelHandler(evt){
    Jquery('.category-input').addClass('hide');
    this.setState({categoryName: ''});
  }

  onSaveHandler(evt){
    var category = { name: this.state.categoryName };
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
        <h3 className="sky">Manage Categories and Rate Type</h3>
          
          <div className="col-md-12">
            <div className="col-xs-6">
              <strong>Service Category</strong>
            </div>
            <div className="col-xs-6">
              <div className="pull-right">
                <button type="button" className="btn btn-default">Rearrange</button>
                <button type="button" className="btn btn-primary" onClick={this.addLevelOne.bind(this)}>Add Level</button>
              </div>
            </div>
          </div>

        <br className="clearfix"/>
        <br />

        {/* Category Listing */}
        <ul className="category-list">
          {this.state.categoryList.map(function(data, index){
              return (
                <li key={index}>

                   <SubLevel curData={data}/>

                </li>)
            })
          }
        </ul>

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
