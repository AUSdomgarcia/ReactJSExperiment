// https://github.com/RubaXa/Sortable

import React, {Component} from 'react';

import './categoryTreeView.scss';

import jquery from 'jquery';

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
        //
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.rateCardName!==this.state.name){
            this.setState({ name: nextProps.rateCardName });
            this.setState({ description: nextProps.rateCardDesc });
        }

        console.log('componentWillReceiveProps');

        if(nextProps.serviceCategory!==this.state.serviceCategory){
            this.setState({ serviceCategory: nextProps.serviceCategory });
        }
    }

    componentWillMount(){
        if(this.props.rateCardName.length!==0){
            this.setState({ name: this.props.rateCardName });
            this.setState({ description: this.props.rateCardDesc });
        }

        console.log('componentWillMount');

        if(this.props.serviceCategory.length!==0){
            this.setState({ serviceCategory: this.props.serviceCategory });
        }
    }

    callbackOnDrag(){
        this.props.onDrag();
    }
    callbackOnDrop(result){
        this.props.onDrop(result);
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
                        
                        <ServiceViewer 
                            onDrag={scope.callbackOnDrag.bind(scope)} 
                            onDrop={scope.callbackOnDrop.bind(scope)}
                            uniqueId={data.id} 
                            servicesRef={data.services} />
                    </div>
                )
            })
            
        }

        return (
        <div>
            <div className='package-info'>
                <h3>{this.state.name}</h3>
                <p>{this.state.description}</p>
            </div>
            {servicesElement}
        </div>
        )
    }
}