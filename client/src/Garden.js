import React from 'react';
import Plot from './Plot.js';
import axios from 'axios'
import './App.css';

const NUM_PLOTS = 9;

class Garden extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plots: Array(NUM_PLOTS).fill(" "),
            names: Array(NUM_PLOTS).fill("empty"),
            growths: Array(NUM_PLOTS).fill(0)
        };
    }

    componentDidMount() {
        this.timer = setInterval( () => this.tick(), 5000 );
    }
    componentWillUnmount() {
        clearInterval(this.timer);
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
            </div>
        );
    }
}

export default Garden
