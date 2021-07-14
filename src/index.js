#!/usr/bin/env node

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

function App(props) {
    const [state, dispatch] = React.useReducer(reducer, {catNumber: 0, catNames: undefined});

    React.useEffect(() => {
        $.getJSON('/kissat.json', data => {
            dispatch({command: 'init', data});
        });
    }, []);

    function reducer(state, message) {
        const newState = {...state};
        const NUM_CATS = 6;
        switch (message.command) {
            case 'init':
                newState.catNames = message.data;
                break;
            case '+':
                newState.catNumber++;
                if (newState.catNumber >= NUM_CATS) {
                    newState.catNumber = 0;
                }
                break;
            case '-':
                newState.catNumber--;
                if (newState.catNumber <= 0) {
                    newState.catNumber = NUM_CATS - 1;
                }
                break;
            default:
                throw new Error(`Unknown message: ${message}`);
        }
        return newState;
    }

    return <div>
        <CatImage n={state.catNumber}/>
        <h2>{state.catNames ? state.catNames[state.catNumber] : 'Lataa ...'}</h2>
        <div style={{clear: "both"}}/>
        <button onClick={() => dispatch({command: '-'})}>Edellinen</button>
        <button onClick={() => dispatch({command: '+'})}>Seuraava</button>
    </div>;
}

function CatImage(props) {
    return <img src={`images/kissa_${props.n}.jpg`}/>;
}

ReactDOM.render(<App/>, $('#app')[0]);