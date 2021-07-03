#!/usr/bin/env node

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

function App(props) {
    const [state, dispatch] = React.useReducer(reducer, 0);

    function reducer(catNumber, message) {
        switch (message) {
            case '+':
                return (catNumber + 1) % 5;
            case '-':
                return (catNumber + 4) % 5;
            default:
                return new Error(`Unknown message: ${message}`);
        }
    }

    return <div>
        <CatImage n={state}/>
        <div style={{clear: "both"}}/>
        <button onClick={() => dispatch('-')}>Edellinen</button>
        <button onClick={() => dispatch('+')}>Seuraava</button>
    </div>;
}

function CatImage(props) {
    return <img src={`images/kissa_${props.n}.jpg`}/>;
}

ReactDOM.render(<App/>, $('#app')[0]);