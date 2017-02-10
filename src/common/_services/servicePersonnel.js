import React, {Component} from 'react';
import xhr from 'jquery';

export class ServicePersonnel extends Component {

    constructor(props){
        super(props);

        this.BASE_URL = "http://172.16.100.102/api.cerebrum/public";
        this.state = {
            personnelArr: [],

            rateMultiplier: 0,
            manHourValue: 0,

            debugPerBox: 0,
            personnelId: "",
            position: ""
        }
        
        // Hack 
        let scope = this;
        this.getValue = function(){
            return {
                total: scope.state.rateMultiplier * scope.state.manHourValue,
                manhour: scope.state.manHourValue,
                personnelId: scope.state.personnelId,
                multiplier: scope.state.rateMultiplier,
                position: scope.state.position
            }
        }
    }

    componentWillReceiveProps(nextProps){
        // console.log(nextProps);
        if(nextProps.manhour !== this.state.manHourValue){
            this.setState({manHourValue: nextProps.manhour});
            this.setState({position: this.props.position});
            this.setState({personnelId: this.props.personnelId});
        }
    }

    componentWillMount(){
        if(!this.props.isEnable){
            this.setState({manHourValue: this.props.manhour});
            this.setState({position: this.props.position});
            this.setState({personnelId: this.props.personnelId});
        }
    }

    componentDidMount(){
        let scope = this;

        if(this.props.isEnable){
             xhr.get(this.BASE_URL+'/rate-cards/personnels', function(data){
                console.log('>>', data);
                scope.setState({ personnelArr: data.payload });

                // default
                scope.setState({ rateMultiplier: +data.payload[0].manhour_rate});
                scope.setState({ personnelId: data.payload[0].personnel_id });
                scope.setState({ position: data.payload[0].position.name });
            });
        }
    }

    onChangePersonnel(event, index, value){
        this.setState({rateMultiplier: event.target.value});

        let dataset = event.target.options[event.target.selectedIndex].dataset;
        
        this.setState({ personnelId: dataset.personnelid });
        this.setState({ position: dataset.personnelname });
    }

    onChangeManHour(evt){
        let manhour = +evt.target.value
        this.setState({manHourValue: manhour});

        let total = this.state.rateMultiplier * this.state.manHourValue;

        this.setState({ debugPerBox: total });
    }

    onDeleteSelf(){
       if(confirm('Are you sure you want to delete?')){
            //
        } else {
            return;
        }
        
        this.props.onDeleteSelf(this.state.personnelId);
    }

    render() {
        let scope = this;
        let personnelOption = null;
        let manhourInput = null;
        let closebtn = null;

        if(this.state.personnelArr.length !==0 && this.props.isEnable === true){
            personnelOption = 
           <select className="form-control" value={this.state.rateMultiplier} onChange={this.onChangePersonnel.bind(this)}>
                { this.state.personnelArr.map(function(data){
                    return (<option 
                            key={data.id}
                            data-personnelid={data.personnel_id}
                            data-personnelname={data.position.name}
                            value={data.manhour_rate}>{data.position.name}</option>)
                }) }
            </select>
        }

        if(this.props.isEnable===false){
            closebtn =
            <button type="button" className="btn btn-danger pull-right"  onClick={this.onDeleteSelf.bind(this)}><i className="fa fa-times"></i></button>

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
                {/*<small><strong>Per box Value: </strong>{this.state.debugPerBox} , {this.state.rateMultiplier} , {this.state.manHourValue}</small>*/}
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