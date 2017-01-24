// Bootstrap and Fontawesome
import '../common/resources.scss';

import React, {Component} from 'react';
import {Nav,NavItem,NavDropdown,MenuItem} from 'react-bootstrap';

export default class Header extends Component {
  
  constructor(props) { 
    super(props);
  }
  
  handleSelect(eventKey) {
    event.preventDefault();
    // alert(`selected ${eventKey}`);
    console.log(eventKey);
    switch(eventKey){
      case '4.1':
        this.context.router.push('/packages');
      break;
      case '4.2':
        this.context.router.push('/ratecard');
      break;
       case '4.4':
        this.context.router.push('/personnel');
      break;
      case '4.5':
        this.context.router.push('/categories');
      break;
    }
  }

  render() {
    return (
      <div className="navbar navbar-default">
        <div className="container-fluid">
          <Nav bsStyle='pills' onSelect={this.handleSelect.bind(this)}>
            <NavItem eventKey='1' >Dashboard</NavItem>
            <NavItem eventKey='2' >CE Creator</NavItem>
            <NavItem eventKey='3' >Project Creator</NavItem>
            <NavItem eventKey='3' >Account Listing</NavItem>
            <NavDropdown eventKey='4' title='Rate Card' id='nav-dropdown'>
              <MenuItem eventKey='4.1'>Packages</MenuItem>
              <MenuItem eventKey='4.2'>Rate Card</MenuItem>
              <MenuItem eventKey='4.3'>Services</MenuItem>
              <MenuItem eventKey='4.4'>Personel</MenuItem>
              <MenuItem eventKey='4.5'>Categories</MenuItem>
            </NavDropdown>
          </Nav>
        </div>
      </div>
    );
  }
}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};

