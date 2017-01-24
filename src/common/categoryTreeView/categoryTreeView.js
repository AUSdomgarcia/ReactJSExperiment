// https://github.com/RubaXa/Sortable

import React, {Component} from 'react';

import './categoryTreeView.scss';

import sortable from 'sortablejs';

export default class CategoryTreeView extends Component {

    componentDidMount(){
        var categoryItem1 = document.getElementById('category-item1');
        sortable.create(categoryItem1, {
            handle: '.my-handle',
            animation: 150,
        });

        var categoryItem2 = document.getElementById('category-item2');
        sortable.create(categoryItem2, {
            handle: '.my-handle',
            animation: 150,
        });
    }

    render(){

        return (
        <div>
            <div className='package-info'>
                <h4>[Dynamic] Web Development Package</h4>
                <small>[Dynamic] Package of Unilever</small>
            </div>

            <br />
            
            {/* Category listing with table data inside */}
            <div className='category-list-opt-nested'>
            
                <label className='category-name'>[Dynamic] Digital Strategy</label>

                <div className='category-title clearfix'>
                    <div><strong>Service Name</strong></div>
                    <div><strong>Description</strong></div>
                    <div><strong>Cost</strong></div>
                </div>
                
                <ul id='category-item1'>
                    <li className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>one</div>    
                        <div className='three-column'>two</div>    
                        <div className='three-column'>three</div>    
                    </li>

                    <li className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>one</div>    
                        <div className='three-column'>two</div>    
                        <div className='three-column'>three</div>    
                    </li>

                    <li className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>one</div>    
                        <div className='three-column'>two</div>    
                        <div className='three-column'>three</div>    
                    </li>
                </ul>
            </div>

            {/* Category listing with table data inside */}
            <div className='category-list-opt-nested'>
            
                <label className='category-name'>[Dynamic] Creatives</label>

                <div className='category-title clearfix'>
                    <div><strong>Service Name</strong></div>
                    <div><strong>Description</strong></div>
                    <div><strong>Cost</strong></div>
                </div>
                
                <ul id='category-item2'>
                    <li className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>one</div>    
                        <div className='three-column'>two</div>    
                        <div className='three-column'>three</div>    
                    </li>

                    <li className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>one</div>    
                        <div className='three-column'>two</div>    
                        <div className='three-column'>three</div>    
                    </li>

                    <li className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>one</div>    
                        <div className='three-column'>two</div>    
                        <div className='three-column'>three</div>    
                    </li>
                </ul>
            </div>

        </div>
        )
    }
}