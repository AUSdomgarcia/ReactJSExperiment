import React, {Component} from 'react';
import './permissionEditor.scss';

import xhr from 'jquery';

import {getRateCardsPersonnelEmployees} from '../../common/http';

export class PermissionEditor extends Component {

    constructor(props){
        super(props);
        this.state = {
            employeesArr: [],
            permittedUserArr: []
        };
    }

    componentDidMount(){
        //   
    }
    
    componentWillReceiveProps(nextProps){
        
    }

    componentWillMount(){
        let scope = this;

        getRateCardsPersonnelEmployees().then(function(response){
            console.log('permission_editor', response);
            if(response.data.payload.length!==0){
                scope.setState({employeesArr: response.data.payload});
            }
        });
        
        if(this.props.defaultArr!==this.state.permittedUserArr){
            this.setState({permittedUserArr: this.props.defaultArr});
        }
    }

    onAddEmployee(evt){
        let id = xhr(evt.target)[0].dataset.employeenumber;
        let index = xhr(evt.target)[0].dataset.index;
        let exists = false;
        let currIndex = 0;
        let employee = this.state.employeesArr;

        if(id===undefined || id===null) return;
        if(index===undefined || index===null) return;

        console.log(index, id); 

        // initial when 0
        if(this.state.permittedUserArr.length===0){
            console.log('once');
            this.state.permittedUserArr.push(employee[index]);
            this.setState({ permittedUserArr: this.state.permittedUserArr });

            // window.sessionStorage.setItem('permittedUserArr', JSON.stringify(this.state.permittedUserArr) );
            // console.log('permittedUserArr', window.sessionStorage.getItem('permittedUserArr') );
            
            this.props.onUpdateArray(this.state.permittedUserArr);
            return;
        }

        // checking
        for (let i = 0; i < this.state.permittedUserArr.length; i++) {
            if (+this.state.permittedUserArr[i].employee_number === +id) {
                currIndex = i;
                exists = true;
            }
        }
        
        if(exists===true){
            if(confirm('Already in use.')){
                return;
            } else {
                return;
            }
        }
        
        if(exists===false){
            this.state.permittedUserArr.push(employee[index]);
        }

        this.setState({ permittedUserArr: this.state.permittedUserArr });

        // window.sessionStorage.setItem('permittedUserArr', JSON.stringify(this.state.permittedUserArr) );

        // console.log('permittedUserArr', window.sessionStorage.getItem('permittedUserArr') );
    
        this.props.onUpdateArray(this.state.permittedUserArr);
    }

    onRemoveEmployee(evt){
        let index = xhr(evt.target)[0].dataset.index;
        if(index===undefined || index===null) return;

        this.state.permittedUserArr.splice(index, 1);

        this.setState({ permittedUserArr: this.state.permittedUserArr });

        this.props.onUpdateArray(this.state.permittedUserArr);

        // window.sessionStorage.setItem('permittedUserArr', JSON.stringify(this.state.permittedUserArr) );

        // console.log('permittedUserArr', window.sessionStorage.getItem('permittedUserArr') );
    }
    
    render(){
        let employees = <tr><td colSpan={3}>Loading..</td></tr>;
        let permittedUser = <tr><td colSpan={3}>No data.</td></tr>;
        let scope = this;

        if(this.state.employeesArr.length!==0){
            employees = 
            this.state.employeesArr.map(function(data, index){
                return (
                    <tr key={data.id}>
                        <td>{data.first_name} {data.middle_name} {data.last_name}</td>
                        <td>{data.company_email}</td>
                        <td>
                            <button 
                                data-employeenumber={data.employee_number}
                                data-index={index} 
                                className='btn btn-primary' 
                                onClick={scope.onAddEmployee.bind(scope)}>Add</button>
                        </td>
                    </tr>
                )
            });
        }

        if(this.state.permittedUserArr.length!==0){
            permittedUser = 
            this.state.permittedUserArr.map(function(data, index){
                return (
                    <tr key={data.id}>
                        <td>{data.first_name} {data.middle_name} {data.last_name}</td>
                        <td>{data.company_email}</td>
                        <td>
                            <button 
                                data-employeenumber={data.employee_number}
                                data-index={index} 
                                className='btn btn-danger' 
                                onClick={scope.onRemoveEmployee.bind(scope)}>Remove</button>
                        </td>
                    </tr>
                )
            });
        }

        return(
            <div>

                <h4>Choose user to give permission</h4>
                        
                <div className='input-group'>
                    <span className='input-group-btn'>
                        <button className='btn btn-default' type='button'>
                            <i className='fa fa-search'></i>
                        </button>
                    </span>
                    <input type='text' className='form-control' placeholder='Search for...' />
                </div>

                <br />

                {/* Searched People */}
                <div className='searched-people maxheight300'>
                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email <small>(names reference)</small></th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees}
                        </tbody>
                    </table>
                </div>

                <br/>
                <br/>

                {/* Permitted People */}
                <div className='permitted-people maxheight300'>
                    <h4>Permitted User</h4>

                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email <small>(names reference)</small></th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {permittedUser}
                        </tbody>
                    </table>
                </div>
        
        </div>
        )
    }
}