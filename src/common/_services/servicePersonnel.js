import React, {Component} from 'react';
import xhr from 'jquery';

import { getServicePersonnels } from '../http';

export class ServicePersonnel extends Component {

    constructor(props){
        super(props);

        this.state = {
            personnelArr: [],

            manhour_rate: 0,
            manhours: 1,
            id: 0,

            debugPerBox: 0,
            personnel_id: "",
            position: "",

            isReady: false
        }
        
        // Hack 
        let scope = this;
        this.getValue = function(){
            return {
                subtotal: scope.state.manhour_rate * scope.state.manhours,
                manhours: scope.state.manhours,
                personnel_id: scope.state.personnel_id,
                multiplier: scope.state.manhour_rate,
                position: scope.state.position,
                id: scope.state.id
            }
        }

        this.getIsReady = function(){
            return scope.state.isReady;
        }
    }

    // componentWillReceiveProps(nextProps){
    //     if(nextProps.manhour !== this.state.manhours){
    //         this.setState({manhours: nextProps.manhour});
    //         this.setState({position: this.props.position});
    //         this.setState({personnel_id: this.props.personnel_id});
    //     }
    // }

    componentWillMount(){
        if(this.props.isEnable===false){
            this.setState({personnel_id: this.props.personnel_id});
            if(this.props.position.hasOwnProperty('name')){
                this.setState({position: this.props.position.name});
            } else {
                this.setState({position: this.props.position});
            }
            
            this.setState({manhours: this.props.manhours});
            this.setState({id: this.props.id});
        }
    }

    componentDidMount(){
        let scope = this;

        if(this.props.isEnable===true){
            getServicePersonnels().then(function(response){
                console.log('ServicePersonnel:', response.data );
                scope.setState({ personnelArr: response.data.payload });

                // default
                scope.setState({ manhour_rate: +response.data.payload[0].manhour_rate});
                scope.setState({ personnel_id: response.data.payload[0].personnel_id });
                scope.setState({ position: response.data.payload[0].position.name });
                scope.setState({ id: response.data.payload[0].id });

                // Set AddPersonnel to ready
                scope.setState({isReady: true});
            });
        }
    }

    onChangeManHour(evt){
        let manhour = +evt.target.value
        this.setState({manhours: manhour});

        let total = this.state.manhour_rate * this.state.manhours;

        this.setState({ debugPerBox: total });
    }

    onDelete(){
       if(confirm('Are you sure you want to delete?')){
            //
        } else {
            return;
        }
        this.props.onDeleteSelf(this.state.personnel_id);
    }

    onChangePersonnel(event){
        this.setState({personnel_id: event.target.value});
        
        let dataset = event.target.options[event.target.selectedIndex].dataset;
        
        this.setState({ manhour_rate: dataset.manhour_rate });
        this.setState({ position: dataset.personnelposition });
        this.setState({ id: dataset.id });
    }

    render() {
        let scope = this;
        let personnelOption = null;
        let manhourInput = null;
        let closebtn = null;

        if(this.state.personnelArr.length !==0 && this.props.isEnable === true){
            personnelOption = 
           <select className="form-control" value={this.state.personnel_id} onChange={this.onChangePersonnel.bind(this)}>
                { this.state.personnelArr.map(function(data){
                    return (
                        <option 
                            key={data.id}
                            
                            data-manhour_rate={data.manhour_rate}

                            data-id={data.id}

                            data-personnelposition={data.position.name}

                            value={data.personnel_id}> {data.position.name} </option>)
                }) }
            </select>
        }

        if(this.props.isEnable===false){
            closebtn =
            <button type="button" className="btn btn-danger pull-right"  onClick={this.onDelete.bind(this)}><i className="fa fa-times"></i></button>

            personnelOption = 
            <input type="text" className="form-control" value={ this.state.position } disabled />
        }

        if(this.props.isEnable){
            
            manhourInput = 
            <input type="number" value={this.state.manhours} className="form-control" onChange={this.onChangeManHour.bind(this)} />
        } else {
            manhourInput = 
            <input type="number" value={this.state.manhours} className="form-control" onChange={this.onChangeManHour.bind(this)} disabled/>
        }

        return (
            <div className="group-box">
                {/*<small><strong>Per box Value: </strong>{this.state.debugPerBox} , {this.state.manhour_rate} , {this.state.manhours}</small>*/}
                <div className="form-group">
                    {closebtn}
                    <label>Personnel ID</label>
                    {personnelOption}
                </div>

                <div className="form-group">
                    <label>Manhours</label>
                    {manhourInput}
                </div>
            </div>
        )
  }
}