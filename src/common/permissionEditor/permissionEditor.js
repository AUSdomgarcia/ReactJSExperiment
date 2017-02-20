import React, {Component} from 'react';
import './permissionEditor.scss';

import xhr from 'jquery';

import {getRateCardsPersonnelEmployees} from '../../common/http';

export class PermissionEditor extends Component {

    constructor(props){
        super(props);
        this.state = {
            employees: [],
            employees_filtered:[],
            permittedUsers: []
        };
    }

    componentDidMount(){
        //   
    }
    
    componentWillReceiveProps(nextProps){
        
    }

    componentWillMount(){
        let scope = this;

        let includedServiceArr = window.sessionStorage.getItem('includedServiceArr') || [];
        console.log('permissionEditor', includedServiceArr);

        getRateCardsPersonnelEmployees().then(function(response){
            console.log('permission_editor', response);
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                scope.setState({employees: response.data.payload});
                // copy
                scope.setState({employees_filtered: response.data.payload});
                console.log('employess', response.data.payload.length);
            }
        });

        if(this.props.defaultArr!==this.state.permittedUsers){
            this.setState({permittedUsers: this.props.defaultArr});
        }
    }

    onAddEmployee(evt){
        let id = xhr(evt.target)[0].dataset.employeenumber;
        let index = xhr(evt.target)[0].dataset.index;
        let exists = false;
        let currIndex = 0;
        let employee = this.state.employees;
        let scope = this;

        if(id===undefined || id===null) return;
        if(index===undefined || index===null) return;

        console.log(index, id); 

        // initial when 0
        if(this.state.permittedUsers.length===0){
            console.log('once');
            // this.state.permittedUsers.push(employee[index]);
             this.state.employees.map(function(data){
                //  console.log('what?', +data.employee_number, +id);
                if(+data.employee_number === +id){
                    scope.state.permittedUsers.push(data);
                }
            });

            this.setState({ permittedUsers: this.state.permittedUsers });

            // window.sessionStorage.setItem('permittedUsers', JSON.stringify(this.state.permittedUsers) );
            // console.log('permittedUsers', window.sessionStorage.getItem('permittedUsers') );
            
            this.props.onUpdateArray(this.state.permittedUsers);
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
            this.state.employees.map(function(data){
                if(+data.employee_number === +id){
                    scope.state.permittedUsers.push(data);
                }
            });
            // this.state.permittedUsers.push(employee[index]);
        }
        this.setState({ permittedUsers: this.state.permittedUsers });
        // window.sessionStorage.setItem('permittedUsers', JSON.stringify(this.state.permittedUsers) );
        // console.log('permittedUsers', window.sessionStorage.getItem('permittedUsers') );
        this.props.onUpdateArray(this.state.permittedUsers);
    }

    onRemoveEmployee(evt){
        let index = xhr(evt.target)[0].dataset.index;
        if(index===undefined || index===null) return;

        this.state.permittedUsers.splice(index, 1);

        this.setState({ permittedUsers: this.state.permittedUsers });

        this.props.onUpdateArray(this.state.permittedUsers);

        // window.sessionStorage.setItem('permittedUsers', JSON.stringify(this.state.permittedUsers) );

        // console.log('permittedUsers', window.sessionStorage.getItem('permittedUsers') );
    }

    onKeyPress(event){
        let word = event.target.value;
        let scope = this;

        if(event.key==='Enter'){
            this.setState({employees_filtered: this.state.employees });
            
            let delay = setTimeout(function(){
                clearTimeout(delay);
                scope.processFilter(word);
            }, 100);
        }
    }

    onFilterUsers(event){
        this.processFilter(event.target.value);
    }

    processFilter(word){
        let updatedList = this.state.employees_filtered || [];
        if(updatedList.length===0) return;
        
        let scope = this;
        let filtered = [];
        let typed = word.trim();

        updatedList.map(function(data, index, arr){
            // by email
            if( data.company_email.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.setState({employees_filtered:filtered});
            // by first name
            } else if( data.first_name.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.setState({employees_filtered:filtered});
            // by family name
            } else if( data.family_name.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.setState({employees_filtered:filtered});
            // by middle name
            } else if( data.middle_name.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.setState({employees_filtered:filtered});
            // by nick name
            } else if(data.nick_name!==null){
                data.nick_name.toLowerCase().includes(typed);
                filtered.push(data);
                scope.setState({employees_filtered:filtered});
            }
        });

        if(word.length===0) this.setState({employees_filtered: this.state.employees });
    }
    
    render(){
        let employeesTable = <tr><td colSpan={3}>Loading..</td></tr>;
        let permittedUser = <tr><td colSpan={3}>No data.</td></tr>;
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
        }

        if(this.state.permittedUsers.length!==0){
            permittedUser = 
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
                            {permittedUser}
                        </tbody>
                    </table>
                </div>
        
        </div>
        )
    }
}