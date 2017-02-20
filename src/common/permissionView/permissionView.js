import React, {Component} from 'react';

import './permissionView.scss';
import {getRateCardsPersonnelEmployeesByDefault} from '../../common/http';

export class PermissionView extends Component {
    constructor(props){ 
        super(props);
        this.state = {
            permittedUserRef: [],
            employeeDefault: []
        };
    }

    componentWillMount(){
        let permittedUser = JSON.parse(this.props.permittedUser) || [];
        let scope = this;
        // console.log('BALITANGINA', permittedUser, typeof permittedUser);
        if(permittedUser.length!==0){
            this.setState({permittedUserRef: permittedUser});
        }

        getRateCardsPersonnelEmployeesByDefault()
            .then(function(response){
                if(response.data.hasOwnProperty('payload')===false) return;
                if(response.data.payload.length!==0){
                    scope.setState({employeeDefault: response.data.payload});            
                }
            });
    }

    render(){
        let scope = this;
        let permittedUserList = <li>No data.</li>

        if(this.state.permittedUserRef.length!==0){
            permittedUserList = 
            this.state.permittedUserRef.map(function(data){
                return (
                    <li key={data.id}>
                        {data.first_name} {data.middle_name} {data.family_name}
                    </li>
                )
            });
        }
        let employeeDefaultElement = <li>No data.</li>

        if(this.state.employeeDefault.length!==0){
            employeeDefaultElement = 
            this.state.employeeDefault.map(function(data){
                return (
                    <li key={data.id}>{data.first_name} {data.middle_name} {data.family_name}</li>
                )
            });
        }

        return (
            <div className='permission-wrapper clearfix'>

                <div className='left-section -small'>
                    Creator
                </div>
                <div className='right-section -small'>
                    <p className='creator-name'>Dynamic Name</p>
                </div>

                <div className='left-section -big'>
                    <span>Default</span>
                </div>
                <div className='right-section -big'>
                   <ul>
                        {employeeDefaultElement}
                    </ul>
                </div>

                <div className='left-section -big'>
                    <span>Permitted</span>
                </div>
                <div className='right-section -big'>
                    <ul>
                        {permittedUserList}
                    </ul>
                </div>

            </div>
        );
    }
}