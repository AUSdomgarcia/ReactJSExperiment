import React, {Component} from 'react';
import JQuery from 'jquery';

import './aside.scss';

export class AsideNav extends Component {
  constructor(props){
      super(props);
  }

  componentDidMount(){
    let scope = this;    
    let uri = scope.props.path;
    
    if(uri ==='/packages') {
      JQuery('.leftNavIndicator').hide();
    } else {
      JQuery('.leftNavIndicator').show();
    }

    JQuery('.leftNavIndicator a').each(function(){
      let route = JQuery(this).attr('data-route');
      JQuery(this).removeClass('active');

      if(uri.includes(route)){
        JQuery(this).parent().addClass('active');
      }

    });
  }

  render() {
      
    return (
      <div className='leftNavIndicator'>

        <h3 className='sky'>Create Package</h3>

        <ul>
          <li><a href='javascript:void(0)' data-route='add'>Choose Package name</a></li>
          <li><a href='javascript:void(0)' data-route='choose'>Choose Services</a></li>
          <li><a href='javascript:void(0)' data-route='rate'>Add Package Rate</a></li>
          <li><a href='javascript:void(0)' data-route='permission'>Add Permission</a></li>
          <li><a href='javascript:void(0)' data-route='save'>Save</a></li>
        </ul>
      </div>
    );
  }
}
