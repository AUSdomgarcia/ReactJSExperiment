import React, {Component} from 'react';

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>This is Home, Hello World!</h1>

        {(123456789.12345).formatMoney(2, '.', ',')}
      </div>
    );
  }
}
