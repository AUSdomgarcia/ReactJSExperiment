import React, {Component} from 'react';
import {AddLevel} from '../_categories/addlevel';
import './ratetype.scss';

import xhr from 'jquery';

import {
    getServiceRateTypes, 
    postServiceRateTypesCreate,
    postServiceRateTypesDelete,
    postRateCardRateTypesUpdate } from '../http';

export class RateType extends Component {

    constructor(props){
        super(props);

        this.state = {
            showAddRateType : false,
            rateTypeName: "",
            rateTypeArr: [],

            ishowInput: false,
            inputCategoryName: "",

            targetInput: 0,
        }
    }

    componentDidMount(){
        let scope = this;

        getServiceRateTypes().then(function(response){
            console.log('rateTypes', response.data);
            scope.setState({ rateTypeArr: response.data.payload });
        });
    }

    onAddBtn(){
        this.setState({ showAddRateType: true });
    }
    
    onSave(newValue){
        let scope = this;

        if(newValue.length===0){
            alert('No rate type name specified.');
            return;
        }
        postServiceRateTypesCreate({ name: newValue }).then(function(response){
            scope.setState({ rateTypeArr: response.data.payload });
            // reset
            scope.setState({ rateTypeName: "" });
            scope.setState({ showAddRateType: false });

            alert('Added Rate Type Successfully');
        })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        })
    }

    onCancel(){
        this.setState({ showAddRateType: false });
    }

    onEdit(evt){
        let id = xhr(evt.target)[0].dataset.storedid;
        let text = xhr(evt.target)[0].dataset.text;
        
        let scope = this;

        if(id===undefined || id===null) return;

        if(text.length===0){
            alert('No rate type name specified.');
            return;
        }

        this.setState({targetInput: id});

        let toggle = this.state.ishowInput;
            toggle = !toggle;
        
        if(toggle===true) this.setState({ishowInput: toggle});
        
        this.setState({inputCategoryName: text });
    
        if(toggle===false && scope.state.inputCategoryName.length !== 0){
        
        let newInput = this.state.inputCategoryName;

            postRateCardRateTypesUpdate({
                id: id,
                name: newInput
            })
            .then(function(response){
                scope.state.rateTypeArr.map(function(data){
                    if(+data.id===+id){
                        data.name = newInput;
                    }
                });
                scope.setState({rateTypeArr: scope.state.rateTypeArr }, function(){
                    scope.setState({ishowInput: false});
                });
                alert('Rate type name updated.');
            })
            .catch(function(response){
                if(response.data.error){
                    alert(response.data.message);
                }
            });
        }
    }

    onDelete(evt){
        let id = xhr(evt.target)[0].dataset.storedid;
        let scope = this;

        console.log(id);
    
        if(id===undefined || id===null) return;

        if (confirm('Are you sure you want to delete this rate type?')) {
            // continue
        } else {
            return;
        }

        postServiceRateTypesDelete({ id: id })
        .then(function(response){
            scope.state.rateTypeArr.map(function(el, index){
                if(el.id === +id){
                    scope.state.rateTypeArr.splice(index, 1);
                }
            });
            scope.setState({ rateTypeArr: scope.state.rateTypeArr });
            alert('Rate Type Deleted.');
        })
        .catch(function(response){
            if(response.data.error){
                alert(response.data.message);
            }
        });
    }

    onCategoryNameChanged(evt){
        this.setState({inputCategoryName: evt.target.value });
    }

    onHandleKeyChange(){
        
    }

    render(){
        let scope = this;

        let rateTypes = null;

        let rateTypeInput = <span></span>;

        if(this.state.rateTypeArr.length!==0){
            rateTypes = 
                <tbody>
                { this.state.rateTypeArr.map(function(data){
                    return (
                            <tr key={data.id}>
                                <td>
                                    {(function(data){
                                        if(scope.state.ishowInput===true && +scope.state.targetInput===+data.id){
                                            rateTypeInput = 
                                            <input type="text" 
                                                className="form-control" 
                                                value={scope.state.inputCategoryName} 
                                                onChange={scope.onCategoryNameChanged.bind(scope)} 
                                                onKeyPress={scope.onHandleKeyChange.bind(scope)}/>
                                        } else {
                                            rateTypeInput = 
                                            <span className="name"> {data.name}</span>
                                        }
                                        return rateTypeInput;
                                    })(data)}
                                </td>
                                <td className="text-right">
                                    <button type="button" className="btn btn-primary" data-storedid={data.id} data-text={data.name} onClick={scope.onEdit.bind(scope)}>Edit</button>&nbsp;
                                    <button type="button" className="btn btn-danger" data-storedid={data.id} onClick={scope.onDelete.bind(scope)}>&times;</button>
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