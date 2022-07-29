import React from 'react';
import './application.css'
import Navbar from '../navbar';
import Chart from './chart';
import { Button } from '../button';

function Application () {
    return (
        <div className='application'>
            <div className='intro'>
                <h1>Hillside Street Prioritization Application</h1>
            </div>
            <div className='buttons'>
                <div className='setting'></div>
                <div className='setting'></div>
                <div className='setting'></div>
                <div className='setting'></div>
                <div className='setting'></div>
                <div className='setting'></div>
            </div>
            <div className='charts'>
                <Chart/>
            </div>
        </div>
    );
}

export default Application;