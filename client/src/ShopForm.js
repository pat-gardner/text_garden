import React, { Component } from 'react';
import style from './style';

class ShopForm extends Component {
  constructor(props) {
    super(props);
    this.state = { type: '', letter: '', amount: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleLetterChange = this.handleLetterChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
  }
  handleTypeChange(e) {
    this.setState({ type: e.target.value });
  }
  handleLetterChange(e) {
    this.setState({ letter: e.target.value });
  }
  handleAmountChange(e) {
    this.setState({ amount: e.target.value});
  }

  handleSubmit(e) {

    e.preventDefault();
    let type = this.state.type;
    let letter = this.state.letter;
    let amount = this.state.amount;
    if (!type || !letter || !amount) {
      console.log(type);
      console.log(letter);
      console.log(amount);
      alert('fail');
      return;
    }
    this.props.onShopSubmit({ type: type, letter: letter, amount: amount });
    this.setState({ letter: '', amount: '' });
  }

  render() {
    return (
      <form style={ style.shopForm } onSubmit={ this.handleSubmit }>
      <input
      type='radio'
      name="type"
      value="buy"
      onChange={ this.handleTypeChange }/> Buy

      <input
      type='radio'
      name="type"
      value="sell"
      onChange={ this.handleTypeChange }/> Sell

      <input
      type='text'
      maxLength="1"
      placeholder='A'
      style={ style.shopFormUser}
      value={ this.state.letter }
      onChange={ this.handleLetterChange }/>

      <input
      type='number'
      placeholder='1'
      style={ style.shopFormUser}
      value={ this.state.amount }
      onChange={ this.handleAmountChange }/>

      <input
      type='submit'
      value='Transact' />
      </form>
    )
  }
}
export default ShopForm;
