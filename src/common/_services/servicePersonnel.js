import React, {Component} from 'react';
import xhr from 'jquery';

import { getServicePersonnels } from '../http';

export class ServicePersonnel extends Component {

    constructor(props){
        super(props);

        // this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";

        this.state = {
            personnelArr: [],

            manHourRate: 0,
            manHourValue: 1,
            myId: 0,
            debugPerBox: 0,
            personnelId: "",
            position: ""
        }
        
        // Hack 
        let scope = this;
        this.getValue = function(){
            return {
                total: scope.state.manHourRate * scope.state.manHourValue,
                manhour: scope.state.manHourValue,
                personnelId: scope.state.personnelId,
                multiplier: scope.state.manHourRate,
                position: scope.state.position,
                myId: scope.state.myId
            }
        }
    }

    // componentWillReceiveProps(nextProps){
    //     if(nextProps.manhour !== this.state.manHourValue){
    //         this.setState({manHourValue: nextProps.manhour});
    //         this.setState({position: this.props.position});
    //         this.setState({personnelId: this.props.personnelId});
    //     }
    // }

    componentWillMount(){
        if(this.props.isEnable===false){
            this.setState({personnelId: this.props.personnelId});
            this.setState({position: this.props.position});
            this.setState({manHourValue: this.props.manhour});
            this.setState({myId: this.props.myId});
        }
    }

    componentDidMount(){
        let scope = this;

        if(this.props.isEnable===true){
            getServicePersonnels().then(function(response){
                console.log('ServicePersonnel:', response.data );

                scope.setState({ personnelArr: response.data.payload });

                // default
                scope.setState({ manHourRate: +response.data.payload[0].manhour_rate});
                scope.setState({ personnelId: response.data.payload[0].personnel_id });
                scope.setState({ position: response.data.payload[0].position.name });
                scope.setState({ myid: response.data.payload[0].id });

            });
        }
    }

    onChangeManHour(evt){
        let manhour = +evt.target.value
        this.setState({manHourValue: manhour});

        let total = this.state.manHourRate * this.state.manHourValue;

        this.setState({ debugPerBox: total });
    }

    onDelete(){
       if(confirm('Are you sure you want to delete?')){
            //
        } else {
            return;
        }
        this.props.onDeleteSelf(this.state.personnelId);
    }

    onChangePersonnel(event){
        this.setState({personnelId: event.target.value});
        
        let dataset = event.target.options[event.target.selectedIndex].dataset;
        
        this.setState({ manHourRate: dataset.manhourrate });
        this.setState({ position: dataset.personnelposition });
        this.setState({ myId: dataset.myid });
    }

    render() {
        let scope = this;
        let personnelOption = null;
        let manhourInput = null;
        let closebtn = null;

        if(this.state.personnelArr.length !==0 && this.props.isEnable === true){
            personnelOption = 
           <select className="form-control" value={this.state.personnelId} onChange={this.onChangePersonnel.bind(this)}>
                { this.state.personnelArr.map(function(data){
                    return (
                        <option 
                            key={data.id}
                            
                            data-manhourrate={data.manhour_rate}

                            data-myid={data.id}

                            data-personnelposition={data.position.name}

                            value={data.personnel_id}> {data.position.name} </option>)
                }) }
            </select>
        }

        if(this.props.isEnable===false){
            closebtn =
            <button type="button" className="btn btn-danger pull-right"  onClick={this.onDelete.bind(this)}><i className="fa fa-times"></i></button>

            personnelOption = 
            <input type="text" className="form-control" value={this.state.position} disabled />
        }

        if(this.props.isEnable){
            
            manhourInput = 
            <input type="number" value={this.state.manHourValue} className="form-control" onChange={this.onChangeManHour.bind(this)} />
        } else {
            manhourInput = 
            <input type="number" value={this.state.manHourValue} className="form-control" onChange={this.onChangeManHour.bind(this)} disabled/>
        }

        return (
            <div className="group-box">
                {/*<small><strong>Per box Value: </strong>{this.state.debugPerBox} , {this.state.manHourRate} , {this.state.manHourValue}</small>*/}
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