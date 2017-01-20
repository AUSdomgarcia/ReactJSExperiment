import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';

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
    return (
      <div className="container">
        <Header />
          <div>
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
