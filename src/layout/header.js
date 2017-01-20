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
    alert(`selected ${eventKey}`);
  }

  render() {
    return (
      <Nav bsStyle="tabs" activeKey="1" onSelect={this.handleSelect.bind(this)}>
        <NavItem eventKey="1" >Dashboard</NavItem>
        <NavItem eventKey="2" >CE Creator</NavItem>
        <NavItem eventKey="3" >Project Creator</NavItem>
        <NavItem eventKey="3" >Account Listing</NavItem>
        <NavDropdown eventKey="4" title="Dropdown" id="nav-dropdown">
          <MenuItem eventKey="4.1">Action</MenuItem>
          <MenuItem eventKey="4.2">Another action</MenuItem>
          <MenuItem eventKey="4.3">Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4.4">Separated link</MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
}
