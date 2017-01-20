import React, {Component} from 'react';
import {Link} from 'react-router';

// Landing Page
export class Packages extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <div>
                <Link to='/packages/create'>Create New</Link>
                <h1>Manage Packages</h1>
            </div>
        )
    }
}

// Step One
export class PackagesCreation extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <Link to='/packages/choose-service'>Choose Service</Link>
                <h2>Packages/Creation</h2>
            </div>
        )
    }
}

// Step Two
export class PackagesChooseService extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <h2>Packages/ChooseService</h2>
            </div>
        )
    }
}

