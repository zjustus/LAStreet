import './chart.css';
// import React, {useState, useRef, useEffect} from 'react';
// import * as d3 from 'd3';
// import * as d3Slider from 'd3-simple-slider';
// import Select, {components} from "react-select";
// import { LayerGroup, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import * as d3Geo from "d3-geo";
// import './streetmap.css';
// import { brush, sum, svg } from 'd3';
// import { type } from '@testing-library/user-event/dist/type';
// import { Dropdown } from './dropdown';

function Chart() {

    return (
        <div id='bigcontainer'>
                <div id='scrollable-div'>
                    <div id='scrollable-content'>
                        <div id='sliderFamily'>
                                <div id='sliderFirstRow'>
                                    <div id='sliderContainer1'>
                                        <p>Width Rating Weight</p>
                                        <div id='sliderValueOne'/>
                                    </div>
                                    <div id='sliderContainer2'>
                                        <p>PCI Rating Weight</p>
                                        <div id='sliderValueTwo'/>
                                    </div>
                                    <div id='sliderContainer3'>
                                        <p>Curb Rating Weight</p>
                                        <div id='sliderValueThree'/>
                                    </div>
                                    <div id='sliderContainer4'>
                                        <p>Sidewalk Rating Weight</p>
                                        <div id='sliderValueFour'/>
                                    </div>
                                    <div id='sliderContainer5'>
                                        <p>Importance Distance Weight</p>
                                        <div id='sliderValueFive'/>
                                    </div>
                                    <div id='sliderContainer6'>
                                        <p>Importance Population Weight</p>
                                        <div id='sliderValueSix'/>
                                    </div>
                                    <div id='sliderContainer7'>
                                        <p>Importance Time Weight</p>
                                        <div id='sliderValueSeven'/>
                                    </div>
                                    <div id='sliderContainer8'>
                                        <p>Importance Width Weight</p>
                                        <div id='sliderValueEight'/>
                                    </div>
                                </div>
                            </div> 
                            <div id='filterFamily'>       
                                <div id='filterFirstRow'>
                                    <div id='multiselect1'/>
                                    <div id='multiselect2'/>
                                    <div id='multiselect3'/>
                                </div>
                                <div id='filterSecondRow'>
                                    <div id='multiselect4'/>
                                    <div id='multiselect5'/>
                                    <div id='multiselect6'/>
                                </div>
                            </div>  
                    </div>          
                </div>   
            <button id='switchModeButton'>Tooltip mode</button>
            <div id='chartAndMap'>
                <div id='container'></div>
                <div id='mapResetButton'></div>
                <div id='mapContainer'></div>
            </div>
        </div>
    );

}
export default Chart;
