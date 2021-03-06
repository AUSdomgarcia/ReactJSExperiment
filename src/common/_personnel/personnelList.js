import React, {Component} from 'react';
import {Link} from 'react-router';

import './personnel.scss';

import xhr from 'jquery';

import { postPersonnelsDelete } from '../../common/http';

export class PersonnelList extends Component {

    constructor(props){
        super(props);

        this.state = {
            parentDataCopy: []
        }
    }

    onDelete(evt){

        if(confirm('Are you sure you want to delete?')){
            //
        } else {
            return;
        }

        let id = xhr(evt.target)[0].dataset.storedid;
        let scope = this;

        // xhr.post(this.BASE_URL+'/rate-cards/personnels/delete', 
        //     {
        //         id: id
        //     },
        //     function(data){
        //         scope.props.onDelete(id);
        //     });
        
        postPersonnelsDelete({ id: id })
        .then(function(response){
            scope.props.onDelete(id);
        })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        })
    }

    componentWillReceiveProps(nextProps){
        if(this.state.parentDataCopy !== nextProps.parentData){
            this.setState({parentDataCopy: nextProps.parentData});
        }
    }

    render(){
    
    let scope = this;
    let tableContent = null;
    
    if(this.state.parentDataCopy !== undefined){
        tableContent = 
                this.state.parentDataCopy.map(function(data){
                        return (
                            <tr key={data.id}>
                                <td>{data.rate_type.name}</td>
                                <td>{data.position.name}</td>
                                <td>{data.department.name}</td>
                                <td>{data.manhour_rate}</td>

                                <td>
                                    <Link className='btn btn-primary' 
                                        to={'/personnel/edit' + 
                                            '/' + data.id +
                                            '/' + data.rate_type.id + 
                                            '/' + data.department._id +
                                            '/' + data.position._id +
                                            '/' + data.manhour_rate } >Edit</Link> &nbsp;
                                    <button className='btn btn-danger' data-storedid={data.id} onClick={scope.onDelete.bind(scope)}>Delete</button>
                                </td>
                            </tr> )
                    } )
            
    }

    return (
        <div className='personnel-list'>
            <table className='table table-bordered table-hover table-striped'>
                <thead>
                <tr>
                    <th>Rate Type</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Manhour Rate</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        </div>)
    }
}

PersonnelList.contextTypes = {
  router: React.PropTypes.object.isRequired
};