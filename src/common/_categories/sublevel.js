import React, {Component} from 'react';
import {Link} from 'react-router';
import Jquery from 'jquery';

export default class SubLevel extends Component {

    constructor(props){
        super(props);
        this.state = {
                isShowManageBtn: true,
            };
    }

    componentDidMount(evt){
        // initial here
    }

    onManageCategories(){
        if(this.props.curData.lvlTwo.length!==0){
            // API request
            console.log(this.props.curData);
            
        }
    }

    onDone(){
        this.setState({isShow: true});
        this.setState({isCollapsed: false});
    }

    onAddLevel(){
        let isShowHiddenInput = this.state.isShowHiddenInput;
            isShowHiddenInput = !isShowHiddenInput;
        this.setState({isShowHiddenInput: isShowHiddenInput});
    }

    render(){
        let manageSubCategoriesBtn = null;
        let scope = this;

        if(this.state.isShowManageBtn){
          manageSubCategoriesBtn =
                <div>
                    <button type="button" className="btn btn-default pull-right" onClick={this.onManageCategories.bind(this)}>Manage SubCategories</button>
                    <br className="clearfix"/>
                </div>
        } else {
            manageSubCategoriesBtn = null;
        }
        
        return (
            <div className="sublevel-wrapper">
                <div className="col-xs-6">
                    {this.props.curData.name}
                </div>
                <div className="col-xs-6">
                    {manageSubCategoriesBtn}
                </div>
                <br className="clearfix" />
            </div>
        )
    }
}






// {/*let isCollapsed = this.state.isCollapsed;
//         let isShow   = this.state.isShow;
//         isShow = !isShow;
//         isCollapsed = !isCollapsed;
//         this.setState({isShow: isShow});
//         this.setState({isCollapsed: isCollapsed});
//         */}

    //     {/*
    //     let menuBtns = null;
    //     let thirdlevel = null;
    //     let hiddenInput = null;
    //     if(this.state.isCollapsed){
    //         menuBtns = 
    //                 <div className="menu align-right">
    //                     <button type="button" className="btn btn-default">Rearrange</button>
    //                     &nbsp;
    //                     <button type="button" className="btn btn-primary" onClick={this.onAddLevel.bind(this)}>Add Level {this.props.levelCount}</button>
    //                     &nbsp;
    //                     <button type="button" className="btn btn-success" onClick={this.onDone.bind(this)}>Done</button>
    //                 </div>
    //     } else {
    //         menuBtns = 
    //                 <div className="menu align-right hide">
    //                     <button type="button" className="btn btn-default">Rearrange</button>
    //                     &nbsp;
    //                     <button type="button" className="btn btn-primary" onClick={this.onAddLevel.bind(this)}>Add Level {this.props.levelCount}</button>
    //                     &nbsp;
    //                     <button type="button" className="btn btn-success" onClick={this.onDone.bind(this)}>Done</button>
    //                 </div>
    //     }

    //     if(this.state.isShowHiddenInput){
    //         hiddenInput = 
    //                 <div className="row">
    //                     <div className="col-xs-6">
    //                         <input type="text" className="form-control"/>  
    //                     </div>
    //                     <div className="col-xs-6">
    //                         <button type="button" className="btn btn-danger">Cancel</button>
    //                         <button type="button" className="btn btn-success">Save</button>
    //                     </div>
    //                 </div>
    //     } else {
    //         hiddenInput = null;
    //     }
    // */}
