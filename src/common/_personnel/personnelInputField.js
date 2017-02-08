import React, {Component} from 'react';
import './personnel.scss';

import xhr from 'jquery';

export class PersonnelInputField extends Component {
    constructor(props){
        super(props);

        // this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        this.BASE_URL = "http://cerebrum-api.dev:8096/api";
        this.state = {
            rateType: [],
            department: [],
            position: [],
            
            storeId: 0,
            rateTypeValue: 'select',
            departmentValue: 'select',
            positionValue: 'select',

            manHour: 0,
        };
    }

    componentDidMount(){
        let scope = this;

        console.log('called me once');

        xhr.get(this.BASE_URL+'/rate-cards/rate-types', function(data){
        scope.setState({ rateType: data.payload });
        scope.setState({ rateTypeValue: data.payload[0].id });
        });

        xhr.get(this.BASE_URL+'/rate-cards/personnels/departments', function(data){
            scope.setState({ department: data.payload });
            scope.setState({ departmentValue: data.payload[0]._id });
        });

        xhr.get(this.BASE_URL+'/rate-cards/personnels/positions', function(data){
            scope.setState({ position: data.payload });
            scope.setState({ positionValue: data.payload[0]._id });
        });
    }

    componentWillReceiveProps(nextProps){
        console.log('called me every props received.', nextProps);
        
        if(nextProps.isEdit){
            this.setState({ storeId: nextProps.personnelData.id });
            this.setState({ rateTypeValue: nextProps.personnelData.ratetype });
            this.setState({ departmentValue: nextProps.personnelData.department });
            this.setState({ positionValue: nextProps.personnelData.position });
        }
    }


    onSetManHourHandler(evt){
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

    onActionHandler(evt){
        let scope = this;

        switch(this.props.btnName.toLowerCase()){
            case 'add':
                xhr.post(this.BASE_URL+'/rate-cards/personnels/create', 
                    {
                        rate_type_id : scope.state.rateTypeValue,
                        department_id : scope.state.departmentValue,
                        position_id : scope.state.positionValue,
                        manhour_rate : scope.state.manHour
                    },
                    function(data){
                        scope.props.onAdded(data.payload);
                    });
            break;
            
            case 'update':
                console.log( +scope.state.storeId, 
                    scope.state.rateTypeValue,
                    scope.state.departmentValue,
                    scope.state.positionValue,
                    +scope.state.manHour
                );

                xhr.post(this.BASE_URL+'/rate-cards/personnels/update', 
                    {
                        id: +scope.state.storeId,
                        rate_type_id : +scope.state.rateTypeValue,
                        department_id : scope.state.departmentValue,
                        position_id : scope.state.positionValue,
                        manhour_rate : +scope.state.manHour
                    },
                    function(data){
                        scope.props.onAdded(data.payload);
                    });
            break;
        }
    }

  render() {

    let notification = null;

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

    return (
      <div className='row'>
        <div className='col-xs-6'>
            <form>
                <div className='form-group'>
                    <label>Rate Type</label>
                    <select className="form-control" value={this.state.rateTypeValue} onChange={this.onSelectRateType.bind(this)}>
                        {this.state.rateType.map(function(options){
                            return (<option key={options.id} value={options.id}>{options.name}</option>)
                        })}
                    </select>
                </div>
                
                <div className='form-group'>
                    <label>Department</label>
                    <select className="form-control" value={this.state.departmentValue} onChange={this.onSelectDepartment.bind(this)}>
                        {this.state.department.map(function(options){
                            return (<option key={options._id} value={options._id}>{options.name}</option>)
                        })}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Position</label>
                    <select className="form-control" value={this.state.positionValue} onChange={this.onSelectPosition.bind(this)}>
                        {this.state.position.map(function(options){
                            return (<option key={options._id} value={options._id}>{options.name}</option>)
                        })}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Manhour Rate</label>
                    <input type="number" maxLength={"8"} className='form-control' value={this.state.manHour} onChange={this.onSetManHourHandler.bind(this)}/>
                </div>
                
                <div className='btn-wrap'>
                    <button className='btn btn-primary pull-right' onClick={this.onActionHandler.bind(this)}>{this.props.btnName}</button>
                </div>
            </form>
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

