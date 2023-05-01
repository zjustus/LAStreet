// import React from 'react';
import { useState } from "react";
import './application.css'
import Filters from '../filters'
import ScatterPlot from '../scatterPlot';
// import FilterSearchAPI from '../filtersearch'
// import Navbar from '../navbar';
// import Chart from './chart';
// import { Button } from '../button';
import Map from './map';
// import StreetMap from './streetmap';
// import RenderMapillary from './mapillary';
// import Update from './updateMapillary';

function Application () {
    const [geoData, setGeoData] = useState([]);
    const [selectedData, setSelectedData] = useState([])

    function updateGeoData(geoDataNew){
        console.debug(geoDataNew);
        setGeoData(geoDataNew)
    }

    function updateGeoSelection(geoSelection){
        console.debug(geoSelection)
        setSelectedData(geoSelection)
    }

    

    return (
        <div className='application'>
            <div className='intro'>
                <h1>Hillside Street Prioritization Application</h1>
            </div>
            <Filters callBack={updateGeoData}/> 
            <div className="data-selection">
                <ScatterPlot geoData={geoData} callback={updateGeoSelection} width={500} height={500} />
                {/* Plot Graph Goes Here */}
                {/* Street Graph Goes Here */}
            </div>
            <div className='map'>
                {/* <Map geoData={selectedData}/> */}
                {selectedData.length ? <Map geoData={selectedData}/> : <p>Loading data...</p>}
                {/* <FilterSearchAPI geoData={selectedData}/> */}
                <div id="leafletTooltip"></div>
                {/* <RenderMapillary/> */}
                {/* <Update/> */}
            </div>
        </div>
    );
}

export default Application;