import React from 'react';
import './application.css'
import Navbar from '../navbar';
import Chart from './chart';
import { Button } from '../button';
import Map from './map';
import StreetMap from './streetmap';
import RenderMapillary from './mapillary';

function Application () {
    return (
        <div className='application'>
            <div className='intro'>
                <h1>Hillside Street Prioritization Application</h1>
            </div>
            <div className='charts'>
                <div className='chart'>
                    <Chart/>
                </div>
            </div>
            <div className='map'>
                <Map/>
                <RenderMapillary/>  
            </div>
        </div>
    );
}

export default Application;