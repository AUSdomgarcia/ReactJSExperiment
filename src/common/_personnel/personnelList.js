import React, {Component} from 'react';
import {Link} from 'react-router';

import './personnel.scss';

import xhr from 'jquery';

export class PersonnelList extends Component {

    constructor(props){
        super(props);

        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        
        this.state = {
            personnelData: []
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.state.personnelData !== nextProps.updatedRateType){
            this.setState({personnelData: nextProps.updatedRateType});
        }
    }

    componentDidMount(){
        let scope = this;

        xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
            scope.setState({ personnelData: data.payload });
        });
    }

    onDelete(evt){
        let id = xhr(evt.target)[0].dataset.storedid;
        let scope = this;

        xhr.post(this.BASE_URL+'/rate-cards/personnels/delete', 
            {
                id: id
            },
            function(data){
                console.log('delete completed.', data);

                scope.state.personnelData.map(function(data, index){
                    if(data.id === +id){
                        scope.state.personnelData.splice(index, 1);
                        scope.props.onDelete(scope.state.personnelData);
                    }
                });
            });
    }

    onEdit(evt){
        let ratetype = xhr(evt.target)[0].dataset.ratetype;
        let department = xhr(evt.target)[0].dataset.department;
        let position = xhr(evt.target)[0].dataset.position;
        let manhour = xhr(evt.target)[0].dataset.manhour;
        let storedid = xhr(evt.target)[0].dataset.storedid;

        this.props.onEdit( storedid, ratetype, department, position, manhour);

        this.context.router.push('/personnel/edit');
    }

    render(){
    
    let scope = this;
    let tableContent = null;
    
    if(this.state.personnelData !== undefined){
        tableContent = 
                this.state.personnelData.map(function(data){
                        return (
                            <tr key={data.id}>
                                <td>{data.rate_type.name}</td>
                                <td>{data.position.name}</td>
                                <td>{data.department.name}</td>
                                <td>{data.manhour_rate}</td>

                                <td>
                                    {/*<Link className='btn btn-primary' 
                                    to={'/personnel/edit' + 
                                        '/' + data.rate_type.id + 
                                        '/' + data.department._id +
                                        '/' + data.position._id +
                                    '/' + data.manhour_rate }>Edit</Link>*/} 
                                    
                                    <button type="button" 
                                        className='btn btn-primary'

                                        data-storeid={data.id}
                                        data-ratetype={data.rate_type.id} 
                                        data-department={data.department._id}
                                        data-position={data.position._id}
                                        data-manhour={data.manhour_rate}
                                        
                                        onClick={scope.onEdit.bind(scope)}>Edit</button> &nbsp;
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