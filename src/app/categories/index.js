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
      isRearrage: false,
      enableSave: false,
      isSaveSent:false,
      sortedResults:[]
    };

    this.parentMe = this;
  }

  componentWillMount(){
    let scope = this;

    getServiceCategoriesRoot().then(function(response){
      scope.setState({ categoryLevelOne: response.data.payload });
      if(response.data.payload.length!==0){
        scope.setState({response_last_id: response.data.payload[response.data.payload.length-1].id});
      }
    });
  }

  componentDidMount(){
    let scope = this;

    sortable.create(SortableLevelOne, {
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

          // console.log('level1-done', JSON.stringify(result) );

          let sorted = JSON.stringify(result);
          scope.setState({ sortedResults: sorted }, function(){
            scope.setState({ enableSave: true });
          });

          // let sorted = JSON.stringify(result);
          // postRatecardServiceCategoriesSortServiceCategories({categories_sort: sorted})
          // .then(function(response){
          //   console.log('resonse_00', response);
          // });
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
    postServiceCategoriesCreate({name: this.state.categoryName })
    .then(function(response){
      if(response.data.hasOwnProperty('payload')===false) return;
      scope.setState({ categoryLevelOne: response.data.payload });
      scope.setState({ response_last_id: response.data.payload[response.data.payload.length-1].id });
      xhr('.category-input').addClass('hide');
    })
    .catch(function(response){
      if(response.data.error){
        alert(response.data.message)
      }
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

    if(value.length===0){
      alert('No name specified.');
      return;
    }

    scope.state.categoryLevelOne.map(function(data){
      if(data.id === id){
        data.name = value;
      }
    });

    postServiceCategoriesUpdate({name: value, id: id}).then(function(response){
      console.log('[Edit] Level one success', response.data);
      alert('Updated Category.');
    })
    .catch(function(response){
      if(response.data.error){
        alert(response.data.message);
      }
    });
  }

  onReArrange(){
    this.setState({isRearrage: true});
    xhr('.myHandle.-layer1').show();
  }

  onCancelReArrange(){
    this.setState({isRearrage: false});
    xhr('.myHandle.-layer1').hide();
  }

  onSaveReArrange(){
    let scope = this;
    
    if(this.state.enableSave){
      postRatecardServiceCategoriesSortServiceCategories({
      categories_sort: this.state.sortedResults
      })
      .then(function(response){
        
        console.log('category saved!', response);
        
        scope.setState({enableSave:false});

      })
      .catch(function(response){
        if(response.data.error){
          alert(response.data.message);
        }
      })
    }
  }

  render() {
    let scope = this;
    let rearrage = <span></span>
    let layer = '002';
    let categoryList = <div>&nbsp; No data.</div>

    if(this.state.isRearrage){
      rearrage = <span>
                  <button type="button" 
                    className={"btn btn-success " + (this.state.enableSave ? '' : 'disabled')} 
                    onClick={this.onSaveReArrange.bind(this)}>Save
                  </button>&nbsp;
                    
                  <button type="button" 
                    className="btn btn-default" 
                    onClick={this.onCancelReArrange.bind(this)}>Cancel
                  </button>
                </span>
    } else {
      rearrage = 
      <button type="button" className="btn btn-default" onClick={this.onReArrange.bind(this)}>Rearrange</button>
    }

    if(this.state.categoryLevelOne.length!==0){
      categoryList = 
        this.state.categoryLevelOne.map(function(data, index){
            return ( 
              <li key={data.id} data-id={data.id}>
                <span className="myHandle -layer1">
                  <i className="fa fa-ellipsis-v"></i>
                  <i className="fa fa-ellipsis-v"></i>
                </span>
                <LevelTwo parentData={data} 
                          sortableId={data.id}
                          layer={index}
                          onDelete={scope.callbackDelete.bind(scope)} 
                          onUpdate={scope.callbackUpdate.bind(scope)} />
              </li>
            ) } ) 
    }
    
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
              {rearrage}&nbsp;
              <button type="button" className="btn btn-primary" onClick={this.onAddLevel.bind(this)}>Add Level</button>
            </div>
          </div>
        </div>

        <br className="clearfix"/>






        {/* Category Listing */}
        <div className="category-list">
          <ul style={{margin:"0"}} id="SortableLevelOne">
            {categoryList}
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
