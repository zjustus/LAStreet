// import React from 'react';
import { useEffect, useState } from "react";
import './application.css'
import Filters from '../filters'
import ScatterPlot from '../scatterPlot';
// import Navbar from '../navbar';
// import Chart from './chart';
// import { Button } from '../button';
// import Map from './map';
// import StreetMap from './streetmap';
// import RenderMapillary from './mapillary';
// import Update from './updateMapillary';

function Application () {
    const [geoData, setGeoData] = useState([]);

    function updateGeoData(geoDataNew){
        console.log(geoDataNew);
        setGeoData(geoDataNew)
    }

    

    return (
        <div className='application'>
            <div className='intro'>
                <h1>Hillside Street Prioritization Application</h1>
            </div>
            <Filters callBack={updateGeoData}/> 
            <div className="data-selection">
                <ScatterPlot geoData={geoData} />
                {/* Plot Graph Goes Here */}
                {/* Street Graph Goes Here */}
            </div>
            <div className='map'>
                <div id="leafletTooltip"></div>
                {/* <Map/> */}
                {/* <RenderMapillary/> */}
                {/* <Update/> */}
            </div>
        </div>
    );
}

export default Application;