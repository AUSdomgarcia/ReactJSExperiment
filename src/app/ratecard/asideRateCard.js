import React, {Component} from 'react';
import JQuery from 'jquery';

import './aside-duplicate-aside.scss';

export class AsideRateCard extends Component {
  
  constructor(props){
      super(props);
  }

  componentDidMount(){
    let URI = this.props.path;
    
    if(URI ==='/ratecard') {
      JQuery('.leftNavIndicator').hide();
    } else {
      JQuery('.leftNavIndicator').show();
    }

    JQuery('.leftNavIndicator a').each(function(){
      let route = JQuery(this).attr('data-route');
      JQuery(this).removeClass('active');

      if(URI.includes(route)){
        JQuery(this).parent().addClass('active');

      } else if(URI.includes('edit')) {
        route = JQuery(this).attr('data-route');
        if(route==='add'){
          JQuery(this).parent().addClass('active');
        }
      }

    });
  }

  render() {
    let URI = this.props.path;

    return (
      <div className='leftNavIndicator'>

        <h3 className='sky'>Create Rate Card</h3>

        <ul>
          <li><a href='javascript:void(0)' data-route='add'>Choose Rate Card Name</a></li>
          <li><a href='javascript:void(0)' data-route='choose'>Choose Services</a></li>
          <li><a href='javascript:void(0)' data-route='permission'>Add Permission</a></li>
          <li><a href='javascript:void(0)' data-route='save'>Save</a></li>
        </ul>
      </div>
    );
  }
}
