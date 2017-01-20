import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';

export default class MainLayout extends Component {

  componentDidMount(){
    // Force to redirect to Login
    console.log('%c '+'[DOM] On MainLayout Ready ', 'background: #222; color: #bada55');
  }

  render() {
    return (
      <div>
        <Header />
          <div className="container">
            {this.props.children}
          </div>
        <Footer />
      </div>
    );
  }
}
