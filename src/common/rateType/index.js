import React, {Component} from 'react';
import {AddLevel} from '../_categories/addlevel';

export class RateType extends Component {

    constructor(props){
        super(props);
        this.state = {
            showAddType : false,
            rateTypeName: ""
        }
    }

    onAddBtn(){
        this.setState({ showAddType: true });
    }
    
    onSave(newValue){
        this.setState({ rateTypeName: newValue });
    }

    onCancel(){
        this.setState({ showAddType: false });
    }

    render(){
        let addContent = null;
        let scope = this;

        return (
            <div className="col-xs-12">
                <div>
                    <div className="col-xs-6">
                        &nbsp; 
                    </div>
                    <div className="col-xs-6 text-right">
                        <button type="button" className="btn btn-primary" onClick={this.onAddBtn.bind(this)}>Add</button>
                    </div>
                    <br className="clearfix"/>
                </div>

                <br />
            
               <table className='table table-hover table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Rate Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Standard</td>
                            <td>
                                <button type="button" className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    </tbody>                           
                </table>

                <AddLevel 
                    hasAddLevel={this.state.showAddType}
                    name={this.state.rateTypeName}
                    onSave={this.onSave.bind(this)} 
                    onCancel={this.onCancel.bind(this)} />

                <br />
            </div>
        )
    }
}