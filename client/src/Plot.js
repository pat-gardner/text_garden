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
        if(this.props.growth === 0 && this.props.img === " "){
            this.props.plant();
        }
        else if(this.props.growth === 2) {
            this.props.harvest();
        }
    }
}

export default Plot;
