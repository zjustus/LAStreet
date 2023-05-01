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
    const [selectedData, setSelectedData] = useState([]);
    const [selectedCords, setSelectedCords] = useState([]);

    // These are dubug functions, in final production bypass and skip strait to the sets
    function updateGeoData(geoDataNew){
        console.debug(geoDataNew);
        setGeoData(geoDataNew)
    }

    function updateGeoSelection(geoSelection){
        console.debug(geoSelection)
        setSelectedData(geoSelection)
    }

    function updateSelectedCords(cords){
        setSelectedCords(cords)
        console.log(selectedCords)
    }

    

    return (
        <div className='application'>
            <div className='intro'>
                <h1>Hillside Street Prioritization Application</h1>
            </div>
            <Filters callBack={updateGeoData}/> 
            <ScatterPlot geoData={geoData} callback={updateGeoSelection} width={500} height={500} />
            <Map geoData={selectedData} callback={updateSelectedCords}/>
        </div>
    );
}

export default Application;