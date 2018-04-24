import React, { Component } from 'react';

class GardenHome extends Component{
  render() {
      return (
        <button className="square" onClick={() => alert('You have clicked this button')}>
        Button
      </button>
      );
    }
}
export default GardenHome
