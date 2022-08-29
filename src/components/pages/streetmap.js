import './streetmap.css';
import {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const position = [34.05, -118.2];

var arrCoordinates = [
    [-118.2, 34.06],
    [-118.3, 34.06],
    [-118.4, 34.06]
];

// var arrCoordinates = [
//     {long: 34.06, lat: -118.2},
//     {long: 34.06, lat: -118.3},
//     {long: 34.06, lat: -118.4}
// ];

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

function MultipleMarkers() {
  return arrCoordinates.map((coordinate, index) => {
    return <Marker key={index} position={[coordinate[1], coordinate[0]]} icon={icon}>
                <Popup>
                    This is {coordinate.long}, {coordinate.lat}.
                </Popup>
    </Marker>;
  });
}

export default function StreetMap() {
  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MultipleMarkers />
    </MapContainer>
  );
}

// function InteractMap() {

//     d3.select('.leaflet-overlay-pane').selectAll('circle').remove();

//     // var svg = d3.select('.leaflet-overlay-pane').append('svg')
//     //         .attr('width', 600).attr('height', 700);
//     // var g = svg.append('g').attr('class', 'leaflet-zoom-hide');

//     // svg.selectAll()
//     // .data(markers)
//     // .enter()
//     // .append('circle')
//     // .attr('cx', function(d) { return d.lat;})
//     // .attr('cy', function(d) { return d.long;})
//     // .attr('r', 12)
//     // .attr('fill', 'yellow');

// }


// export {StreetMap, InteractMap};
// export default StreetMap;