import './map.css';
import {useEffect, useRef} from 'react';
// import * as d3 from 'd3';

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

    const onEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                callback([e.latlng.lat, e.latlng.lng])
                console.log("Clicked on feature with coordinates:", e.latlng);
            }
        });
    }

    
    
    // console.log(geoJSONData)

    return (
            <MapContainer center={position} zoom={10} style={{ height: "700px", width: "40%" }}>
                {/* <MyMap/> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON ref={geoJsonLayer} data={geoJSONData} onEachFeature={onEachFeature}/>
                {/* {markers} */}
                {/* <MultipleMarkers /> */}
            </MapContainer>
    );
}

export default Map;
//https://www.mapillary.com/app/?pKey=498763468214164&focus=photo
