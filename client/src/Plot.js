import React from 'react';
import './App.css';

class Plot extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const img = this.props.img;
        return (
            <div className='plot' onClick={this.handleClick}>
                <p className='crop'> {img} </p>
            </div>
        );
    }

    componentDidMount() {
        //TODO: axios query to express //probs not
    }

    handleClick(e) {
        console.log(e.type);
    }
}

export default Plot;
