import React, {Component} from 'react';

import {getLogs} from '../../common/http';

export class Logs extends Component {
    constructor(props){
        super(props);
        this.state = {
            logsArr: []
        }
    }

    componentDidMount(){
        let scope = this;
        getLogs(this.props.serviceid).then(function(response){
            if(response.data.hasOwnProperty('payload')===false) return;
            if(response.data.payload.length!==0){
                scope.setState({ logsArr: response.data.payload });    
            }
        });
    }

    render(){
        let tableContent = 
                (<tr>
                    <td colSpan={5}>Loading data..</td>
                </tr>)

        if(this.state.logsArr.length !==0 ){
            tableContent = 
            this.state.logsArr.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{ data.id }</td>
                        <td>{ data.user.name }</td>
                        <td>{ data.activity }</td>
                        <td>{ data.value }</td>
                        <td>{ data.updated_at }</td>
                    </tr>
                )
            });
        } else {
            tableContent =
                (<tr>
                    <td colSpan={5}>No data.</td>
                </tr>)
        }

        return (
             <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Activity</th>
                    <th>Value</th>
                    <th>Updated at</th>
                </tr>
                </thead>

                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }
}