import React, {Component} from 'react';

import sortable from 'sortablejs';

import '../categoryTreeView/categoryTreeView.scss';

import jquery from 'jquery';

export class ServiceViewer extends Component {
    
    constructor(props){
        super(props);
        this.hackSortableInstance = null;
        this.state = {
            servicesRef: [],
            useSort: false
        }
    }

    componentWillMount(){
        if(this.props.servicesRef!==null || this.props.servicesRef!==undefined ){
            if(this.props.servicesRef.length!==0){
                this.props.servicesRef.map(function(data, index){
                    jquery.extend(data, {order:index});
                });
            this.setState({servicesRef: this.props.servicesRef});
            }
        }
        // console.log('new serviceref', this.props.servicesRef);
    }

    componentDidMount(){
        let scope = this;

        const column = jquery('.three-column');
        column.height(column.parent().height() + 10);

        let el = document.getElementById('sortableItem_' + this.props.uniqueId);

        if(this.hackSortableInstance!==null){
            this.hackSortableInstance.destroy();
            console.log('destroying instance of ', this.props.uniqueId);
        }

        this.hackSortableInstance = sortable.create( el , {
            handle: '.my-handle',
            animation: 150,

            onStart: function(){
                scope.props.onDrag()   
            },

            onEnd: function(e){
                let boolUseSort = (true == window.sessionStorage.getItem('useSort')) || scope.state.useSort;
                if(boolUseSort) return;

                var items = e.to.children;
                var result = [];
                for (var i = 0; i < items.length; i++) {
                    result.push({ id: jquery(items[i])[0].dataset.id, service_id: jquery(items[i])[0].dataset.id, order: i });
                }

                console.log('ratecard/save/onEnd', result);

                scope.props.onDrop({json: result, changed: '0'});
            },
            
            onSort: function(e){
                var items = e.to.children;
                var result = [];
                for (var i = 0; i < items.length; i++) {
                    result.push({ id: jquery(items[i])[0].dataset.id, service_id: jquery(items[i])[0].dataset.id, order: i });
                }

                console.log('ratecard/save/onSort', result);

                scope.props.onDrop({json: result, changed: '1'});
                
                scope.setState({useSort:true});
                window.sessionStorage.setItem('useSort','true');
            }
        });
    }

    render(){
        let scope = this;
        let servicesList = <li>No Service.</li>

        if(this.state.servicesRef.length!==0){
            servicesList = 
            this.state.servicesRef.map(function(data){
                return (
                    <li key={data.id} data-id={data.id} className='with-draggable-child clearfix'>
                        <span className='my-handle'>:: </span>
                        <div className='three-column'>{data.name}</div>{/*<strong>[{data.order}]</strong> */}    
                        <div className='three-column'>{data.description}</div>    
                        <div className='three-column'>{ (+data.subtotal).formatMoney(2, '.', ',') }</div>    
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