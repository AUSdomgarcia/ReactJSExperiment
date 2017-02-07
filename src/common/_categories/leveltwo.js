import React, {Component} from 'react';

import {LevelThree} from './levelthree';
import {AddLevel} from './addlevel';

import xhr from 'jquery';

import sortable from 'sortablejs';

export class LevelTwo extends Component {

    constructor(props){
        super(props);

        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        
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
            showInputName: false
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
            handle: '.myHandle'
        });
    }

    componentWillReceiveProps(nextProps){
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
    }

    onManageBtn(){
        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});
    }

    onDelete(evt){
        let scope = this;
        let target = evt.target;

        if (confirm('Are you sure you want to save this thing into the database?')) {
            // continue
        } else {
            return;
        }

        xhr.post(this.BASE_URL+'/rate-cards/service-categories/delete', 
        {
            id: scope.state.myCurrentId
        },
        function(data){
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

        xhr.post(this.BASE_URL+'/rate-cards/service-categories/sub-categories/create', 
        {
            service_category_id: scope.state.myCurrentId,
            name: newValue,
            level: "2"
        },
        function(data){
            scope.setState({subCategoryName: ""});
            scope.setState({showAddLevel: false});
            scope.setState({categoryLevelTwo: data.payload});
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
        xhr.post(this.BASE_URL+'/rate-cards/service-categories/sub-categories/update', {
                name: value,
                id: id
            },
            function(data){
                console.log('[Edit] Level two success', data);
            });
    }

    render(){
        let menuBtn = null;
        let scope = this;
        
        let level2 = function(){ return (<br/>) };

        let ulStyle = function(style){ return style; }
        let style = {};

        let hasLevel2 = false;

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
                                        <button type="button" className="btn btn-default">Rearrange</button>&nbsp; 
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
                    .map(function(data){
                        if( data.level ==="2" ){
                            hasLevel2 = true;

                            return (
                                <li key={data.id}>
                                    <span className="myHandle">::</span>
                                    <LevelThree 
                                        nextLevel={2}
                                        sortableId={data.id} 
                                        parentData={data} 
                                        arrayOfCurrentLevel={scope.state.categoryLevelTwo} 

                                        onDelete={scope.callbackDelete.bind(scope)} 
                                        onUpdate={scope.callbackUpdate.bind(scope)} 
                                    />
                                </li> )
                        }
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


