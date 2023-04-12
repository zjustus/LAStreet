import React from 'react';
import './application.css'
import Filters from '../filters'
// import Navbar from '../navbar';
// import Chart from './chart';
// import { Button } from '../button';
// import Map from './map';
// import StreetMap from './streetmap';
// import RenderMapillary from './mapillary';
// import Update from './updateMapillary';

function Application () {

    function updateDrawing(geoJson){
        console.log("Hello World")
        console.log(geoJson);
    }


    return (
        <div className='application'>
            <div className='intro'>
                <h1>Hillside Street Prioritization Application</h1>
            </div>
            <Filters callBack={updateDrawing}/> 
            <div className="data-selection">
                {/* Plot Graph Goes Here */}
                {/* Street Graph Goes Here */}
            </div>
            {/* Map Overview goes here */}
            {/* Street view goes here */}
        </div>
    );
}

export default Application;