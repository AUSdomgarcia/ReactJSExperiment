import React, {Component} from 'react';
import jquery from 'jquery';
import toastr from 'toastr';

export class PersonnelDataPile extends Component {

    constructor(props){
        super(props);
        this.state = {
            useSaveIcon: true,
            disableInput: true,
            manhours:  0,
            manhour_rate: 0,
            name: "position-name",
            position_id: 0,
            personnel_id: "000",
            visibleBtn: true,
            position: [],
            canAdd: false,
        }

        let scope = this;

        this.getData = function(){
            return {
                id: scope.state.position_id,
                subtotal: +scope.state.manhour_rate * +scope.state.manhours,
                manhours: +scope.state.manhours,
                personnel_id: scope.state.personnel_id,
                manhour_rate: +scope.state.manhour_rate,
                position: {
                    name: scope.state.name
                }
            }
        }
    }

    componentWillMount(){
        let scope = this;

        console.log('willmount', this.props.position );

        return false;

        if(this.props.position !== undefined){
            if(this.props.position !== this.state.position){
                this.setState({ position: this.props.position },
                    function(){
                        console.log('mount', scope.state.position);
                    });
            }
        }
    }

    componentDidMount(){
        //
    }

    componentWillReceiveProps(nextProps){
        let scope = this;

        if(nextProps.type === 'static'){
            this.setState({useSaveIcon: false});
        }
        
        if(nextProps.disableInput!==this.state.disableInput){
            this.setState({disableInput: nextProps.disableInput});
        }

        if(nextProps.visibleBtn!== this.state.visibleBtn){
            this.setState({visibleBtn:nextProps.visibleBtn});
        }

        if(nextProps.position!==undefined){
            if(nextProps.position!== this.state.position){
                this.setState({position: nextProps.position},
                function(){
                    if(scope.state.position.length===0) return false;

                    console.log('receive', scope.state.position);
                    
                    scope.setState({ manhour_rate: scope.state.position[0].manhour_rate });
                    scope.setState({ name: scope.state.position[0].position.name });
                    scope.setState({ position_id: scope.state.position[0].id });
                    scope.setState({ personnel_id: scope.state.position[0].personnel_id });
                });
            }
        }
    }

    getButtonState(){
        let dualStateBtn = undefined;
        let showBtn = undefined;

        if(this.state.useSaveIcon){
            dualStateBtn = <button type="button" className="btn btn-default">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                           </button>
        } else {
            dualStateBtn = <button type="button" className="btn btn-success">
                                <i className="fa fa-check" aria-hidden="true"></i>
                           </button>
        }

        if(this.state.visibleBtn){
            showBtn = dualStateBtn;
        } else {
            showBtn = <span></span>;
        }
        return showBtn;
    }

    getOptionsOfPosition(){
        let options = <option value="">No Data.</option>;
        
        if(!this.state.position) return options;

        options = 
            this.state.position.map(function(data, index){
                return (
                    <option value={data.id} key={data.id}>{data.position.name}</option>
                )
            });

        return options;
    }
    
    handleManhours(e){
        this.setState({manhours: e.target.value});
    }
    
    handlePersonnelPositionOption(e){
        let id = e.target.value;
        this.setState({ position_id: id });
        
        let personnel = this.state.position.filter(function(data){
                    return +data.id === +id;
                })[0];

        this.setState({ manhour_rate: personnel.manhour_rate });
        this.setState({ name: personnel.position.name });
        this.setState({ position_id: personnel.id });
        this.setState({ personnel_id: personnel.personnel_id });
    }

    handleDelete(e){
        // 
    }

    render(){
        return(
            <tr>
                <td>
                    <select 
                        className="form-control" 
                        disabled={this.state.disableInput}
                        onChange={this.handlePersonnelPositionOption.bind(this)} 
                        >
                            {this.getOptionsOfPosition()}
                    </select>
                </td>
                <td>
                    <input type="number"
                        disabled={this.state.disableInput} 
                        value={this.state.manhours}  
                        onChange={this.handleManhours.bind(this)}
                        className="form-control"/>
                </td>
                <td>
                    {this.getButtonState()}
                    { (this.state.visibleBtn) ? <button type="button" className="btn btn-danger" onClick={this.handleDelete.bind(this)}>&times;</button> : <span></span>}
                </td>
            </tr>
        )
    }
}