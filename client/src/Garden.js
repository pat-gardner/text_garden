import React from 'react';
import Plot from './Plot.js';
import axios from 'axios'
import './App.css';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import InventoryList from './InventoryList';
import SeedInventoryList from './SeedInventoryList';
import ShopForm from './ShopForm'

const NUM_PLOTS = 9;

class Garden extends React.Component {
    constructor(props) {
        super(props);
        this.handleSendMessageButton= this.handleSendMessageButton.bind(this);
        this.handleSendMessageSubmit= this.handleSendMessageSubmit.bind(this);
        this.handleShopSubmit = this.handleShopSubmit.bind(this);
        this.handleShowMessages = this.handleShowMessages.bind(this);
        this.handleShowInventory = this.handleShowInventory.bind(this);
        this.handleSeedInventory = this.handleSeedInventory.bind(this);
        this.handleShowShop = this.handleShowShop.bind(this);

        this.state = {
            plots: Array(NUM_PLOTS).fill(" "),
            names: Array(NUM_PLOTS).fill("empty"),
            growths: Array(NUM_PLOTS).fill(0),
            displaySendMessage: false,
            displayViewMessage: false,
            displayShowInventory: false,
            displaySeedInventory: false,
            displayShop: false,
            messages: [],
            inventory: [],
            seeds: [],
            newMessagesNumber: 0
        };
    }

    componentDidMount() {
        this.timer = setInterval( () => this.tick(), 1000 );
        this.tick();
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
    handleShopSubmit(){
      console.log('shop submit');
    }
    handleShowMessages(){
        console.log('view');
        this.setState({displayViewMessage: !this.state.displayViewMessage});
        // axios.get('getMessages').then((res)=>{
        //   console.log(res);
        // })
    }
    handleSeedInventory(){
      console.log('seed_inv');
      this.setState({displaySeedInventory: !this.state.displaySeedInventory});
    }
    handleShowInventory(){
        console.log('show_inv');
        this.setState({displayShowInventory: !this.state.displayShowInventory});
    }
    handleShowShop(){
      console.log('show_shop');
      this.setState({displayShop: !this.state.displayShop});
    }
    tick() {
        axios.get('/updateGarden')
        .then( (res) => {
            if(res.data.status) {
                //Make sure there are always NUM_PLOTS plots
                var plots = Array(NUM_PLOTS).fill(" ");
                var names = Array(NUM_PLOTS).fill("empty");
                var growths = Array(NUM_PLOTS).fill(0);
                for(let i = 0; i < res.data.names.length; i++) {
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
            this.setState({newMessagesNumber: res.data.number });
        }).catch( (err) => {
            console.log(err);
        });
        axios.get('/getMessages').then((res)=>{
            this.setState({messages: res.data.data});
        }).catch( (err) => {
            console.log(err);
        });
        axios.get('/getInv').then((res)=>{
            console.log('getinv');
            if(res.data.result){
                this.setState({inventory: res.data.inventory.inventory});
                this.setState({seeds: res.data.inventory.seeds})
            }
        }).catch( (err) => {
            console.log(err);
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
            this.tick();
        })
        .catch( (err) => console.log(err) );
    }

    plant(i, seed) {
        axios.post('/plant', {
            seedName: 'A'
        })
        .then( (res) => {
            //The request failed on the serverside
            if(!res.data.status) {
                return;
            }
            this.tick();
        })
        .catch( (err) => console.log(err) );
    }



    render() {
        var plots = [];
        for(let i = 0; i < NUM_PLOTS; i++) {
            plots.push(<Plot key={i}
                img={this.state.plots[i]}
                // name={this.state.names[i]}
                growth={this.state.growths[i]}
                harvest={() => this.harvest(i, this.state.names[i])}
                plant={() => this.plant(i, this.state.names[i])}
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
                <button className="show_inv" onClick={this.handleShowInventory}>
                    show inv
                </button>
                {this.state.displayShowInventory &&
                  <h1> Letters </h1> &&
                    <InventoryList data={ this.state.inventory }/>
                }
                <button className="seed_inv" onClick={this.handleSeedInventory}>
                    show seeds
                </button>
                {this.state.displaySeedInventory &&
                  <h1> Seeds </h1>&&
                    <SeedInventoryList data={ this.state.inventory }/>
                }
                <button className="show_shop" onClick={this.handleShowShop}>
                    Shop
                </button>
                {this.state.displayShop &&
                    <ShopForm onShopSubmit={ this.handleShopSubmit }/>
                }
            </div>
        );
    }
}


export default Garden
