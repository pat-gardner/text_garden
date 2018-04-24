import React from 'react';
import Plot from './Plot.js';
import axios from 'axios'
import './App.css';

class Garden extends React.Component {
    constructor(props) {
        super(props);
        this.state = { plots: Array(9).fill(" ") };
    }

    componentDidMount() {
        this.refreshTimer = setInterval( () => this.tick(), 20000 );
    }
    componentWillUnmount() {
        clearInterval(this.refreshTimer);
    }

    tick() {
        axios.get('/updateGarden')
            .then( (res) => {
                this.setState({ plots: res.data });
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
