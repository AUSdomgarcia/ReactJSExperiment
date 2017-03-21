import React, {Component} from 'react';
import jquery from 'jquery';
import toastr from 'toastr';

import {PersonnelDataPile} from './personnelDataPile';

export class PersonnelDataStack extends Component {

    constructor(props){
        super(props);
        this.state = {
            stack: [],
            position: []
        };
    }

    componentWillMount(){
        if(this.props.stack !== this.state.stack ){
            this.setState({ stack: this.props.stack });
        }

        if(this.props.position !== this.state.position ){
            this.setState({ position: this.props.position });
        }

        if(this.props.position !== this.state.position ){
            this.setState({ position: this.props.position });
            console.log('>Stack', this.props.position);
        }
    }

    componentDidMount(){
        // with UI bindings
        console.log('PersonnelDataStack', this.state.stack);
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.stack !== this.state.data ){
            this.setState({ stack: nextProps.stack });
        }

        if(nextProps.position !== this.state.position ){
            this.setState({ position: nextProps.position });
            console.log('>Stack', this.state.position);
        }
    }

    getTableRows(){
        let tableRows = undefined;
        tableRows = 
            this.state.stack.map(function(data){
                return ( 
                    <PersonnelDataPile 
                        key={data.id} 
                        disableInput={true} 
                        type="selected" 
                        visibleBtn={true}/>
                );
            });
        return tableRows;
    }

    handleAddPersonnel(e){
        console.log( this._child.getData() );
        let data = this._child.getData();
        this.props.onUpdate(data);
    }

    render(){
        let scope = this;

        return(
            <div>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Personnel ID</th>
                            <th>Manhours</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getTableRows()}  

                        <PersonnelDataPile 
                            disableInput={false}
                            position={this.state.position}
                            type="static"
                            visibleBtn={false} 
                            
                            ref = { (child) => { this._child = child; } }    
                        />
                    </tbody>
                </table>

                <button 
                    type="button" 
                    className="btn btn-primary btn-block" 
                    onClick={this.handleAddPersonnel.bind(this)}>Add More Personnel</button>
                <br />
            </div>
        )
    }
}