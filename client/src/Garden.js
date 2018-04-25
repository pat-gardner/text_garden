import React from 'react';
import Plot from './Plot.js';
import axios from 'axios'
import './App.css';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

const NUM_PLOTS = 9;

class Garden extends React.Component {
    constructor(props) {
        super(props);
        this.handleSendMessageButton= this.handleSendMessageButton.bind(this);
        this.handleSendMessageSubmit= this.handleSendMessageSubmit.bind(this);
        this.handleShowMessages = this.handleShowMessages.bind(this);

        this.state = {
            plots: Array(NUM_PLOTS).fill(" "),
            names: Array(NUM_PLOTS).fill("empty"),
            growths: Array(NUM_PLOTS).fill(0),
            displaySendMessage: false,
            displayViewMessage: false,
            messages: [],
            newMessagesNumber: 0
        };
    }

    componentDidMount() {
        this.timer = setInterval( () => this.tick(), 5000 );
    }
    componentWillUnmount() {
        clearInterval(this.timer);
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
                if(res.data.status) {
                    //Make sure there are always NUM_PLOTS plots
                    var plots = Array(NUM_PLOTS).fill(" ");
                    var names = Array(NUM_PLOTS).fill("empty");
                    var growths = Array(NUM_PLOTS).fill(0);
                    for(let i = 0; i < NUM_PLOTS; i++) {
                        plots[i] = res.data.images[i];
                        names[i] = res.data.names[i];
                        growths[i] = res.data.growths[i];
                    }
                    this.setState({
                        plots: plots,
                        names: names,
                        growths: growths
                    });
                }
            })
            .catch( (err) => {
                console.log(err);
            });
            axios.get('/newMessages').then((res)=>{
              this.setState({ newMessagesNumber: res.data.number });
            });
            axios.get('/getMessages').then((res)=>{
              this.setState({messages: res.data.data})
            });
    }

    harvest(i, name) {
        axios.post('/harvest', {
            cropName: name
        })
        .then( (res) => {
            //The request failed on the serverside
            if(!res.data.status) {
                return;
            }
            console.log('Harvest');
            console.log(res.data);
        });
    }

    render() {
        var plots = [];
        for(let i = 0; i < NUM_PLOTS; i++) {
            plots.push(<Plot key={i}
                img={this.state.plots[i]}
                // name={this.state.names[i]}
                growth={this.state.growths[i]}
                harvest={() => this.harvest(i, this.state.names[i])}
            />);
        }

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