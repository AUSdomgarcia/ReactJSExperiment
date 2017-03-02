import React, {Component} from 'react';
import './personnel.scss';
import jquery from 'jquery';
import toastr from 'toastr';

import {
        getPersonnelsDepartment, 
        getServiceRateTypes, 
        getPersonnelsPositions,
        postPersonnelsCreate,
        postPersonnelsUpdate

    } from '../../common/http';

export class PersonnelInputField extends Component {
    constructor(props){
        super(props);

        this.state = {
            rateType: [],
            department: [],
            position: [],
            
            storeId: 0,
            rateTypeValue: 'select',
            departmentValue: 'select',
            positionValue: 'select',

            manHour: 0,

            hasRatetype: true,
            hasPosition: true,
            hasDepartment: true,
            hasManhour: true,
        };
    }

    componentWillMount(){
        let scope = this;

        getServiceRateTypes().then(function(response){
            if(response.data.payload.length!==0){
                let ratetypes = response.data.payload;
                    ratetypes.unshift({id:'12345', _id: '12345', name: 'Select rate type'});

                scope.setState({rateType: ratetypes});
                scope.setState({rateTypeValue: response.data.payload[0].id});
            }
        });

        getPersonnelsDepartment().then(function(response){
            if(response.data.payload.length!==0){
                let departments = response.data.payload;
                    departments.unshift({id:'12345', _id: '12345', name: 'Select department'});

                scope.setState({ department: departments });
                scope.setState({ departmentValue: response.data.payload[0]._id });
            }
        });

        getPersonnelsPositions().then(function(response){
            if(response.data.payload.length!==0){
                let positions = response.data.payload;
                    positions.unshift({id:'12345', _id: '12345', name: 'Select position'});

                scope.setState({ position: positions });
                scope.setState({ positionValue: response.data.payload[0]._id });
            }
        });
    }

    componentDidMount(){
        // toastr.options.preventDuplicates = true;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isEdit){
            this.setState({ storeId: nextProps.personnelData.id });
            this.setState({ rateTypeValue: nextProps.personnelData.ratetype });
            this.setState({ departmentValue: nextProps.personnelData.department });
            this.setState({ positionValue: nextProps.personnelData.position });
            this.setState({ manHour: nextProps.personnelData.manhour });
        }
    }

    onSetManHourHandler(evt){
        let value = +evt.target.value;
        
        if(value < 0){
            // alert('The number you specified is less than 0.');
            toastr.error('The number you specified is less than 0.');
            this.setState({manHour: 1});
            return;
        } else if(value === 0){
            // alert('Kindly specify a number greater than 0.');
            toastr.error('Kindly specify a number greater than 0.');
            this.setState({manHour: 1});
            return;
        }
        this.setState({manHour: evt.target.value});
    }

    onSelectRateType(evt){
        this.setState({ rateTypeValue: evt.target.value });
    }

    onSelectDepartment(evt){
        this.setState({ departmentValue: evt.target.value });
    }

    onSelectPosition(evt){
        this.setState({ positionValue: evt.target.value });
    }

    resetValues(){
        this.setState({rateTypeValue: this.state.rateType[0]._id});
        this.setState({positionValue: this.state.position[0]._id});
        this.setState({departmentValue: this.state.department[0]._id});
        this.setState({manHour: 0});
    }

    onActionHandler(evt){
        let scope = this;

        this.setState({hasRatetype: true});
        this.setState({hasDepartment: true});
        this.setState({hasPosition: true});
        this.setState({hasManhour: true});
        
        if(this.state.rateTypeValue.includes('12345')){
            this.setState({hasRatetype: false});
        } 
        
        if(this.state.positionValue.includes('12345')){
            this.setState({hasPosition: false});
        }
        
        if(this.state.departmentValue.includes('12345')){
            this.setState({hasDepartment: false});
        } 

        if(+this.state.manHour <= 0){
            this.setState({hasManhour: false});
        }

        console.log('proceed');

        switch(this.props.btnName.toLowerCase()){
            case 'add':
                postPersonnelsCreate({
                    rate_type_id : scope.state.rateTypeValue,
                    department_id : scope.state.departmentValue,
                    position_id : scope.state.positionValue,
                    manhour_rate : scope.state.manHour
                }).then(function(response){
                    if(response.data.error){
                        // alert(response.data.message);
                        toastr.error(response.data.message);

                    } else {
                        scope.props.onUpdate(response.data.payload);
                        // alert('Personnel added successfully.');
                        toastr.success('Personnel added successfully.');
                        scope.resetValues();
                    }
                })
                .catch(function(response){
                    if(response.data.error){
                        // alert(response.data.message);
                        toastr.error(response.data.message);
                    }
                });
            break;
            
            case 'update':
                console.log('update', +scope.state.storeId, 
                    scope.state.rateTypeValue,
                    scope.state.departmentValue,
                    scope.state.positionValue,
                    +scope.state.manHour
                );

                postPersonnelsUpdate({
                    id: +scope.state.storeId,
                    rate_type_id : +scope.state.rateTypeValue,
                    department_id : scope.state.departmentValue,
                    position_id : scope.state.positionValue,
                    manhour_rate : +scope.state.manHour
                }).then(function(response){
                    if(response.data.error){
                        // alert(response.data.message);
                        toastr.error(response.data.message);

                    } else {
                        // alert('Personnel updated.');
                        toastr.success('Personnel updated.');
                        scope.props.onUpdate(response.data.payload);
                        scope.resetValues();
                    }
                })
                .catch(function(response){
                    if(response.data.error){
                        // alert(response.data.message);
                        toastr.error(response.data.message);
                    }
                });

            break;
        }
    }

  render() {

    let notification = null;
    let updateOrAddBtn = null;

    let rateTypeAlert = <span></span>;
    let positionAlert = <span></span>;
    let departmentAlert = <span></span>;
    let manHourAlert = <span></span>;

    if(this.props.isUpdated){
        notification = 
            (function(){
                return (
                    <div className="alert alert-success">
                        <strong>Success!</strong> Data updated.
                    </div>
                )
            })();
    }

    if(this.props.btnName==='Add'){
        updateOrAddBtn = 
            <button className='btn btn-primary pull-right' onClick={this.onActionHandler.bind(this)}>Add</button>
    } else {
        updateOrAddBtn = 
            <button className='btn btn-primary pull-right' onClick={this.onActionHandler.bind(this)}>Update</button>
    }

    if(!this.state.hasRatetype){
        rateTypeAlert = <small className="text-red">Select a rate type</small>
    }

    if(!this.state.hasPosition){
        positionAlert = <small className="text-red">Select a position</small>
    }

    if(!this.state.hasDepartment){
        departmentAlert = <small className="text-red">Select a department</small>
    }

    if(!this.state.hasManhour){
        manHourAlert = <small className="text-red">Manhour should be greater than 0</small>
    }

    return (
      <div className='row'>
        <div className='col-xs-6'>
                <div className='form-group'>
                    <label>Rate Type</label>
                    &nbsp; {rateTypeAlert}
                    <select className="form-control" value={this.state.rateTypeValue} onChange={this.onSelectRateType.bind(this)}>
                        {this.state.rateType.map(function(options){
                            return (<option key={options.id} value={options.id}>{options.name}</option>)
                        })}
                    </select>
                </div>
                
                <div className='form-group'>
                    <label>Position</label>
                    &nbsp; {positionAlert}
                    <select className="form-control" value={this.state.positionValue} onChange={this.onSelectPosition.bind(this)}>
                        {this.state.position.map(function(options){
                            return (<option key={options._id} value={options._id}>{options.name}</option>)
                        })}
                    </select>
                </div>
                
                <div className='form-group'>
                    <label>Department</label>
                    &nbsp; {departmentAlert}
                    <select className="form-control" value={this.state.departmentValue} onChange={this.onSelectDepartment.bind(this)}>
                        {this.state.department.map(function(options){
                            return (<option key={options._id} value={options._id}>{options.name}</option>)
                        })}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Manhour Rate</label>
                    &nbsp; {manHourAlert}
                    <input type="number" maxLength={"8"} className='form-control' value={this.state.manHour} onChange={this.onSetManHourHandler.bind(this)}/>
                </div>
                
                <div className='btn-wrap'>
                    {updateOrAddBtn}
                </div>
        </div>

        <div className='col-xs-6'>
            {notification}
        </div>

        <br className='clearfix' />
    </div>
    );
  }
}

PersonnelInputField.contextTypes = {
  router: React.PropTypes.object.isRequired
};

