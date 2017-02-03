import React, {Component} from 'react';

import {InnerLevel} from './innerlevel';
import {AddLevel} from './addlevel';

export class LevelOne extends Component {

    constructor(props){
        super(props);
        this.state = {
            isManageBtn: true,
            isMenuBtn: false,
            hasAddLevel: false,
            categoryNameOrigin: "AA" 
        }
    }

    componentDidMount(evt){
        // initial here
        console.log('level 1', this.props.curData);
    }

    onManage(){
        if(this.props.curData['sub_categories'].length===0) return;

        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});
    }

    onDone(){
        this.setState({isManageBtn:true});
        this.setState({isMenuBtn:false});
    }

    onAdd(){
        this.setState({hasAddLevel:true});
    }

    onCancel(){
        this.setState({hasAddLevel:false});
    }

    onSave(inputCategoryName){
        this.setState({categoryNameOrigin:inputCategoryName});
    }

    render(){
        let mainElement = null;
        let subElement = null;
        let scope = this;
        let subCategories = this.props.curData['sub_categories'];

        if( this.props.curData.length!==0 ){
            mainElement = 
                <div>
                    <div className="col-xs-6">
                        <span className="name">{this.props.curData.name}</span>
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
                                    elem = <button type="button" className="btn btn-default" onClick={scope.onManage.bind(scope)}>Manage SubCategories</button> 
                                }
                                return (elem)
                            })(scope)}
                        </div>
                    </div>
                    <br className="clearfix"/>
                </div>
            
            if(this.state.isMenuBtn){
                subElement = 
                    <ul>
                        { subCategories.map(function(data){
                            if(data.level==="2"){
                                return (
                                    <li key={data.id}>
                                        <InnerLevel level={2} curData={data} parentData={subCategories}/>
                                    </li>
                                )
                            }
                        })}
                    </ul>
            }
        }
        
        return (
            <div>
                {mainElement}
                {subElement}
                <AddLevel hasAddLevel={this.state.hasAddLevel} categoryName={this.state.categoryNameOrigin} onSave={this.onSave.bind(this)} onCancel={this.onCancel.bind(this)} />
            </div>
        )
    }
    
}


