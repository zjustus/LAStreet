import './map.css';
// import {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
// import chart from './chart';

import { LayerGroup, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function Map () {

    function getGeoData(url) {
        return fetch(url)
            .then(function(response) {
                return response.json();
            });
    }

    function MyMap() {

        const streetMap = useMap();
        console.log('map center: ', streetMap.getCenter());
        

        getGeoData('/LAStreet/hillside_inventory_LA_centrality_full.geojson')
        .then(function(data) {
            const testsvg = d3.select(streetMap.getPanes().overlayPane).append('svg')
            .attr('id', 'svgleaflet');
            const g = testsvg.append('g').attr('class', 'leaflet-zoom-hide');
    
            var transform = d3.geoTransform({point: projectPoint});
            var path = d3.geoPath().projection(transform);
    
            streetMap.on('click', function(e) {
                var latlng = e.latlng;
                // var layerpoint = e.layerPoint;
                // var pixelPosition = streetMap.latLngToLayerPoint(latlng);
                // alert(latlng + " " + layerpoint + " " + pixelPosition);
                // alert(latlng);
                console.log(latlng.lng + ' ' + latlng.lat);
                var container = d3.select('.mapillary-attribution-container');
                container.select('a').attr('xlink:href', 'https://www.mapillary.com/app/?pKey=259103735961077&focus=photo');
            })
    
            // create path elements for each of the features
            const d3_features = g
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr('class', function(d){
                // console.log(d.properties.OBJECTID);
                return "street" + d.properties.OBJECTID;
            })
            .style("fill-opacity", 0.7)
            .attr("fill", "none")
            .style("stroke", "none");
    
            // streetMap.on("viewreset", reset);
            streetMap.on("zoom", reset);
    
            reset();
    
            // fit the SVG element to leaflet's map layer
            function reset() {
                var bounds = path.bounds(data);
                var topLeft = bounds[0];
                var bottomRight = bounds[1];
    
                testsvg
                .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");
    
                g.attr(
                "transform",
                "translate(" + -topLeft[0] + "," + -topLeft[1] + ")"
                );
    
                // initialize the path data
                d3_features
                .attr("d", path);
                // .style("fill-opacity", 0.7)
                // .attr("fill", "none")
                // .style("stroke", "blue");
            }
    
            // Use Leaflet to implement a D3 geometric transformation.
            function projectPoint(x, y) {
                const point = streetMap.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
        })
        

    }

    const position = [34.03, -118.26];
    const center = [-41.2858, 174.7868];
    

    return (
            <MapContainer center={position} zoom={10} style={{ height: "700px", width: "40%" }}>
                <MyMap/>
                <LayerGroup>

                </LayerGroup>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <MultipleMarkers /> */}
            </MapContainer>
    );
}

export default Map;
//https://www.mapillary.com/app/?pKey=498763468214164&focus=photo