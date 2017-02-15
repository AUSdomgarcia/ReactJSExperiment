import React, {Component} from 'react';
import {Link} from 'react-router';

import {AsideNav} from './aside';

import CalcView from '../../common/calcview/calcview';
import CategoryTreeView from '../../common/categoryTreeView/categoryTreeView';
import PermissionView from '../../common/permissionView/permissionView';

import {getRateCardPackages} from '../../common/http';


// Landing Page
export class Packages extends Component {
    constructor(props){
        super(props);
        this.state = {
            packages: []
        }
    }

    componentDidMount(){
        window.sessionStorage.clear();
    }

    componentWillMount(){
        let scope = this;
        getRateCardPackages().then(function(response){
            console.log('/packages', response);
            
            if(response.data.payload.length!==0){
                scope.setState({packages: response.data.payload });
            }
        });
    }

    onManagePackages(evt){
        //
    }

    onDeletePackages(evt){
        //
    }

    render() {
        let package_td = <tr><td colSpan={3} >No data.</td></tr>
        let scope = this;

        if(this.state.packages.length!==0){
            package_td = 
            this.state.packages.map(function(data){
                return (
                    <tr key={data.id}>
                        <td>{data.name}</td>
                        <td>{data.products}</td>
                        <td>
                            <button className='btn btn-primary' data-unique={data.id} onClick={scope.onManagePackages.bind(scope)}>Manage</button>
                            <button className='btn btn-danger'  data-unique={data.id} onClick={scope.onDeletePackages.bind(scope)}>Delete</button>
                        </td>
                    </tr>
                )
            });
        }

        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                <div className='manage-packages'>

                    <h3 className='sky'>Manage Packages</h3>

                    <table className='table table-bordered table-hover table-striped'>
                        <thead>
                            <tr>
                                <th>Packages</th>
                                <th>Products</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {package_td}
                        </tbody>
                    </table>

                    <Link className="btn btn-block btn-primary" to='/packages/add'>
                        <i className="fa fa-plus"></i>
                        <span> Add Packages</span>
                    </Link>
                </div>
             
            <br className="clearfix" /><br />
            </div>
        )
    }
}












// Step1 - Add Service
export class PackageAdd extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: ""
        }
    }
    componentWillMount(){
        let WSpackagename = window.sessionStorage.getItem('packagename');
        let WSpackagedesc = window.sessionStorage.getItem('packagedesc');
        
        if(WSpackagename){
            this.setState({name: WSpackagename})
        }
        if(WSpackagedesc){
            this.setState({description: WSpackagedesc})
        }
    }
    componentDidMount(){
        //
    }

    onChangeName(evt){
        this.setState({name:evt.target.value});
        window.sessionStorage.setItem('packagename',evt.target.value);
    }

    onChangeDescription(evt){
        this.setState({description:evt.target.value});
        window.sessionStorage.setItem('packagedesc',evt.target.value);
    }

    render(){
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                <div className='package-content'>
                    <div className='col-md-12'>
                        <form>
                            <div className='form-group'>
                                <label>Package name</label>
                                <input className='form-control' type='text' value={this.state.name} onChange={this.onChangeName.bind(this)} />
                                <label>Package Description</label> 
                                <input className='form-control' type='text'  value={this.state.description} onChange={this.onChangeDescription.bind(this)} />
                            </div>
                        </form>
                        
                        <Link className='btn btn-default pull-left' to='/packages'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/choose'>Next</Link>   
                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}










import {ConnectedTable} from '../../common/connectedTable/connectedTable.js';

// Step2 - Choose Service
export class PackageChoose extends Component {
    
    constructor(props){
        super(props);
    }

    componentDidMount(){
        //
    }

    componentWillMount(){
        //
    }

    render(){
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                
                <div className='package-content'>

                    <div className='col-md-12'>
                        
                        <ConnectedTable />  
                      
                        <Link className='btn btn-default pull-left' to='/packages/add'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/rate'>Next</Link>
                    </div>

                </div>

            <br className="clearfix" /><br />
            </div>
        )
    }
}












// Step3 - Rate Service
export class PackageRate extends Component {

    constructor(props){
        super(props);

        this.state = {
            'package_total': 20000,
            'package_discount': 0,
            'package_rate': 18000
        }
    }

    onChangeHandler(evt){

    }

    render () {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>

                 <div className='package-content'>
                    <div className='col-md-12'>
                        <div className='row'>
                            
                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Total Package Rate</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='text' className='form-control' value={this.state.package_total} onChange={this.onChangeHandler.bind(this)} disabled />
                                </div>
                            </div>
                            
                            <br/>

                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Discount</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='text' className='form-control' value={this.state.package_discount} onChange={this.onChangeHandler.bind(this)} />
                                </div>
                            </div>

                            <br/>

                            <div className='clearfix'>
                                <div className="col-xs-3">
                                    <label>Package Rate</label>
                                </div>
                                <div className="col-xs-9">
                                    <input type='text' className='form-control' value={this.state.package_rate} onChange={this.onChangeHandler.bind(this)} disabled />
                                </div>
                            </div>

                        </div>
                    
                    <br />

                    <Link className='btn btn-default pull-left' to='/packages/choose'>Back</Link>
                    <Link className='btn btn-primary pull-right' to='/packages/permission'>Next</Link>
                    </div>

                </div>
            <br className="clearfix" /><br />
            </div>
        )
    }
}












// Step4 - Permission Service

import {PermissionEditor} from '../../common/permissionEditor/permissionEditor.js';

export class PackagePermission extends Component {
    constructor(props){
        super(props);
        this.state = {
            permittedUserArr: []
        }
    }

    componentDidMount(){
        //
    }

    componentWillMount(){
        //
    }

    callbackonUpdateArray(){}

    render () {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                
                <div className='package-content'>
                    <div className='col-md-12'>
                        
                        <PermissionEditor 
                            defaultArr={this.state.permittedUserArr} 
                            onUpdateArray={this.callbackonUpdateArray.bind(this)} 
                        />

                        <br />

                        <Link className='btn btn-default pull-left' to='/packages/rate'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/save'>Next</Link>
                    </div>
                </div>

            <br className='clearfix' /><br />
            </div>
        )
    }
}












// Step4 - Save Service
export class PackageSave extends Component {

    render () {
        return (
            <div>
                <AsideNav path={this.props.location.pathname}/>
                
                <div className='package-content'>

                    <div className='col-md-12'>
                        
                        <CategoryTreeView />

                        <CalcView />
                        
                        <h3>Package Permission</h3>

                        <PermissionView />    

                        <br />

                        <Link className='btn btn-default pull-left' to='/packages/permission'>Back</Link>
                        <Link className='btn btn-primary pull-right' to='/packages/preview'>Save</Link>
                    </div>
                </div>

            <br className='clearfix' /><br />
            </div>
        )
    }
}












// Step5 - Preview Service
export class PackagePreview extends Component {

    render () {
        return (
            <div>
                {/* <AsideNav path={this.props.location.pathname}/> */}
                {/* <div className='package-content'> */}

                <div className='col-md-12 -overpadding'>

                    <h3><span className='sky'>Manage Package </span> Dynamic Web Package</h3>
                    <small><Link className='sky' to='/packages'> &lt;&lt; Return to Full List </Link></small>
                    
                    <br />

                    <CategoryTreeView />

                    <CalcView />
                    
                    <h3>Package Permission</h3>

                    <PermissionView />    

                    <br />

                    <Link className='btn btn-primary pull-left' to='/packages/add'>Edit</Link>
                </div>
            
                {/* </div> */}

            <br className='clearfix' /><br />
            </div>
        )
    }
}













    