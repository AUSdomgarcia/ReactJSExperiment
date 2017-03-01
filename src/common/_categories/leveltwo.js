import React, {Component} from 'react';

import {LevelThree} from './levelthree';
import {AddLevel} from './addlevel';

import xhr from 'jquery';

import sortable from 'sortablejs';

import { 
    postServiceCategoriesDelete,
    postServiceCategories_subCategories_create,
    postServiceCategories_subCategories_update,
postRatecardServiceCategoriesSortServiceSubCategories,
getServiceCategories_subCategories_level2_byParentId
 } from '../../common/http';

export class LevelTwo extends Component {

    constructor(props){
        super(props);

        this.state = {
            isManageBtn: true,
            isMenuBtn: false,
            showAddLevel: false,
            subCategoryName: "",

            categoryLevelTwo: [],
            currentVersion: "0.0",
            myCurrentId: 0,

            showPopup: false,

            inputCategoryName: "",
            showInputName: false,

            isReArrange: false,
            enableSave: false,
            sortedResults:[]
        }
        this.hackSortableInstance = null;
    }

    componentDidMount(evt){
        let scope = this;
        // initial here
        let el = document.getElementById('SortableLevelTwo_' + this.props.sortableId);

        if(scope.hackSortableInstance!==null){
            scope.hackSortableInstance.destroy();
            console.log('destroying instance of ', scope.props.sortableId);
        }

        scope.hackSortableInstance = sortable.create( el , {
            animation: 100,
            handle: '.myHandle',
            onSort: function(e){
                var items = e.to.children;
                var result = [];
                
                for (var i = 0; i < items.length; i++) {
                    let id = xhr(items[i])[0].dataset.id;
                    let order = i;
                    result.push({id, order});
                }

                let sorted = JSON.stringify(result);
                scope.setState({sortedResults: sorted}, function(){
                    scope.setState({ enableSave: true });
                });
            }
        });
    }

    onEndSortableLevel2(evt){
        console.log('old', evt.oldIndex, 'new', evt.newIndex);
    }

    componentWillReceiveProps(nextProps){
        
    }

    componentWillMount(){
        let scope = this;
        this.setState({ myCurrentId: this.props.parentData.id });

        getServiceCategories_subCategories_level2_byParentId(this.props.sortableId).then(function(response){
            if(response.data.hasOwnProperty('payload')){
                if(response.data.payload.length!==0){
                    
                    console.log('categories/level2', response.data.payload);

                    scope.setState({ categoryLevelTwo: response.data.payload });
                    scope.setState({ currentVersion: response.data.payload[response.data.payload.length-1].version });
                }
            }

            let delay = setTimeout(function(){
                clearTimeout(delay);
                xhr('.myHandle.-layer2-'+scope.props.layer).hide();
            }, 1 );
        });
    }

    onManageSubCategories(){
        let scope = this;
        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});

        let delay = setTimeout(function(){
            clearTimeout(delay);
            xhr('.myHandle.-layer2-'+scope.props.layer).hide();
        }, 1 );
    }

    onDeleteCategory(evt){
        let scope = this;
        let target = evt.target;

        if (confirm('Are you sure you want to delete this category?')) {
            // continue
        } else {
            return;
        }
        
        postServiceCategoriesDelete({id: this.state.myCurrentId}).then(function(response){
            alert('Category deleted.');
            scope.hackSortableInstance.destroy();
            scope.props.onDelete(scope.state.myCurrentId);
        })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        })
    }

    onCancelManageButton(){
        this.setState({isManageBtn:true});
        this.setState({isMenuBtn:false});
        this.setState({showAddLevel:false});
    }

    onAddLevel2(){
        this.setState({showAddLevel:true});
        this.onCancelArrangementLevel2();
    }

    onCancelAddLevel2(){
        this.setState({showAddLevel:false});
    }

    onSaveAddLevel2(newValue){
        let scope = this;

        if(newValue.length===0){
            alert('No category name specified.');
            return;
        }

        // Create
        postServiceCategories_subCategories_create({
            service_category_id: scope.state.myCurrentId,
            name: newValue,
            level: "2"
        }).then(function(response){
            scope.setState({subCategoryName: ""});
            scope.setState({showAddLevel: false});
            scope.setState({categoryLevelTwo: response.data.payload});
            
            scope.onCancelAddLevel2();

            alert('Category added successfully');

            let delay = setTimeout(function(){
                clearTimeout(delay);
                xhr('.myHandle.-layer2-'+scope.props.layer).hide();
            }, 1 );
        })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        })
    }

    onEditCategory(){
        let scope = this;
        let toggle = this.state.showInputName;
            toggle = !toggle;

        this.setState({showInputName: toggle});

        this.setState({inputCategoryName: this.props.parentData.name });

        if(toggle===false && scope.state.inputCategoryName.length !== 0){
            scope.props.onUpdate( scope.state.inputCategoryName, scope.state.myCurrentId ); 
        }
    }

    onCategoryNameChanged(evt){
        this.setState({inputCategoryName: evt.target.value });
    }

    onHandleKeyChange(evt){
        var scope = this;
        if(evt.key === 'Enter'){
            scope.props.onUpdate( scope.state.inputCategoryName, scope.state.myCurrentId ); 
            this.setState({showInputName:false});
        }
    }

    callbackDelete(id){
        let scope = this;
        scope.state.categoryLevelTwo.map(function(el, index){
            if(el.id === id){
                scope.state.categoryLevelTwo.splice(index, 1);
            }
        });
        scope.setState({ categoryLevelTwo: scope.state.categoryLevelTwo });
    }

    callbackUpdate(value, id){
       let scope = this;

        if(value.length===0){
            alert('No category name specified.');
            return;
        }

        this.state.categoryLevelTwo.map(function(data){
                if(data.id === id){
                    data.name = value;
                }
            });

        postServiceCategories_subCategories_update({name: value, id: id})
        .then(function(response){
            console.log('[Edit] Level two success', response.data);
            alert('Category name updated.');
        })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        })
    }

    onReArrangeLevel2(){
        this.setState({isReArrange:true});
        this.onCancelAddLevel2();
        xhr('.myHandle.-layer2-'+this.props.layer).show();
    }

    onCancelArrangementLevel2(){
        this.setState({enableSave:false});
        this.setState({isReArrange:false});
        xhr('.myHandle.-layer2-'+this.props.layer).hide();
    }

    onSaveArrangementLevel2(){
        let scope = this;

        if(this.state.enableSave){
        
            if(confirm('Are you sure you want to save these changes?')){
                //
            } else {
                return;
            }

            postRatecardServiceCategoriesSortServiceSubCategories({ 
                categories_sort: this.state.sortedResults 
            })
            .then(function(response){
                // reset
                alert('Category arrangement updated.');
                scope.onCancelArrangementLevel2();
            })
            .catch(function(response){
                if(response.data.error){
                    alert(response.data.message);
                }
            })
        }
    }

    render(){
        let menuBtn = null;
        let scope = this;
        
        let level2 = function(){ return (<br/>) };

        let ulStyle = function(style){ return style; }
        let style = {};

        let hasLevel2 = false;

        let reArrangeBtn = 
            <button type="button" 
                className="btn btn-default" 
                onClick={this.onReArrangeLevel2.bind(this)}>Rearrange</button>

        if(this.state.isReArrange){
            reArrangeBtn = 
            <span>
                <button 
                    className={"btn btn-success " + (this.state.enableSave ? '' : 'disabled')} 
                    type="button" 
                    onClick={this.onSaveArrangementLevel2.bind(this)}>Save</button>&nbsp;
                <button 
                    className="btn btn-default" 
                    type="button" 
                    onClick={this.onCancelArrangementLevel2.bind(this)}>Cancel</button>
            </span>
        }

        menuBtn = 
            <div>
                <div className="col-xs-6">
                    {
                        (function(){
                            let visibleElement = null;

                            if(scope.state.showInputName){
                                visibleElement = 
                                <input type="text" className="form-control" value={scope.state.inputCategoryName} onChange={scope.onCategoryNameChanged.bind(scope)} onKeyPress={scope.onHandleKeyChange.bind(scope)}/>
                            } else {
                                visibleElement = 
                                <span className="name">{scope.props.parentData.name}</span>
                            }
                            return visibleElement;
                        })()
                    }
                </div>

                <div className="col-xs-6">
                    <div className="text-right">
                        {(function(scope){
                            var elem = null;
                            if(scope.state.isMenuBtn){
                                elem = 
                                    <div>
                                        {reArrangeBtn} &nbsp; 
                                        <button 
                                            type="button" 
                                            className="btn btn-primary" 
                                            onClick={scope.onAddLevel2.bind(scope)}>Add Level</button>&nbsp; 
                                        <button 
                                            type="button" 
                                            className="btn btn-default" 
                                            onClick={scope.onCancelManageButton.bind(scope)}>Cancel</button> 
                                    </div>
                            } else {
                                elem = 
                                <div>
                                    <button 
                                        type="button" 
                                        className="btn btn-default" 
                                        onClick={scope.onManageSubCategories.bind(scope)}>Manage SubCategories</button>&nbsp;
                                    <button 
                                        type="button" 
                                        className="btn btn-success" 
                                        onClick={scope.onEditCategory.bind(scope)}><i className="fa fa-pencil-square-o"></i></button>&nbsp;
                                    <button 
                                        type="button" 
                                        className="btn btn-danger" 
                                        onClick={scope.onDeleteCategory.bind(scope)}>
                                            &times;
                                        </button>
                                </div>
                            }
                            return (elem)
                        })(scope)}
                    </div>
                </div>
                <br className="clearfix"/>

            </div>
        
        if(this.state.isMenuBtn && this.state.categoryLevelTwo.length !==0){
            level2 = 
                this.state.categoryLevelTwo
                    .map(function(data, index){
                            return (
                                <li key={data.id} data-id={data.id}>
                                    
                                    <span className={"myHandle -layer2-"+scope.props.layer}>
                                        <i className="fa fa-ellipsis-v"></i>
                                        <i className="fa fa-ellipsis-v"></i>
                                    </span>
                                    
                                    <LevelThree 
                                        layer={index}
                                        nextLevel={2}
                                        sortableId={data.id} 
                                        parentData={data} 
                                        arrayOfCurrentLevel={scope.state.categoryLevelTwo} 

                                        onDelete={scope.callbackDelete.bind(scope)} 
                                        onUpdate={scope.callbackUpdate.bind(scope)} 
                                    />
                                </li> )
                    })
            
            if(hasLevel2 === false){
                style = { margin: "0px !important" };
            }
        }
        
        return (
            <div>
                {menuBtn}

                <ul style={ulStyle(style)} id={'SortableLevelTwo_'+scope.props.sortableId}>
                    {level2}
                </ul>

                {/* TRY TO MAKE COMPONENT */}
                <AddLevel 
                    hasAddLevel={this.state.showAddLevel}
                    name={this.state.subCategoryName}
                    onSave={this.onSaveAddLevel2.bind(this)} 
                    onCancel={this.onCancelAddLevel2.bind(this)} />
            </div>
        )
    }
    
}
