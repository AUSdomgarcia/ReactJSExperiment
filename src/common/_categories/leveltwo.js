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

                console.log('level2-done', JSON.stringify(result) );

                // postRatecardServiceCategoriesSortServiceSubCategories({ 
                //     categories_sort: JSON.stringify(result) 
                // })
                // .then(function(response){
                //     console.log(response);
                // });

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
        /*
        if(nextProps.parentData['sub_categories']===undefined) return;

        let tempArr = nextProps.parentData['sub_categories'];

        if(tempArr !== this.state.categoryLevelTwo){
            // categories Array
            this.setState({ categoryLevelTwo: tempArr });
            // id Integer
            this.setState({ myCurrentId: nextProps.parentData.id });
            // version String
            if(tempArr.length!==0) {
                this.setState({ currentVersion: tempArr[tempArr.length-1].version });
            }
        }
        */
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
        });
    }

    onManageBtn(){
        let scope = this;
        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});

        let delay = setTimeout(function(){
            clearTimeout(delay);
            xhr('.myHandle.-layer2-'+scope.props.layer).hide();
        }, 1 );
    }

    onDelete(evt){
        let scope = this;
        let target = evt.target;

        if (confirm('Are you sure you want to save this thing into the database?')) {
            // continue
        } else {
            return;
        }
        
        postServiceCategoriesDelete({id: this.state.myCurrentId}).then(function(response){
            scope.hackSortableInstance.destroy();
            scope.props.onDelete(scope.state.myCurrentId);
        });
    }

    onDone(){
        this.setState({isManageBtn:true});
        this.setState({isMenuBtn:false});
        this.setState({showAddLevel:false});
    }

    onAdd(){
        this.setState({showAddLevel:true});
    }
    onCancel(){
        this.setState({showAddLevel:false});
    }

    onSave(newValue){
        let scope = this;

        if(newValue.length===0){
            alert('No category were set.');
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
        });
    }

    onClickEdit(){
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

       // Local Update
        this.state.categoryLevelTwo.map(function(data){
                if(data.id === id){
                    data.name = value;
                }
            });
        
        // Server Update
        postServiceCategories_subCategories_update({name: value, id: id})
        .then(function(response){
            console.log('[Edit] Level two success', response.data);
        })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        })
    }

    onReArrange(){
        this.setState({isReArrange:true});
        xhr('.myHandle.-layer2-'+this.props.layer).show();
    }

    onCancelSave(){
        this.setState({isReArrange:false});
        xhr('.myHandle.-layer2-'+this.props.layer).hide();
    }

    onSaveReArrange(){
        let scope = this;

        if(this.state.enableSave){
            postRatecardServiceCategoriesSortServiceSubCategories({ 
                categories_sort: this.state.sortedResults 
            })
            .then(function(response){
                console.log('category saved!', response);
                scope.setState({enableSave:false});
            });
        }
    }
    

    render(){
        let menuBtn = null;
        let scope = this;
        
        let level2 = function(){ return (<br/>) };

        let ulStyle = function(style){ return style; }
        let style = {};

        let hasLevel2 = false;

        let reArrangeBtn = <button type="button" className="btn btn-default" onClick={this.onReArrange.bind(this)}>Rearrange</button>

        if(this.state.isReArrange){
            reArrangeBtn = 
            <span>
                <button className={"btn btn-success " + (this.state.enableSave ? '' : 'disabled')} type="button" onClick={this.onSaveReArrange.bind(this)}>Save</button>&nbsp;
                <button className="btn btn-default" type="button" onClick={this.onCancelSave.bind(this)}>Cancel</button>
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
                                        <button type="button" className="btn btn-primary" onClick={scope.onAdd.bind(scope)}>Add Level</button>&nbsp; 
                                        <button type="button" className="btn btn-default" onClick={scope.onDone.bind(scope)}>Done</button> 
                                    </div>
                            } else {
                                elem = 
                                <div>
                                    <button type="button" className="btn btn-default" onClick={scope.onManageBtn.bind(scope)}>Manage SubCategories</button>&nbsp;
                                    <button type="button" className="btn btn-success" onClick={scope.onClickEdit.bind(scope)}><i className="fa fa-pencil-square-o"></i></button>&nbsp;
                                    <button type="button" className="btn btn-danger" onClick={scope.onDelete.bind(scope)}><i className="fa fa-times"></i></button>
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
                        // if( data.level ==="2" ){
                            // hasLevel2 = true;
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
                        // }
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
                    onSave={this.onSave.bind(this)} 
                    onCancel={this.onCancel.bind(this)} />
            </div>
        )
    }
    
}
