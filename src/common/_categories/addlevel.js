import React, {Component} from 'react';

import './addlevel.scss';

export class AddLevel extends Component {

    constructor(props){
        super(props);
        this.state = {
            newValue: "",
        }
    }

    inputHandler(evt){
        this.setState({newValue: evt.target.value });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.name !== this.state.newValue){
            this.setState({ newValue: nextProps.name });
        }
    }

    onSave(){
        this.props.onSave(this.state.newValue);
    }

    render(){
        let mainContent = null;

        if(this.props.hasAddLevel){
            mainContent =
                <div className="marginTop">
                    <div className="col-xs-6">
                        <input type="text" className="form-control" value={this.state.newValue} onChange={this.inputHandler.bind(this)} />
                    </div>

                    <div className="col-xs-6">
                        <div className="text-left">
                            <button type="button" className="btn btn-danger" onClick={this.props.onCancel} >Cancel</button>&nbsp;
                            <button type="button" className="btn btn-success" onClick={this.onSave.bind(this)} >Save</button>&nbsp;
                        </div>
                    </div>
                    <br className="clearfix" />
                </div>
        }

        return (
            <div>
                {mainContent}
            </div>
        )
    }
}