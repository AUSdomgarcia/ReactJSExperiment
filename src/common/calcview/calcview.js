import React, {Component} from 'react';

import './calcview.scss';

export default class CalcView extends Component {

    onChangeHandler(evt){
        console.log(evt.target.value);
    }

    render() {
        return (
            <div className='calc-body clearfix'>
                <div className='col-md-12'>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <label>Total Package Rate</label>
                        </div>
                        <div className='col-xs-6'>
                            <input type='text' value='20,000' onChange={this.onChangeHandler.bind(this)} disabled/>
                        </div>
                    </div>
                    <br />

                    <div className='row'>
                        <div className='col-xs-6'>
                            <label>Discount</label>
                        </div>
                        <div className='col-xs-6'>
                            <input type='text' value='10%' onChange={this.onChangeHandler.bind(this)}/>
                        </div>
                    </div>
                    <br />

                    <div className='row'>
                        <div className='col-xs-6'>
                            <label>Package Rate</label>
                        </div>
                        <div className='col-xs-6'>
                            <input type='text' value='18,000' onChange={this.onChangeHandler.bind(this)} disabled/>
                        </div>
                    </div>

                </div>
            </div>
        );
  }
}