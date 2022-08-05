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
        d3.select('#mapContainer')
        .select('button')
        .remove();

        d3.select('#mapContainer')
        .append('button')
        .attr('id', 'resetButton')
        .text('Reset Zoom')
        .on('click', function() {
            d3.select('#mapContainer')
            .select('svg')
            //maybe here
            .call(zoom.transform, d3.zoomIdentity.scale(1));
        });

        var w = 400;
        var h = 500;

        var svg = d3.select('#mapContainer')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('style', 'outline: thin solid lightgrey')

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", w )
        .attr("height", h )
        .attr("x", 0)
        .attr("y", 0);

        var projection = d3.geoEquirectangular()
        .scale(w * 100)
        .center([-118.4, 34.03])
        .translate([w/2, h/2]);

        var geoGenerator = d3.geoPath().projection(projection);

        // d3.json('/hillside_inventory_LA_centrality_full.geojson')
        d3.json('/lacounty.geojson')
        .then((data) => {
            // console.log(data);
            svg.append('g')
            .selectAll("path")
            .data(data.features)
            .join('path')
            .attr("fill", "lightgrey")
            .style("stroke", "lightgrey")
            .style('stroke-width', '0.2px')
            .attr('d', geoGenerator)
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "#C6ECFF")
                    .style('stroke-width', '0.5px')
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "lightgrey")
            });
        
            var coorArray = [49744, 43006, 67662, 28918, 16501, 17982];
            var geometryArray = [];
            coorArray.forEach(function(i) {
                const streetIDS = data.features.map(function(i) {
                    return {'OBJECTID': i.properties.OBJECTID,
                            'geometry':  i.geometry};
                })
                // console.log(streetIDS);
                streetIDS.forEach(function(streetid) {
                    if(streetid.OBJECTID == i){
                        geometryArray.push(streetid.geometry);
                    }
                })
            })
            console.log(geometryArray); //FIX: you should probably add other fields here
            svg.append('g')
            .selectAll("path")
            .data(geometryArray)
            .join('path')
            .attr("fill", "blue")
            .style("stroke", "blue")
            .style('r', 5)
            .style('stroke-width', '15px') //FIX: when we zoom in, the red line should change size as zoom scale
            .attr('d', geoGenerator)
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "#B8EC87")
                    .style('stroke-width', '1px')
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "blue")
                    .style('stroke-width', '15px')
            });

        });



        var zoom = d3.zoom().filter(() => !d3.event.button)
                    .scaleExtent([0.8, 20]) //unzoom x0.5, zoom x20
                    .extent([[0, 0], [w, h]])
                    .on("zoom", function() {
                        svg.selectAll('g').attr('transform', d3.event.transform);
                    })

        var svgZoom = d3.select('#mapContainer').select('svg').call(zoom);  //initiate zoom
        svgZoom.call(zoom.transform, d3.zoomIdentity.scale(1));
        
    }

    return (
        <div id='mapContainer'/>
    );
}

export default Map;