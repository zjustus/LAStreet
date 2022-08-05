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
            console.log(data);
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
        
        });

        var zoom = d3.zoom().filter(() => !d3.event.button)
                    .scaleExtent([0.8, 20]) //unzoom x0.5, zoom x20
                    .extent([[0, 0], [w, h]])
                    .on("zoom", function() {
                        svg.select('g').attr('transform', d3.event.transform);
                    })

        var svgZoom = d3.select('#mapContainer').select('svg').call(zoom);  //initiate zoom
        svgZoom.call(zoom.transform, d3.zoomIdentity.scale(1));


                // //ZOOM FEATURE
                // var zoom = d3.zoom().filter(() => !d3.event.button)
                // .scaleExtent([0.5, 20]) //unzoom x0.5, zoom x20
                // .extent([[0, 0], [w, h]])
                // .on('zoom', svg.attr("transform", d3.event.transform));
        
                // // .call(d3.zoom().on("zoom", function () {
                // //     svg.attr("transform", d3.event.transform)
                // //  }))
         
                // var svgZoom = d3.select('#mapContainer').select('svg').call(zoom);  //initiate zoom
                // svgZoom.call(zoom.transform, d3.zoomIdentity.scale(1));
        
    }

    return (
        <div id='mapContainer'/>
    );
}

export default Map;