import React, {Component} from 'react';

export class AddLevel extends Component {

    constructor(props){
        super(props);
        this.state = {
            categoryName: "",
        }
    }

    inputHandler(evt){
        this.setState({categoryName: evt.target.value });
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps.categoryName);
        if(nextProps.categoryName !== this.state.categoryName){
            this.setState({ categoryName: nextProps.categoryName });
        }
    }

    onSave(){
        this.props.onSave(this.state.categoryName);
    }

    render(){
        let mainContent = null;

        if(this.props.hasAddLevel){
            mainContent =
                <div>
                    <div className="col-xs-6">
                        <input type="text" className="form-control" value={this.state.categoryName} onChange={this.inputHandler.bind(this)} />
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