import React, {Component} from "react";

import jquery from 'jquery';
import toastr from 'toastr';

import "./categories.scss";

import {LevelTwo} from '../../common/_categories/leveltwo';
import {RateType} from '../../common/rateType/';

import sortable from 'sortablejs';

import {getServiceCategoriesRoot,
        postServiceCategoriesCreate,
        postServiceCategoriesUpdate,
        postRatecardServiceCategoriesSortServiceCategories
      } from '../../common/http';

import ReactModal from 'react-modal';

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
      sortedResults:[],

      showModal: false,

      modalAction: ""  // save_arrangement | delete_rateType | delete_category
    };

    // this.parentMe = this;
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
              let id = jquery(items[i])[0].dataset.id;
              let order = i;
              result.push({id, order});
          }
          let sorted = JSON.stringify(result);
          scope.setState({ sortedResults: sorted }, function(){
            scope.setState({ enableSave: true });
          });
        }
    });
  }
  
  onAddLevel1(evt){
    jquery('.category-input').removeClass('hide');
    this.onCancelArrangementLevel1();
  }

  onCancelAddLevel1(evt){
    jquery('.category-input').addClass('hide');
    this.setState({categoryName: ''});
  }
  
  onSaveAddLevel1(evt){
    if(this.state.categoryName.length===0){
      // alert('No category name specified.');
      toastr.error('No category name specified.');
      return;
    }

    let scope = this;
    let category = { "id": this.state.response_last_id+1, "name": this.state.categoryName, "order": this.state.response_last_id+1, "sub_categories": [] };
    let level1Arr = this.state.categoryLevelOne;
        
    postServiceCategoriesCreate({name: this.state.categoryName })
    .then(function(response){
      if(response.data.payload.length!==0){

        scope.setState({ categoryLevelOne: response.data.payload },
        
        function(){
          toastr.success('Category added successfully');
        });

        scope.setState({ response_last_id: response.data.payload[response.data.payload.length-1].id });

        scope.onCancelAddLevel1();

        scope.setState({ categoryName: ""});

        jquery('.category-input').addClass('hide');

      }
    })
    .catch(function(response){
      if(response.data.error){
        toastr.error(response.data.message);
      }
    });
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
      // alert('No category name specified.');
      toastr.error('No category name specified.');
      return;
    }

    scope.state.categoryLevelOne.map(function(data){
      if(data.id === id){
        data.name = value;
      }
    });

    postServiceCategoriesUpdate({name: value, id: id}).then(function(response){
      console.log('[Edit] Level one success', response.data);
      // alert('Category name updated.');
      toastr.success('Category name updated.');
    })
    .catch(function(response){
      if(response.data.error){
        // alert(response.data.message);
        toastr.error(response.data.message);
      }
    });
  }
  
  onReArrangeLevel1(){
    jquery('.myHandle.-layer1').show();
    this.setState({isRearrage: true});
    this.onCancelAddLevel1();
  }

  onCancelArrangementLevel1(){
    this.setState({isRearrage: false});
    this.setState({enableSave:false});
    jquery('.myHandle.-layer1').hide();
  }

  onSaveArrangementLevel1(){
    let scope = this;

    this.setState({ modalAction: "save_arrangement"}, function(){
      if(scope.state.enableSave){
        scope.setState({ showModal: true });
      }
    });
  }

  getModalContent(action){
    let modal_action = action;
    let content = <span>No action</span>

    switch(action){
      case "save_arrangement":
        content = 
        <div className="modal-inner-content">
            <h5><i className="fa fa-exclamation-circle fa-2"></i>
                &nbsp;&nbsp;Are you sure you want to save changes?
            </h5>
            <br />
        </div>
      break;
    }

    return (
      <div>
        {content}
        <div className="text-right">

          <button type="button"
            className="btn btn-primary" 
            onClick={ ()=> {
                let scope = this;

                switch(modal_action){
                  case "save_arrangement":
                      postRatecardServiceCategoriesSortServiceCategories({
                        categories_sort: scope.state.sortedResults
                      })
                      .then(function(response){
                        toastr.success('Category arrangement updated.');
                        scope.onCancelArrangementLevel1();
                        scope.setState({showModal:false});
                      })
                      .catch(function(response){
                        if(response.data.error){
                          toastr.error(response.data.message);
                          scope.setState({showModal:false});
                        }
                      });
                  break;

                  // case "delete_category":
                  // break;

                  // case "delete_rateType":
                  // break;
                }

            }} >Yes</button>&nbsp;

          <button type="button" 
            className="btn btn-default" 
            onClick={ ()=> {
              this.setState({showModal:false})
            }} >No</button>

        </div>
      </div>
    )
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
                    onClick={this.onSaveArrangementLevel1.bind(this)}>Save
                  </button>&nbsp;
                    
                  <button type="button" 
                    className="btn btn-default" 
                    onClick={this.onCancelArrangementLevel1.bind(this)}>Cancel
                  </button>
                </span>
    } else {
      rearrage = 
      <button 
        type="button" 
        className="btn btn-default" 
        onClick={this.onReArrangeLevel1.bind(this)}>Rearrange</button>
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
        <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="Inline Styles Modal Example"
           style={{
              overlay: {
                backgroundColor: 'rgba(0,0,0,0.3)'
              },
              content: {
                color: '#000',
                top: '53px',
                minHeight: '100px',
                height:'135px',
                width:'450px',
                maxWidth:'100%',
                left: '50%',
                transform: 'translateX(-50%)'
              }
            }} >

          {this.getModalContent(this.state.modalAction)}

        </ReactModal>

        {/* Title */}
        <h4 className="sky">Manage Categories and Rate Type</h4>
        {/* Menu */}
        <div className="col-md-12">
          <div className="col-xs-6">
            <strong>Service Category</strong>
          </div>
          <div className="col-xs-6">
            <div className="pull-right">
              {rearrage}&nbsp;
              <button 
                type="button"
                className="btn btn-primary" 
                onClick={this.onAddLevel1.bind(this)}>Add Level</button>
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
              <button type="button" className="btn btn-danger" onClick={this.onCancelAddLevel1.bind(this)}>Cancel</button>
              &nbsp;
              <button type="button" className="btn btn-success" onClick={this.onSaveAddLevel1.bind(this)}>Save</button>
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
