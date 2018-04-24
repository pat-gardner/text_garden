import React from 'react';
import Plot from './Plot.js';
import axios from 'axios'
import './App.css';

const NUM_PLOTS = 9;

class Garden extends React.Component {
    constructor(props) {
        super(props);
        this.state = { plots: Array(9).fill(" ") };
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
                    var arr = Array(NUM_PLOTS).fill(" ");
                    res.data.msg.forEach( (item, i) => {
                        arr[i] = item;
                    });

                    this.setState({ plots: arr });
                }
            })
            .catch( (err) => {
                console.log(err);
            });
    }

    render() {
        const plots = this.state.plots.map((plot, i) => {
            return (<Plot key={i} img={plot} />);
        });
        return (
            <div className='container'>
                {plots}
            </div>
        );
    }
}

export default Garden
