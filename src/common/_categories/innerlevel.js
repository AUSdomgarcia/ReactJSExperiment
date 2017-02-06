import React, {Component} from 'react';

import {AddLevel} from './addlevel';

import Jquery from 'jquery';

export class InnerLevel extends Component {

    constructor(props){
        super(props);

        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";

        this.state = {
            isManageBtn: true,
            isMenuBtn: false,
            showAddLevel:false,

            dataTree: [],
            curLevelId: 0,
            currentVersion: "0.0",
            subCategoryName: "",

            service_category_id: 0
        }
    }

    componentDidMount(){
        // console.log('parent', this.props.parentData);
    }

    componentWillReceiveProps(nextProps){
        //
    }

    onManageBtn(){
        if(this.props.nextLevel===2){
            
            console.log('Array of level one (combine level 2 and 3)', this.props.arrayOfCurrentLevel);
            
            console.log('parent Data', this.props.parentData);

            this.setState({ dataTree: this.props.arrayOfCurrentLevel });

            this.setState({ curLevelId: this.props.parentData.id });
            
            this.setState({ service_category_id: this.props.parentData.service_category_id });
            
            this.setState({ currentVersion: this.props.parentData.version });
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

        Jquery.post(this.BASE_URL+'/rate-cards/service-categories/sub-categories/create', 
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

    render(){
        let mainElement = null;
        let parentData = this.props.parentData;
        let scope = this;
        let level3 = null;
        let hasLevel3 = false;

        if(parentData.level === this.props.nextLevel.toString()){
            
            mainElement = 
            <div>
                <div className="col-xs-6">
                    <span className="name">{parentData.name} {parentData.version}</span>
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
                                    elem = <button type="button" className="btn btn-default" onClick={scope.onManageBtn.bind(scope)}>Manage SubCategories</button> 
                                }
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
            <ul>
                { this.state.dataTree
                    .map(function(data){
                        if(data.level==="3" && data.service_sub_category_id === scope.state.curLevelId ){
                            hasLevel3 = true;

                            return (
                                <li key={data.id}>
                                    <InnerLevel nextLevel={3} parentData={data} />
                                </li>
                                )
                        }
                    })
                }
            </ul>

            if(hasLevel3 === false){
                level3 = null;
            }
        }
        
        return (
            <div>
                {mainElement}
                {level3}

                <AddLevel
                    hasAddLevel={this.state.showAddLevel}
                    name={this.state.subCategoryName}
                    onSave={this.onSave.bind(this)} 
                    onCancel={this.onCancel.bind(this)} />

            </div>
        )
    }
}
