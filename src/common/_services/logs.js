import React, {Component} from 'react';

import {getLogs} from '../../common/http';

import jquery from 'jquery';

import toastr from 'toastr';

import Pagination from 'react-js-pagination';

export class Logs extends Component {
    constructor(props){
        super(props);
        this.state = {
            logs: [],

            itemsCountPerPage: 5,
            totalItemsCount: 0,
            pageRangeDisplayed: 0,
            activePage: 1,
        }
    }

    componentDidMount(){
        // let scope = this;
        // getLogs(this.props.serviceid).then(function(response){
        //     if(response.data.hasOwnProperty('payload')===false) return;
        //     if(response.data.payload.length!==0){
        //         scope.setState({ logs: response.data.payload });    
        //     }
        // });
    }

    componentWillMount(){
        let scope = this;
        this.myPagination(this.state.activePage, this.state.itemsCountPerPage);
    }

    myPagination(page, limit){
        let id = this.props.serviceid;
        let scope = this;

        getLogs(id, page, limit)
        .then(function(response){
            
            console.log(id, page, limit, response);

            if(response.data.length!==0){
                let pagination = response.data.pagination;
                // data
                scope.setState({ logs: response.data.payload });

                scope.setState({ activePage: pagination.current_page });
                scope.setState({ totalItemsCount: pagination.total_records });
                scope.setState({ itemsCountPerPage: pagination.limit });
                scope.setState({ pageRangeDisplayed: pagination.total_records });
            }
        })
        .catch(function(response){
            if(response.data.error){
                toastr.error(response.data.message);
            }
        });
    }

    callbackPageChange(pageNumber){
        // console.log(`active page is ${pageNumber}`);
        let scope = this;
        this.setState({activePage: pageNumber}, function(){
            scope.myPagination(scope.state.activePage, scope.state.itemsCountPerPage);
        });
    }

    onPaginationLimit(evt){
        let scope = this;
        let value = +evt.target.value;
        
        this.setState({activePage: 1}, function(){
            scope.setState({itemsCountPerPage: value}, function(){
                scope.myPagination(scope.state.activePage, scope.state.itemsCountPerPage);
            });
        });
    }

    render(){
        let paginationComponent = null;


        let tableContent = 
                (<tr>
                    <td colSpan={7}>Loading data..</td>
                </tr>)

        if(this.state.logs.length !==0 ){
            tableContent = 
            this.state.logs.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{ data.id }</td>
                        <td>{ data.user.name }</td>
                        <td>{ data.activity }</td>
                        <td>{ data.field }</td>
                        <td dangerouslySetInnerHTML={{__html: data.from}}></td>
                        <td dangerouslySetInnerHTML={{__html: data.to}}></td>
                        <td>{ data.updated_at }</td>
                    </tr>
                )
            });

            paginationComponent = 
            <div>
                <div className="col-xs-6">
                    <Pagination
                    activePage={ this.state.activePage }
                    itemsCountPerPage={ this.state.itemsCountPerPage }
                    totalItemsCount={ this.state.totalItemsCount }
                    pageRangeDisplayed={ this.state.pageRangeDisplayed }
                    onChange={this.callbackPageChange.bind(this)}
                    />
                </div>
                
                <div className="col-xs-6">
                    <div className="row">
                    
                    <div className="col-xs-6">
                        <label>Page display limit:</label>
                    </div>
                    
                    <div className="col-xs-6">
                        <select className="form-control" value={this.state.itemsCountPerPage} onChange={this.onPaginationLimit.bind(this)}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                        <option value={60}>60</option>
                        <option value={70}>70</option>
                        <option value={80}>80</option>
                        <option value={90}>90</option>
                        <option value={100}>100</option>
                        </select>
                    </div>
                    
                    <br className="clearfix" />
                    </div>
                </div>
            
            <br className="clearfix" />
            </div>

        } else {
            tableContent =
                (<tr>
                    <td colSpan={7}>No data.</td>
                </tr>)
        }

        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Activity</th>
                        <th>Field</th>
                        <th>From</th>
                        <th>to</th>
                        <th>Updated at</th>
                    </tr>
                    </thead>

                    <tbody>
                        {tableContent}
                    </tbody>
                </table>

                <br />
                <br />

                {paginationComponent}
            </div>
        )
    }
}