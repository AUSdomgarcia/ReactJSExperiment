import React, {Component} from 'react';

export class ActionButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            hasEdit: false,
            hasDelete: false,
            id: 0,
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.state.id !== nextProps.id ){
            this.setState({ id: nextProps.id });
        }
        if(this.state.hasDelete !== nextProps.hasDelete ){
            this.setState({ hasDelete: nextProps.hasDelete });
        }
        if(this.state.hasEdit !== nextProps.hasEdit ){
            this.setState({ hasEdit: nextProps.hasEdit });
        }
    }
    componentWillMount(){
        if(this.state.id !== this.props.id ){
            this.setState({ id: this.props.id });
        }
        if(this.state.hasDelete !== this.props.hasDelete ){
            this.setState({ hasDelete: this.props.hasDelete });
        }
        if(this.state.hasEdit !== this.props.hasEdit ){
            this.setState({ hasEdit: this.props.hasEdit });
        }
    }

    componentDidMount(){
        //
    }

    onDelete(){
        this.props.onDelete(this.state.id);
    }

    render(){
        let scope = this;
        let editBtn = <span></span>
        let deleteBtn = <span></span>

        if(this.state.hasDelete){
            deleteBtn = 
            <button type="button" className="btn btn-danger" onClick={this.onDelete.bind(this)}>&times;</button>
        }

        if(this.state.hasEdit){
            editBtn = 
            <button type="button" className="btn btn-default">Edit</button>
        }

        return (
            <span>
                {editBtn}
                {deleteBtn}
            </span>
        )
    }
}