/**
 * Map Display,
 * This React component will display a map on the screen
 * given geoJSON coordinates it will add them to the map
 * when selecting a coordinate it will call the callback function and pass the selected coordinates in an array [longitude, latitude] 
 * 
 * TODO: Add in a tool tip to show what street is selected. 
 */

import './map.css';
import {useEffect, useRef} from 'react';

// import chart from './chart';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map ({geoData = [], callback}) {

    const position = [34.03, -118.26];
    // const center = [-41.2858, 174.7868];
    
    // put the list of features into the standard format
    const geoJsonLayer = useRef(null);
    const geoJSONData = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": geoData
    }
    useEffect(() => {
        if (geoJsonLayer.current) {
            geoJsonLayer.current.clearLayers().addData({
                "type": "FeatureCollection",
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": geoData
            });
        }
    }, [geoData]);

    // Returns selected components
    const onEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                callback([e.latlng.lat, e.latlng.lng])
                console.log("Clicked on feature with coordinates:", e.latlng);
            }
        });
    }

    return (
            <MapContainer center={position} zoom={10} style={{ height: "700px", width: "40%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON ref={geoJsonLayer} data={geoJSONData} onEachFeature={onEachFeature}/>
            </MapContainer>
    );
}

export default Map;
//https://www.mapillary.com/app/?pKey=498763468214164&focus=photo
