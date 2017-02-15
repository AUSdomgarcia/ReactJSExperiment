import React, {Component} from 'react';

import sortable from 'sortablejs';

import '../categoryTreeView/categoryTreeView.scss';

export class ServiceViewer extends Component {
    
    constructor(props){
        super(props);
        this.hackSortableInstance = null;
        this.state = {
            servicesRef: []
        }
    }

    componentWillMount(){
        this.setState({ servicesRef: this.props.servicesRef });
    }

    componentDidMount(){
        let scope = this;

        let el = document.getElementById('sortableItem_' + this.props.uniqueId);

        if(this.hackSortableInstance!==null){
            this.hackSortableInstance.destroy();
            console.log('destroying instance of ', this.props.uniqueId);
        }

        this.hackSortableInstance = sortable.create( el , {
            handle: '.my-handle',
            animation: 150,
        });
    }

    render(){
        let scope = this;
        let servicesList = <li>No Service.</li>

        if(this.state.servicesRef.length!==0){
            servicesList = 
            this.state.servicesRef.map(function(data){
                return (
                    <li key={data.id} className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>{data.name}</div>    
                        <div className='three-column'>{data.description}</div>    
                        <div className='three-column'>{data.subtotal}</div>    
                    </li>
                )
            })
        }

        return (
            <ul id={'sortableItem_' + scope.props.uniqueId}>
                {servicesList}
            </ul>
        )
    }
}