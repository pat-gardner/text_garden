import React, { Component } from 'react';
import style from './style';


class SeedInventoryList extends Component {
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
      <div style={ style.itemList }>
          <strong> Seeds </strong>
            <hr />
            { inventoryNodes }
      </div>
    )
  }
}
export default SeedInventoryList;
