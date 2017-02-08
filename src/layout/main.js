import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';

import {PopupGeneric} from '../common/popups/generic'; 

export default class MainLayout extends Component {

  constructor(props){
    super(props);
  }
  
  componentDidMount(){
    // Force to redirect to Login
    console.log('%c '+'[DOM] On MainLayout Ready ', 'background: #222; color: #bada55');
    // this.context.router.push('/login');
  }

  render() {
    var popUpRef = <PopupGeneric />

    return (
      <div className="container bgWhite">
        <Header />
          <div>
          
          {/* GLOBAL POPUP */}
            {popUpRef}
            
            {this.props.children}
          
          </div>
          <Footer />
      </div>
    );
  }
}

MainLayout.contextTypes = {
  router: React.PropTypes.object.isRequired
};
