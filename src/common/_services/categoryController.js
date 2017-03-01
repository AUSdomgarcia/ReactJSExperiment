import React, {Component} from 'react';

import xhr from 'jquery';
import {postServiceDelete} from '../../common/http';

export class CategoryController extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            services: [],
            category_level3: [],
        }
    }

    componentWillMount(){
        // Level 2
        if(this.state.services !== this.props.data.services){
            this.setState({ services: this.props.data.services });
        }

        // Level 3
        console.log('>>_>>', this.props.data.hasOwnProperty('sub_categories'), this.props.data);

        if(!this.props.data.hasOwnProperty('sub_categories')) return;

        if(this.state.category_level3 !== this.props.data.sub_categories){
            this.setState({category_level3: this.props.data.sub_categories});
        }
    }

    componentDidMount(){
        // ...
    }

    onDelete(evt){
        let scope = this;
        let id = xhr(evt.target)[0].dataset.serviceid;

        if(id === undefined || id===null) return;

        if(confirm('Are you sure you want to delete this service?')){
            //
        } else {
            return;
        }

         postServiceDelete({id: id}).then(function(response){
            alert('Service deleted.');
            scope.state.services.map(function(data, idx){
                if(data.id.toString() === id.toString()){
                    scope.state.services.splice(idx, 1);
                }
            });
            scope.setState({ services: scope.state.services });
       })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        });
    }

    render(){
        let serviceTable = <tr><td colSpan={5}>No service.</td></tr>
        let categoryLevel3List = <li>No category level 3.</li>
        let scope = this;
        
        if(this.state.services.length!==0){
            serviceTable = 
            this.state.services.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.service_id}</td>
                        <td>{'data.rate_type.name'}</td>
                        <td>{ data.subtotal } </td>
                        <td>{(data.is_active==='1' ? 'Active' : 'Inactive')}</td>
                        <td>
                            <button type="button" className="btn btn-default">Edit</button>&nbsp;
                            <button 
                                type="button"
                                className="btn btn-danger" 
                                data-serviceid={data.id} 
                                onClick={scope.onDelete.bind(scope)}>&times;</button>
                        </td>
                    </tr>
                )
            });

        } else {
            serviceTable = <tr><td colSpan={5}>No service.</td></tr>;
        }

        if(this.state.category_level3.length!==0){
            categoryLevel3List =
            this.state.category_level3.map(function(data){
                return (
                    <CategoryController key={data.id} data={data}/>
                )
            });
            
        } else {
            categoryLevel3List = null;
        }
        
        return (
            <div>
                <h4 className="sky">{this.props.data.name}</h4>

                <table className='table table-hover table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Services</th>
                            <th>Rate Type</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {serviceTable}
                    </tbody>                           
                </table>

                <ul>
                    {categoryLevel3List}
                </ul>
            </div>
        )
    }
}
