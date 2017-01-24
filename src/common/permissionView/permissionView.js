import React, {Component} from 'react';

import './permissionView.scss';

export default class PermissionView extends Component {

    render(){
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
                        <li>Monica Climaco</li>
                        <li>Brian Brandares</li>
                        <li>Kyle Ong</li>
                    </ul>
                </div>

            </div>
        );
    }
}