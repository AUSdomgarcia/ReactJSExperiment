import React, {Component} from 'react';
import './personnelEdit.scss';

export class PersonnelEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            rateType: ['Standard', 'Unilever', 'Cheap', 'Expensive'],
            department: ['Creatives','Production'],
            position: ['Creative Officer','Frontend Developer','Backend Developer'],
            
            rateTypeValue: 'select',
            departmentValue: 'select',
            positionValue: 'select',

            manHour: 0,
        };
    }

    componentDidMount(){
        // GET state rateType, department, position 
    }

    manHourHandler(evt){
        this.setState({manHour: evt.target.value});
    }

    selectTagHandler(evt){
        if(this.state.rateType.includes(evt.target.value)){
            this.setState({ rateTypeValue: evt.target.value });
        } else if(this.state.department.includes(evt.target.value)) {
            this.setState({ departmentValue: evt.target.value });
        } else {
            this.setState({ positionValue: evt.target.value });
        }
        console.log(evt.target.value);
    }

    actionHandler(evt){
        switch(this.props.btnName.toLowerCase()){
            case 'add':
                alert('xxx');
            break;
            case 'edit':
                this.context.router.push('/ratecard/edit')
            break;
        }
    }


  render() {

    return (
      <div className='row'>
        <div className='col-xs-6'>
            <form>
                <div className='form-group'>
                    <label>Rate Type</label>
                    <select className="form-control" value={this.state.rateTypeValue} onChange={this.selectTagHandler.bind(this)}>
                        {this.state.rateType.map(function(options){
                            return (<option key={options} value={options}>{options}</option>)
                        })}
                    </select>
                </div>
                
                <div className='form-group'>
                    <label>Department</label>
                    <select className="form-control" value={this.state.departmentValue} onChange={this.selectTagHandler.bind(this)}>
                        {this.state.department.map(function(options){
                            return (<option key={options} value={options}>{options}</option>)
                        })}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Position</label>
                    <select className="form-control" value={this.state.positionValue} onChange={this.selectTagHandler.bind(this)}>
                        {this.state.position.map(function(options){
                            return (<option key={options} value={options}>{options}</option>)
                        })}
                    </select>
                </div>

                <div className='form-group'>
                    <label>Manhour Rate</label>
                    <input type='text' className='form-control' value={this.state.manHour} onChange={this.manHourHandler.bind(this)}/>
                </div>
                
                <div className='btn-wrap'>
                    <button className='btn btn-primary pull-right' onClick={this.actionHandler.bind(this)}>{this.props.btnName}</button>
                </div>
            </form>
        </div>

        <div className='col-xs-6'>
            <div className="alert alert-success">
                <strong>Success!</strong> Indicates a successful or positive action.
            </div>
        </div>

        <br className='clearfix' />
    </div>
    );
  }
}

PersonnelEditor.contextTypes = {
  router: React.PropTypes.object.isRequired
};

