import React, {Component} from 'react';

import {AddLevel} from './addlevel';

import xhr from 'jquery';

import sortable from 'sortablejs';

export class LevelThree extends Component {

    constructor(props){
        super(props);

        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        // this.BASE_URL = "http://cerebrum-api.dev:8096/api";

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
        }
        this.hackSortableInstance = null;
    }

    componentDidMount(){
        // console.log('parent', this.props.parentData);
    }

    componentWillReceiveProps(nextProps){
        // console.log(JSON.stringify(nextProps));
    }

    onManageBtn(){
        let scope = this;
        let el = document.getElementById('SortableLevelThree_' + this.props.sortableId);

        if(this.props.nextLevel===2){

            if(scope.hackSortableInstance!==null){
                scope.hackSortableInstance.destroy();
                console.log('destroying instance of ', scope.props.sortableId);
            }
            
            scope.hackSortableInstance = sortable.create( el , {
                animation: 100,
                handle: '.myHandle'
            });

            // console.log(this.props.sortableId);
            // console.log('Array of level one (combine level 2 and 3)', this.props.arrayOfCurrentLevel);
            // console.log('parent Data', this.props.parentData);
            // this.setState({ dataTree: this.props.arrayOfCurrentLevel });

            this.setState({ curLevelId: this.props.parentData.id });
            this.setState({ currentVersion: this.props.parentData.version });
            this.setState({ service_category_id: this.props.parentData.service_category_id });

            // GET THIRD LEVEL DATA
            xhr.get(this.BASE_URL+'/rate-cards/service-categories/sub-categories/level-3?parent_id='+ scope.props.parentData.id +'&version='+ scope.props.parentData.version, function(data){
                scope.setState({ dataTree: data.payload });
            });
        }

        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});
    }

    onAdd(){
        this.setState({showAddLevel:true});
    }
    
    onDone(){
        this.setState({isManageBtn:true});
        this.setState({isMenuBtn:false});
    }

    onSave(newValue){
        let scope = this;

        if(newValue.length===0){
            alert('No category were set.');
            return;
        }

        console.log('before set',newValue, scope.state.currentVersion)

        xhr.post(this.BASE_URL+'/rate-cards/service-categories/sub-categories/create', 
        {
            service_sub_category_id: scope.state.curLevelId,
            name: newValue,
            level: "3",
            version: scope.state.currentVersion,
            service_category_id: scope.state.service_category_id
        },
        function(data){
            console.log(data.payload);
            scope.setState({subCategoryName: ""});
            scope.setState({showAddLevel: false});
            scope.setState({dataTree: data.payload});
        });
    }

    onCancel(){
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

    onClickEdit(){
        let scope = this;
        let toggle = this.state.showInputName;
            toggle = !toggle;

        this.setState({showInputName: toggle});

        this.setState({inputCategoryName: this.props.parentData.name });

        // console.log( this.props.parentData );
        // return;

        if(toggle===false && this.state.inputCategoryName.length !== 0){
            this.props.onUpdate( this.state.inputCategoryName, this.props.parentData.id ); 
        }
    }

    onDelete(evt){
        let scope = this;
        let target = evt.target;

        // console.log(this.props.parentData);

        if (confirm('Are you sure you want to save this thing into the database?')) {
            // continue
        } else {
            return;
        }

        xhr.post(this.BASE_URL+'/rate-cards/service-categories/sub-categories/delete', 
        {
            id: scope.props.parentData.id
        },
        function(data){
            if(scope.hackSortableInstance!==null) scope.hackSortableInstance.destroy();
            scope.props.onDelete(scope.props.parentData.id);
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

       // Local Update
        this.state.dataTree.map(function(data){
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
                console.log('[Edit] Level three success', data);
            });
    }

    render(){
        let menuBtn = null;
        let scope = this;
        
        let parentData = this.props.parentData;

        let level3 = function(){ return (<br/>) };
        
        let ulStyle = function(style){ return style; }
        let style = {};

        let hasLevel3 = false;


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
                                <span className="name">{parentData.name} {parentData.version}</span>
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

                            } else {
                                elem = 
                                <div>
                                    <button type="button" className="btn btn-success" onClick={scope.onClickEdit.bind(scope)}><i className="fa fa-pencil-square-o"></i></button>&nbsp;
                                    <button type="button" className="btn btn-danger" onClick={scope.onDelete.bind(scope)}><i className="fa fa-times"></i></button> 
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
                    .map(function(data){
                        if(data.level==="3" && data.service_sub_category_id === scope.state.curLevelId ){
                            hasLevel3 = true;

                            return (
                                <li key={data.id}>
                                    <span className="myHandle">::</span>
                                    <LevelThree 
                                        nextLevel={3} 
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
                    onSave={this.onSave.bind(this)} 
                    onCancel={this.onCancel.bind(this)} />

            </div>
        )
    }
}
