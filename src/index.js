#!/usr/bin/env node

'use strict';

const React = require('react');
const {useReducer, useEffect} = React;
const ReactDOM = require('react-dom');
const $ = require('jquery');
const dateFormat = require('dateformat');

function App(props) {
    const [state, dispatch] = useReducer(reducer, {catNumber: 0, catNames: undefined});

    useEffect(() => {
        $.getJSON('/kissat.json', data => {
            dispatch({command: 'init', data});
        });
    }, []);

    function reducer(state, message) {
        const newState = {...state};
        const NUM_CATS = newState.catNames ? newState.catNames.length : 0;
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
                if (newState.catNumber < 0) {
                    newState.catNumber = NUM_CATS - 1;
                }
                break;
            default:
                throw new Error(`Unknown message: ${message}`);
        }
        return newState;
    }

    return <div>
        <HeaderComponent/>
        <CatImage n={state.catNumber}/>
        <div className="w3-container w3-yellow">
            <h2>{state.catNames ? state.catNames[state.catNumber] : 'Lataa ...'}</h2>
        </div>
        <div style={{clear: "both"}}/>
        <div className="w3-container w3-red">
            <button className="w3-button w3-grey w3-margin w3-border"
                    onClick={() => dispatch({command: '-'})}>Edellinen</button>
            <button className="w3-button w3-grey w3-margin w3-border"
                    onClick={() => dispatch({command: '+'})}>Seuraava</button>
        </div>
    </div>;
}

function HeaderComponent(props) {
    return <div className="w3-container w3-black">
        <h1 className="w3-left">Kissakuvasto</h1>
        <Clock className="w3-right"/>
    </div>;
}

function Clock(props) {
    const [state, dispatch] = useReducer(state => {
        return new Date();
    }, new Date());
    useEffect(() => {
        const interval = setInterval(dispatch, 100);
        return () => {
            deleteInterval(interval);
        };
    }, []);
    return <h3>{dateFormat(state, "isoDateTime")}</h3>;
}

function CatImage(props) {
    return <img src={`images/kissa_${props.n}.jpg`}/>;
}

ReactDOM.render(<App/>, $('#app')[0]);
