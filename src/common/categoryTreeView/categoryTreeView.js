// https://github.com/RubaXa/Sortable

import React, {Component} from 'react';

import './categoryTreeView.scss';

import {ServiceViewer} from '../../common/_ratecard/serviceViewer';

export class CategoryTreeView extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: "",
            serviceCategory: []
        }
    }

    componentDidMount(){
        // var categoryItem1 = document.getElementById('category-item1');
        // sortable.create(categoryItem1, {
        //     handle: '.my-handle',
        //     animation: 150,
        // });

        // var categoryItem2 = document.getElementById('category-item2');
        // sortable.create(categoryItem2, {
        //     handle: '.my-handle',
        //     animation: 150,
        // });
        console.log('componentDidMount');
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.ratecardname!==this.state.name){
            this.setState({ name: nextProps.ratecardname });
            this.setState({ description: nextProps.ratecarddesc });
        }

        console.log('componentWillReceiveProps');

        if(nextProps.serviceCategory!==this.state.serviceCategory){
            this.setState({ serviceCategory: nextProps.serviceCategory });
        }
    }

    componentWillMount(){
        if(this.props.ratecardname.length!==0){
            this.setState({ name: this.props.ratecardname });
            this.setState({ description: this.props.ratecarddesc });
        }

        console.log('componentWillMount');

        if(this.props.serviceCategory.length!==0){
            this.setState({ serviceCategory: this.props.serviceCategory });
        }
    }

    render(){
        let scope = this;
        let servicesElement = <div>No Category.</div>

        if(this.state.serviceCategory.length!==0){
            servicesElement = 
            this.state.serviceCategory.map(function(data){
                return (
                    <div key={data.id} className='category-list-opt-nested'>
                        <label className='category-name'>{data.name}</label>

                        <div className='category-title clearfix'>
                            <div><strong>Service Name</strong></div>
                            <div><strong>Description</strong></div>
                            <div><strong>Cost</strong></div>
                        </div>

                        <ServiceViewer uniqueId={data.id} servicesRef={data.services} />
                    </div>
                )
            })
            
        }

        return (
        <div>
            <div className='package-info'>
                <h4>{this.state.name}</h4>
                <small>{this.state.description}</small>
            </div>

            <br />

            {servicesElement}
            
                {/* Category listing with table data inside */}
            
            {/*
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

            */}

                {/* Category listing with table data inside */}
            
            {/*
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

            */}

        </div>
        )
    }
}