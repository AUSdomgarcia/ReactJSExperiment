import React, {Component} from 'react';

import {AddLevel} from './addlevel';

import jquery from 'jquery';
import toastr from 'toastr';

import sortable from 'sortablejs';

import {
    getServiceCategories_subCategories_level3_byParentId,
    postServiceCategories_subCategories_create,
    postServiceCategories_subCategories_delete,
    postServiceCategories_subCategories_update,
    postRatecardServiceCategoriesSortServiceSubCategories
    
    } from '../http';

export class LevelThree extends Component {

    constructor(props){
        super(props);

        this.state = {
            isManageBtn: true,
            isMenuBtn: false,
            showAddLevel:false,

            dataTree: [],
            curLevelId: 0,
            currentVersion: "0.0",
            subCategoryName: "",
            service_category_id: 0,

            showInputName: false,
            inputCategoryName: "",

            isReArrange: false,
            enableSave: false,
            sortedResults:[]
        }
        this.hackSortableInstance = null;
    }

    componentDidMount(){
        // console.log('parent', this.props.parentData);
        let scope = this;
        let delay = setTimeout(function(){
            clearTimeout(delay);
            jquery('.myHandle.-layer3-'+scope.props.layer).hide();
        }, 1 );
    }
    
    componentWillMount(){
        let scope = this;
        let delay = setTimeout(function(){
            clearTimeout(delay);
            jquery('.myHandle.-layer3-'+scope.props.layer).hide();
        }, 1 );
    }

    componentWillReceiveProps(nextProps){
        // console.log(JSON.stringify(nextProps));
    }

    onManageSubCategories(){
        let scope = this;
        let el = document.getElementById('SortableLevelThree_' + this.props.sortableId);

        if(this.props.nextLevel===2){

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
                        let id = jquery(items[i])[0].dataset.id;
                        let order = i;
                        result.push({id, order});
                    }

                    let sorted = JSON.stringify(result);
                    scope.setState({sortedResults: sorted}, function(){
                        scope.setState({ enableSave: true });
                    });
                }
            });

            this.setState({ curLevelId: this.props.parentData.id });
            this.setState({ currentVersion: this.props.parentData.version });
            this.setState({ service_category_id: this.props.parentData.service_category_id });

            getServiceCategories_subCategories_level3_byParentId(
                this.props.parentData.id + 
                '&version=' + scope.props.parentData.version).then(function(response){
                scope.setState({ dataTree: response.data.payload });

                let delay = setTimeout(function(){
                    clearTimeout(delay);
                    jquery('.myHandle.-layer3-'+scope.props.layer).hide();
                }, 1 );
            })
            .catch(function(response){
                if(response.data.error){
                    // alert(response.data.message);
                    toastr.error(response.data.message);
                }
            });
        }

        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});
    }

    onAddLevel3(){
        this.setState({showAddLevel:true});
        this.onCancelArrangementLevel3();
    }
    
    onCancelManageButton(){
        this.setState({isManageBtn:true});
        this.setState({isMenuBtn:false});
    }

    onSaveAddLevel3(newValue){
        let scope = this;

        if(newValue.length===0){
            // alert('No category name specified.');
            toastr.error('No category name specified.');
            return;
        }

        postServiceCategories_subCategories_create({
            service_sub_category_id: scope.state.curLevelId,
            name: newValue,
            level: "3",
            version: scope.state.currentVersion,
            service_category_id: scope.state.service_category_id
        })
        .then(function(response){
            scope.setState({subCategoryName: ""});
            scope.setState({showAddLevel: false});
            scope.setState({dataTree: response.data.payload});
            
            // alert('Category added successfully');
            toastr.success('Category added successfully');

            let delay = setTimeout(function(){
                clearTimeout(delay);
                jquery('.myHandle.-layer3-'+scope.props.layer).hide();
            }, 1 );
        })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
        })
    }

    onCancelAddLevel(){
        this.setState({showAddLevel:false});
    }

    onCategoryNameChanged(evt){
        this.setState({inputCategoryName: evt.target.value });
    }

    onHandleKeyChange(evt){
        var scope = this;
        if(evt.key === 'Enter'){
            this.props.onUpdate( this.state.inputCategoryName, this.props.parentData.id ); 
            this.setState({showInputName:false});
        }
    }

    onEditCategory(){
        let scope = this;
        let toggle = this.state.showInputName;
            toggle = !toggle;

        this.setState({showInputName: toggle});

        this.setState({inputCategoryName: this.props.parentData.name });

        if(toggle===false && this.state.inputCategoryName.length !== 0){
            
            if(window.sessionStorage.getItem('category_level2_name') === this.state.inputCategoryName ){
                this.setState({showInputName: false});

            } else {
                this.props.onUpdate( this.state.inputCategoryName, this.props.parentData.id ); 
            }

        } else {
            window.sessionStorage.setItem('category_level2_name', this.props.parentData.name);
        }
    }

    onDeleteCategory(evt){
        let scope = this;
        let target = evt.target;

        if (confirm('Are you sure you want to delete this category?')) {
            // continue
        } else {
            return;
        }

        postServiceCategories_subCategories_delete({id: this.props.parentData.id, level: this.props.nextLevel })
        .then(function(response){
            // alert('Category deleted.');
            toastr.success('Category deleted.');
            if(scope.hackSortableInstance!==null) scope.hackSortableInstance.destroy();
            scope.props.onDelete(scope.props.parentData.id);
        })
        .catch(function(response){
            if(response.data.error){
                // alert(response.data.message);
                toastr.error(response.data.message);
            }
        });
    }

    callbackDelete(id){
        let scope = this;
        scope.state.dataTree.map(function(el, index){
            if(el.id === id){
                scope.state.dataTree.splice(index, 1);
            }
        });
        scope.setState({ dataTree: scope.state.dataTree });
    }

    callbackUpdate(value, id){
       let scope = this;

       if(value.length===0){
            // alert('No category name specified.');
            toastr.error('No category name specified.');
            return;
        }

       // Local Update
        this.state.dataTree.map(function(data){
                if(data.id === id){
                    data.name = value;
                }
            });
        
        // Server Update
        postServiceCategories_subCategories_update({name: value, id: id})
        .then(function(response){
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

    onReArrange(){
        this.setState({isReArrange:true});
        this.onCancelAddLevel();
        jquery('.myHandle.-layer3-'+this.props.layer).show();
    }
    
    onCancelArrangementLevel3(){
        this.setState({isReArrange:false});
        this.setState({enableSave:false});
        jquery('.myHandle.-layer3-'+this.props.layer).hide();
    }

    onSaveArrangementLevel3(){
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
                // alert('Category arrangement updated.');
                toastr.success('Category arrangement updated.');
                // reset
                scope.onCancelArrangementLevel3();
            })
            .catch(function(response){
                if(response.data.error){
                    // alert(response.data.message);
                    toastr.error(response.data.message);
                }
            });
        }
    }


    render(){
        let menuBtn = null;
        let scope = this;
        
        let parentData = this.props.parentData;

        let level3 = function(){ return (<br/>) };
        
        let ulStyle = function(style){ return style; }
        let style = {};

        let hasLevel3 = false;

        let reArrangeBtn = <button 
                            type="button" 
                            className="btn btn-default" 
                            onClick={this.onReArrange.bind(this)}>Rearrange</button>
                            
        if(this.state.isReArrange){
            reArrangeBtn = 
            <span>
                <button 
                    className={"btn btn-success " + (this.state.enableSave ? '' : 'disabled')} 
                    type="button" 
                    onClick={this.onSaveArrangementLevel3.bind(this)}>Save</button>&nbsp;
                <button className="btn btn-default" type="button" onClick={this.onCancelArrangementLevel3.bind(this)}>Cancel</button>
            </span>
        }


        if(parentData.level === this.props.nextLevel.toString()){
            
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
                                <span className="name">{parentData.name} {/*parentData.version*/}</span>
                            }
                            return visibleElement;
                        })()
                    }
                </div>
                <div className="col-xs-6">
                    <div className="text-right">

                    {(function(scope){
                            var elem = null;
                            
                            if(scope.props.nextLevel < 3) {
                                if(scope.state.isMenuBtn){
                                    elem = 
                                        <div>
                                            {reArrangeBtn} &nbsp; 
                                            <button type="button" className="btn btn-primary" onClick={scope.onAddLevel3.bind(scope)}>Add Level</button>&nbsp; 
                                            <button type="button" className="btn btn-default" onClick={scope.onCancelManageButton.bind(scope)}>Cancel</button> 
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

                            } else {
                                elem = 
                                <div>
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

                        })(this)}
                    </div>
                </div>
                <br className="clearfix"/>
            </div>
        }

        if(this.state.isMenuBtn && this.state.dataTree.length!==0){
            level3 = 
                this.state.dataTree
                    .map(function(data, index){
                        if(data.level==="3" && data.service_sub_category_id === scope.state.curLevelId ){
                            hasLevel3 = true;

                            return (
                                <li key={data.id} data-id={data.id}>
                                    
                                    <span className={"myHandle -layer3-"+scope.props.layer}>
                                        <i className="fa fa-ellipsis-v"></i>
                                        <i className="fa fa-ellipsis-v"></i>
                                    </span>

                                    <LevelThree 
                                        nextLevel={3} 
                                        layer={index}
                                        parentData={data}  
                                        sortableId={data.id}
                                        
                                        onDelete={scope.callbackDelete.bind(scope)} 
                                        onUpdate={scope.callbackUpdate.bind(scope)} 
                                        />
                                </li>
                                )
                        }
                    })

            if(hasLevel3 === false){
                style = {
                    margin: "0px !important"
                }
            }
        }
        
        return (
            <div>
                {menuBtn}

                <ul style={ulStyle(style)} id={'SortableLevelThree_'+scope.props.sortableId}>
                    {level3}
                </ul>

                <AddLevel
                    hasAddLevel={this.state.showAddLevel}
                    name={this.state.subCategoryName}
                    onSave={this.onSaveAddLevel3.bind(this)} 
                    onCancel={this.onCancelAddLevel.bind(this)} />
            </div>
        )
    }
}
