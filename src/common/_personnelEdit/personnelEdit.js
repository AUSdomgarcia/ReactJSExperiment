import React, {Component} from 'react';
import './personnelEdit.scss';

export class PersonnelEditView extends Component {
  render() {
    return (
      <div className='row'>
        <div className='col-xs-6'>
            <form>
                <div className='form-group'>
                    <label>Rate Type</label>
                    <input type='text' className='form-control'/>
                </div>
                
                <div className='form-group'>
                    <label>Department</label>
                    <input type='text' className='form-control'/>
                </div>

                <div className='form-group'>
                    <label>Position</label>
                    <input type='text' className='form-control'/>
                </div>

                <div className='form-group'>
                    <label>Manhour Rate</label>
                    <input type='text' className='form-control'/>
                </div>
                
                <div className='btn-wrap'>
                    <button className='btn btn-primary pull-right'>{this.props.btnName}</button>
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
