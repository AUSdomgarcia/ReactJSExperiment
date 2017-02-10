import React, {Component} from 'react';

export class InputHelper extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentValue: ""
        }
    }

    onChangeHandler(evt){
        this.props.onChange(evt.target.value);
    }

    componentWillReceiveProps(nextProps){
        console.log( nextProps );
        
        if(nextProps.currentValue !== this.state.currentValue){
            this.setState({ currentValue: nextProps.currentValue });
        }
    }

    render(){
        let scope = this;
        let isDisabled = this.props.isDisabled;
        let myInput = null;

        if(isDisabled){
            myInput = 
            <input type={this.props.type} value={this.state.currentValue} onChange={this.onChangeHandler.bind(this)} disabled/>
        } else {
            myInput = 
            <input type={this.props.type} value={this.state.currentValue} onChange={this.onChangeHandler.bind(this)}/>
        }

        return (
            <div>
                {myInput}
            </div>
        )
    }
}