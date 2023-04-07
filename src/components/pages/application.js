import React from 'react';
import './application.css'
import Navbar from '../navbar';
import Chart from './chart';
import { Button } from '../button';
import Map from './map';
import StreetMap from './streetmap';
import RenderMapillary from './mapillary';
import Update from './updateMapillary';
import CityMap from './cityMap';
import Scatter from './scatter';

function Application () {
    return (
        <div className='application'>
            <div className='intro'>
                <h1>Hillside Street Prioritization Application</h1>
            </div>
            <div className='charts'>
                <div className='chart'>
                    {/* <Chart/> */}
                    <Scatter/>
                </div>
            </div>
            <div className='map'>
                <div id="leafletTooltip"></div>
                
                {/* <RenderMapillary/> */}
                <Update/>
            </div>
        </div>
    );
}

export default Application;