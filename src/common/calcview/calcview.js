import React, {Component} from 'react';

import './calcview.scss';

export class CalcView extends Component {
    constructor(props){
        super(props);
        this.state = {
            rate: 0,
            total: 0,
            discount: 0
        }
    }

    componentWillMount(){
        if(this.state.rate!==this.props.rate){
            this.setState({rate:this.props.rate});
        }
        if(this.state.total!==this.props.total){
            this.setState({total:this.props.total});
        }
        if(this.state.discount!==this.props.discount){
            this.setState({discount:this.props.discount});
        }
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
                            <input type='text' value={this.state.total} disabled/>
                        </div>
                    </div>
                    <br />

                    <div className='row'>
                        <div className='col-xs-6'>
                            <label>Discount</label>
                        </div>
                        <div className='col-xs-6'>
                            <input type='text' value={this.state.discount + '%'} disabled/>
                        </div>
                    </div>
                    <br />

                    <div className='row'>
                        <div className='col-xs-6'>
                            <label>Package Rate</label>
                        </div>
                        <div className='col-xs-6'>
                            <input type='text' value={this.state.rate} disabled/>
                        </div>
                    </div>

                </div>
            </div>
        );
  }
}