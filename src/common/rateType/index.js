import React, {Component} from 'react';
import {AddLevel} from '../_categories/addlevel';
import './ratetype.scss';

import xhr from 'jquery';

export class RateType extends Component {

    constructor(props){
        super(props);

        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        // this.BASE_URL = "http://cerebrum-api.dev:8096/api";

        this.state = {
            showAddRateType : false,
            rateTypeName: "",
            rateTypeArr: []
        }
    }

    componentDidMount(){
        let scope = this;

        xhr.get(this.BASE_URL+'/rate-cards/rate-types', function(data){
            scope.setState({ rateTypeArr: data.payload });
        });
    }

    onAddBtn(){
        this.setState({ showAddRateType: true });
    }
    
    onSave(newValue){
        let scope = this;

        if(newValue.length===0){
            alert('No type were set.');
            return;
        }

        xhr.post(this.BASE_URL+'/rate-cards/rate-types/create', {
            name: newValue
        },  
        function(data){
           scope.setState({ rateTypeArr: data.payload });
           scope.setState({ rateTypeName: "" });
           scope.setState({ showAddRateType: false });
        });
    }

    onCancel(){
        this.setState({ showAddRateType: false });
    }

    onDelete(evt){
        let id = xhr(evt.target)[0].dataset.storedid;
        let scope = this;
    
        if (confirm('Are you sure you want to delete this?')) {
            // continue
        } else {
            return;
        }

        xhr.post(this.BASE_URL+'/rate-cards/rate-types/delete', {
            id: id
        },  
        function(data){
            scope.state.rateTypeArr.map(function(el, index){
                if(el.id === +id){
                    scope.state.rateTypeArr.splice(index, 1);
                }
            });
            scope.setState({ rateTypeArr: scope.state.rateTypeArr });
        });
    }

    render(){
        let scope = this;

        let rateTypes = null;

        if(this.state.rateTypeArr.length!==0){
            rateTypes = 
                <tbody>
                { this.state.rateTypeArr.map(function(data){
                    return (
                            <tr key={data.id}>
                                <td>
                                    {data.name}
                                </td>
                                <td className="text-right">
                                    <button type="button" className="btn btn-danger" data-storedid={data.id} onClick={scope.onDelete.bind(scope)}><i className="fa fa-times"></i></button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>        
        }

        return (
            <div className="col-xs-12">

                <div className="col-xs-6">
                    &nbsp; 
                </div>

                <div className="col-xs-6 text-right">
                    <button type="button" className="btn btn-primary addBtn" onClick={this.onAddBtn.bind(this)}>Add</button>
                </div>

                <br className="clearfix"/>

               <table className='table table-hover table-bordered table-striped no-margin-bottom'>
                    <thead>
                        <tr>
                            <th>Rate Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    {rateTypes}
                </table>

                <div className="row">
                    <AddLevel 
                        hasAddLevel={this.state.showAddRateType}
                        name={this.state.rateTypeName}
                        onSave={this.onSave.bind(this)} 
                        onCancel={this.onCancel.bind(this)} />
                </div>

                <br />
            </div>
        )
    }
}