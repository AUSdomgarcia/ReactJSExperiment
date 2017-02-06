import React, {Component} from 'react';

import {InnerLevel} from './innerlevel';
import {AddLevel} from './addlevel';
import Jquery from 'jquery';

export class LevelTwo extends Component {

    constructor(props){
        super(props);

        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        
        this.state = {
            isManageBtn: true,
            isMenuBtn: false,
            showAddLevel: false,
            subCategoryName: "",

            subCategoryData: [],
            currentVersion: "0.0",
            myCurrentId: 0,
        }
    }

    componentDidMount(evt){
        // initial here
    }

    componentWillReceiveProps(nextProps){
        let tempArr = nextProps.parentData['sub_categories'];

        if(tempArr !== this.state.subCategoryData){
            // categories Array
            this.setState({ subCategoryData: tempArr });
            // id Integer
            this.setState({ myCurrentId: nextProps.parentData.id });
            // version String
            if(tempArr.length!==0) {
                this.setState({ currentVersion: tempArr[tempArr.length-1].version });
            }
            console.log('level one contains', tempArr.length);
        }
    }

    onManageBtn(){
        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});
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

        Jquery.post(this.BASE_URL+'/rate-cards/service-categories/sub-categories/create', 
        {
            service_category_id: scope.state.myCurrentId,
            name: newValue,
            level: "2"
        },
        function(data){
            scope.setState({subCategoryName: ""});
            scope.setState({showAddLevel: false});
            scope.setState({subCategoryData: data.payload});
        });
    }

    render(){
        let menuBtn = null;
        let level2 = null;
        let scope = this;

        menuBtn = 
            <div>
                <div className="col-xs-6">
                    <span className="name">{this.props.parentData.name}</span>
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
                                elem = <button type="button" className="btn btn-default" onClick={scope.onManageBtn.bind(scope)}>Manage SubCategories</button> 
                            }
                            return (elem)
                        })(scope)}
                    </div>
                </div>
                <br className="clearfix"/>

            </div>
        
        if(this.state.isMenuBtn && this.state.subCategoryData.length !==0){
            level2 = 
            <ul>
                { this.state.subCategoryData
                    .map(function(data){
                        if( data.level ==="2" ){
                            return (
                                <li key={data.id}>
                                    <InnerLevel nextLevel={2} parentData={data} arrayOfCurrentLevel={scope.state.subCategoryData} />
                                </li> )
                        }
                    }) 
                }
            </ul>
        }
        
        return (
            <div>
                {menuBtn}
                {level2}

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


