import React, { Component } from 'react';
import Inventory from './Inventory';
import style from './style';

const createDOMPurify = require('dompurify');
const jsdom = require('jsdom').jsdom;
const window = jsdom('').defaultView;
const DOMPurify = createDOMPurify(window);

/*render() {
  let inventoryNodes = []

  for(var key in this.props.data) {
    inventoryNodes.push(
      <Inventory key={key}>
      {this.props.data[key]}
      </Inventory>
    );
  }
  return (
    <div style={ style.messageList }>
    { inventoryNodes }
    </div>
  )
}
}*/
class InventoryList extends Component {
  render() {
    var dict = this.props.data;
    let inventoryNodes = Object.keys(this.props.data).map(inventory => {
      return (
        <div key={ inventory }>
        <b>{inventory}</b>: { dict[inventory]}
        </div>
      )
    })
    return (
      <div style={ style.messageList }>
      { inventoryNodes }
      </div>
    )
  }
}
export default InventoryList;
