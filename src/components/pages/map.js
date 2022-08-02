import './map.css';
import {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';

function Map () {

    useEffect(() => {
        drawMap();
    }, []);


    function drawMap() {
        d3.select('#mapContainer')
        .select('svg')
        .remove();

        var w = 400;
        var h = 500;

        var svg = d3.select('#mapContainer')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('style', 'outline: thin solid lightgrey')

        var projection = d3.geoEquirectangular()
        .scale(w * 100)
        .center([-118.4, 34.03])
        .translate([w/2, h/2]);

        var geoGenerator = d3.geoPath().projection(projection);

        // d3.json('/hillside_inventory_LA_centrality_full.geojson')
        d3.json('/lacounty.geojson')
        .then((data) => {
            console.log(data);
            svg.append('g')
            .selectAll("path")
            .data(data.features)
            .join('path')
            .attr("fill", "lightgrey")
            .style("stroke", "lightgrey")
            .attr('d', geoGenerator);
        });
    }

    return (
        <div id='mapContainer'/>
    );
}

export default Map;