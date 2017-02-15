import React, {Component} from 'react';

import './permissionView.scss';

export class PermissionView extends Component {
    constructor(props){ 
        super(props);
        this.state = {
            permittedUserRef: []
        };
    }

    componentWillMount(){
        let permittedUser = JSON.parse(this.props.permittedUser) || [];

        console.log('BALITANGINA', permittedUser, typeof permittedUser);

        if(permittedUser.length!==0){
            this.setState({permittedUserRef: permittedUser});
        }
    }

    render(){
        let scope = this;
        let permittedUserList = <li>No data.</li>

        if(this.state.permittedUserRef.length!==0){
            permittedUserList = 
            this.state.permittedUserRef.map(function(data){
                return (
                    <li key={data.id}>
                        {data.first_name} {data.middle_name} {data.last_name}
                    </li>
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
                        <li>Tom De Leon</li>
                        <li>Michael Ng</li>
                        <li>Jeff Saez</li>
                        <li>Connie Balmaceda</li>
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