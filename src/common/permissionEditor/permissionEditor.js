import React, {Component} from 'react';
import './permissionEditor.scss';

import xhr from 'jquery';

import SearchInput, {createFilter} from 'react-search-input';

import {getRateCardsPersonnelEmployees} from '../../common/http';

const KEYS_TO_FILTERS = [
            'company_email',
            'first_name',
            'middle_name',
            'nick_name',
            'family_name'
        ];

export class PermissionEditor extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            employees: [],
            employees_filtered:[],
            permittedUsers: [],
            currentWord: "",
        };
    }

    componentWillReceiveProps(nextProps){
        //
    }

    componentWillMount(){
        let scope = this;

        getRateCardsPersonnelEmployees().then(function(response){
            console.log('permission_editor', response);

            if(response.data.payload.length!==0){
                // copy
                scope.setState({employees: response.data.payload},
                
                function(){
                    if(scope.props.users!==scope.state.permittedUsers){
                        scope.setState({permittedUsers: scope.props.users},

                        function(){
                            scope.processFilter("");
                        });
                    }  
                });
            }
        });
    }

    componentDidMount(){
        //
    }

    checkForDuplicate(exclude, overall){
        exclude.map(function(data1, index, arr1){
            overall.map(function(data2, parentIndex){
                if(+data1.employee_number === +data2.employee_number){
                    overall.splice(parentIndex, 1);
                }
            });
        });
        return overall;
    }

    onAddEmployee(evt){
        let id = xhr(evt.target)[0].dataset.employeenumber;
        let index = xhr(evt.target)[0].dataset.index;
        let exists = false;
        let currIndex = 0;
        // let employee = this.state.employees;
        let employee = this.state.employees;
        let scope = this;

        if(id===undefined || id===null) return;
        if(index===undefined || index===null) return;

        console.log(index, id); 

        // initial when 0
        if(this.state.permittedUsers.length===0){
             this.state.employees_filtered.map(function(data, index){
                if(+data.employee_number === +id){
                    let _data = scope.state.employees_filtered.splice(index, 1)[0];
                    scope.setState({employees_filtered: scope.state.employees_filtered}, function(){
                        scope.state.permittedUsers.push(_data);
                    });
                }
            });

            this.setState({ permittedUsers: this.state.permittedUsers }, function(){
                scope.props.onUpdateArray(scope.state.permittedUsers);
            });
            return;
        }

        // checking
        for (let i = 0; i < this.state.permittedUsers.length; i++) {
            if (+this.state.permittedUsers[i].employee_number === +id) {
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
            this.state.employees_filtered.map(function(data, index){
                if(+data.employee_number === +id){
                    let _data = scope.state.employees_filtered.splice(index, 1)[0];
                    scope.setState({employees_filtered: scope.state.employees_filtered}, function(){
                        scope.state.permittedUsers.push(_data);
                    });
                }
            });
        }

        this.setState({ permittedUsers: this.state.permittedUsers }, function(){
            scope.props.onUpdateArray(scope.state.permittedUsers);
        });

        // window.sessionStorage.setItem('permittedUsers', JSON.stringify(this.state.permittedUsers) );
        // console.log('permittedUsers', window.sessionStorage.getItem('permittedUsers') );
    }

    onRemoveEmployee(evt){
        let index = xhr(evt.target)[0].dataset.index;
        if(index===undefined || index===null) return;

        let scope = this;
        let employee = this.state.permittedUsers.splice(index, 1)[0];

            console.log('whot?',employee);

        this.setState({ permittedUsers: this.state.permittedUsers }, function(){
            scope.processFilter(scope.state.currentWord);
            scope.props.onUpdateArray(this.state.permittedUsers);
        });

        // window.sessionStorage.setItem('permittedUsers', JSON.stringify(this.state.permittedUsers) );
        // console.log('permittedUsers', window.sessionStorage.getItem('permittedUsers') );
    }

    onKeyPress(event){
        this.processFilter(event.target.value);
    }

    processFilter(word){
        
        this.setState({currentWord: word});

        let filteredUser = this.state.employees;
            filteredUser = filteredUser.filter(createFilter(word, KEYS_TO_FILTERS));

        let users = this.checkForDuplicate(this.state.permittedUsers, filteredUser)

        this.setState({employees_filtered: users});
    }

    onFilterUsers(event){
        this.processFilter(event.target.value);
    }
    
    render(){
        let employeesTable = <tr><td colSpan={3}>Loading..</td></tr>;
        let permittedUsers = <tr><td colSpan={3}>No data.</td></tr>;
        let scope = this;

        if(this.state.employees_filtered.length!==0){
            employeesTable = 
            this.state.employees_filtered.map(function(data, index){
                return (
                    <tr key={data.employee_number}>
                        <td>{data.first_name} {data.middle_name} {data.family_name}</td>
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
        } else {
            employeesTable =
            <tr><td colSpan={3}>No data found.</td></tr>;
        }

        if(this.state.permittedUsers.length!==0){
            permittedUsers = 
            this.state.permittedUsers.map(function(data, index){
                return (
                    <tr key={data.employee_number}>
                        <td>{data.first_name} {data.middle_name} {data.family_name}</td>
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
                    <input type='text' 
                        className='form-control' 
                        onChange={this.onFilterUsers.bind(this)}
                        onKeyPress={this.onKeyPress.bind(this)}
                        placeholder='Search for...' />
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
                            {employeesTable}
                        </tbody>
                    </table>
                </div>

                <br/>
                <br/>

                {/* Permitted People */}
                
                <h4>Permitted User</h4>

                <div className='permitted-people maxheight300'>
                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email <small>(names reference)</small></th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {permittedUsers}
                        </tbody>
                    </table>
                </div>
        </div>
        )
    }
}