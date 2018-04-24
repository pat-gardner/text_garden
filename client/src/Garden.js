import React from 'react';
import Plot from './Plot.js';
import axios from 'axios'
import './App.css';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

class Garden extends React.Component {
  constructor(props) {
    super(props);
    this.handleSendMessageButton= this.handleSendMessageButton.bind(this);
    this.handleSendMessageSubmit= this.handleSendMessageSubmit.bind(this);
    this.handleShowMessages = this.handleShowMessages.bind(this);

    this.state = {
      plots: Array(9).fill(" "),
      displaySendMessage: false,
      displayViewMessage: false,
      messages: [],
      newMessagesNumber: 0
   };
  }

  componentDidMount() {
    this.refreshTimer = setInterval( () => this.tick(), 5000 );
  }
  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }
  handleSendMessageButton(){
    this.setState({displaySendMessage: !this.state.displaySendMessage});
  }
  handleSendMessageSubmit(data){
    this.setState({displaySendMessage: false});
    axios.post('sendMessage',data);
  }
  handleShowMessages(){
    console.log('view');
    this.setState({displayViewMessage: !this.state.displayViewMessage});
    // axios.get('getMessages').then((res)=>{
    //   console.log(res);
    // })
  }
  tick() {
    axios.get('/updateGarden')
    .then( (res) => {
      this.setState({ plots: res.data });
    })
    .catch( (err) => {
      console.log(err);
    });
    axios.get('/newMessages').then((res)=>{
      this.setState({ newMessagesNumber: res.data.number });
    });
    axios.get('/getMessages').then((res)=>{
      this.setState({messages: res.data.data})
    })
  }

  render() {
    const plots = this.state.plots.map((plot, i) => {
      return (<Plot key={i} img={plot} />);
    });
    const buttonMessage = this.state.displaySendMessage ? (
      'Close'
    ) : (
      'Send Message'
    );
    return (
      <div className='container'>
      {plots}
      <button className="message" onClick={this.handleSendMessageButton}>
      buttonMessage
      </button>
      {this.state.displaySendMessage &&
        <MessageForm onSendMessageSubmit={ this.handleSendMessageSubmit }/>
      }
      {this.state.newMessagesNumber}
      <button className="show_messages" onClick={this.handleShowMessages}>
      viewMessages
      </button>
      {this.state.displayViewMessage &&
        <MessageList data={ this.state.messages }/>
      }
      </div>
    );
  }
}

export default Garden
