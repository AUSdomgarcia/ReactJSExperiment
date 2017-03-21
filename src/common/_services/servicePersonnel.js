import React, {Component} from 'react';

import jquery from 'jquery';

import toastr from 'toastr';

import {getServicePersonnels} from '../http';

export class ServicePersonnel extends Component {

    constructor(props){
        super(props);

        this.state = {
            personnelArr: [],

            manhour_rate: 0,
            manhours: 1,
            id: 0,
            personnel_id: "",
            name: "",
            isReady: false,
            canProceed: true,
        }
        
        // Hack 
        let scope = this;
        
        this.getValue = function(){
            
            if(!this.state.canProceed) return false;

            return {
                subtotal: +scope.state.manhour_rate * +scope.state.manhours,
                manhours: +scope.state.manhours,
                personnel_id: scope.state.personnel_id,
                manhour_rate: +scope.state.manhour_rate,
                position: {
                    name: scope.state.name,
                },
                id: scope.state.id,
            }
        }

        this.getIsReady = function(){
            return scope.state.isReady;
        }
    }
    
    componentWillMount(){
        if(this.props.isEnable===false){
            // console.log(this.props.position);
            this.setState({personnel_id: this.props.personnel_id});
            this.setState({id: this.props.id});
            this.setState({name: this.props.position.name});
            this.setState({manhours: this.props.manhours});
        }

        if(this.props.isEnable===true){
            if(this.props.personnelsOption===undefined||this.props.personnelsOption===null) return;
            this.setState({ personnelArr: this.props.personnelsOption });
            this.setState({isReady: true});
        }
    }

    // update when changes happens
    componentWillReceiveProps(nextProps){
        let scope = this;

        if(nextProps.personnelsOption===undefined||nextProps.personnelsOption===null) return;

        // scope.setState({isReady: false}, 
        // function(){

            if(this.state.personnelArr!==nextProps.personnelsOption){
            this.setState({ personnelArr: nextProps.personnelsOption }, function(){
                //
                if(scope.state.personnelArr.length!==0){

                    scope.setState({isReady: true});
                    // Set Defaults Happens Here
                    let res = nextProps.personnelsOption[0];
                    this.setState({personnel_id: res.personnel_id});
                    this.setState({manhour_rate: +res.manhour_rate});
                    this.setState({name: res.position.name});
                    this.setState({id: res.id});
                } else {
                    scope.setState({isReady: false});
                }
            });
        }
    }

    onChangeManHour(evt){
        // let value = +evt.target.value;
        // if(value < 0){
            // alert('The number you specified is less than 0.');
            // toastr.error('Manhour should not be less than 0.');
            // this.setState({manHour: 1});
            // return;

        // } else if(value === 0){
            // alert('Kindly specify a number greater than 0.');
            // toastr.error('Kindly specify a number greater than 0.');
            // this.setState({manHour: 1});
            // return;

        // }
        // let manhour = value;
        // this.setState({manhours: manhour});
        // let total = +this.state.manhour_rate * +this.state.manhours;

        let manhour = +evt.target.value;
        let word     = evt.target.value;

        this.setState({manhours: manhour});

        if(word.trim() === ""){
            // do nothing...
        } else {
            if(manhour < 0 || manhour === 0){
                this.setState({canProceed: false});
            } else {
                this.setState({canProceed: true});
            }
        }
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
        this.setState({ name: dataset.personnelposition });
        this.setState({ id: dataset.id });

        console.log('personnel_id', event.target.value);
        console.log('id', dataset.id);
        console.log('manhour_rate', dataset.manhour_rate);
        console.log('name', dataset.personnelposition);
        console.log('----------------------------------');
    }

    manhourStatus(){
        let display = "";
        if(!this.state.canProceed){
            display = "Kindly provide an appropriate manhour.";
        }
        if(this.state.manhours===0){
            display = "Manhour should be greater than 0.";
        }
        return display;
    }

    render() {
        let scope = this;
        let personnelOption = null;
        let manhourInput = null;
        let closebtn = null;

        if(this.state.personnelArr.length !==0 && this.props.isEnable === true){
            personnelOption = 
           <select className="form-control" 
                value={this.state.personnel_id} 
                onChange={this.onChangePersonnel.bind(this)}>
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
        
        } else {
            personnelOption = 
            <div>
                <span className="btn-danger">No Personnel were set to this Rate Type</span>
            </div>
        }

        // WHEN COMPONENT USED FOR VIEWING
        if(this.props.isEnable===false){
            closebtn =
            <button type="button" className="btn btn-danger pull-right"  onClick={this.onDelete.bind(this)}><i className="fa fa-times"></i></button>
            personnelOption = 
            <input type="text" className="form-control" value={ this.state.name } disabled />
        }

        // WHEN COMPONENT USED FOR EDITOR
        if(this.props.isEnable && this.state.personnelArr.length!==0){
            manhourInput = 
            <input type="number" value={this.state.manhours} className="form-control" onChange={this.onChangeManHour.bind(this)} />
        } else {
            manhourInput = 
            <input type="number" value={this.state.manhours} className="form-control" onChange={this.onChangeManHour.bind(this)} disabled/>
        }
        
        return (
            <div className="group-box">
                <div className="form-group">
                    {closebtn}
                    <label>Personnel ID</label>
                    {personnelOption}
                </div>

                <div className="form-group">
                    <label>Manhours</label>
                    {manhourInput} <br />
                    <span className="error-color">{this.manhourStatus()}</span>
                </div>
            </div>
        )
  }
}