import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
import 'leaflet/dist/leaflet.css';
import './streetmap.css';



function CityMap(){

    function drawMap() {
        d3.select('#mapContainer')
        .select('svg')
        .remove();
        d3.select('#mapContainer')
        .select('button')
        .remove();

        d3.select('#mapResetButton')
        .append('button')
        .attr('id', 'resetButton')
        .text('Reset Zoom')
        .on('click', function() {
            d3.select('#mapContainer')
            .select('svg')
            //maybe here
            .call(zoom.transform, d3.zoomIdentity.scale(1));
        });
        
        var w = 500; //CHANGE mapW and mapH in chart.js if you change this
        var h = 600;

        var svg = d3.select('#mapContainer')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('style', 'outline: thick solid lightgrey')
                // .attr('style', 'outline: thin solid lightgrey')

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

        var tooltip0 = d3.select('#mapContainer').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

        // d3.json('/hillside_inventory_LA_centrality_full.geojson')
        d3.json('/LAStreet/lacounty.geojson')
        .then((data) => {
            // console.log(data);
            svg.append('g')
            .selectAll("path")
            .data(data.features)
            .join('path')
            .attr("fill", "none")
            .style("stroke", "black")
            .style('stroke-width', '0.2px')
            .attr('d', geoGenerator)
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "#C6ECFF")
                    .style('stroke-width', '0.2px')
                //make div appear
                tooltip0.transition()
                .duration(100)
                .style('opacity', 1);
                //CHANGE tooltip fields
                console.log(d);
                tooltip0.html("Street Name: " + d.properties.ST_NAME + " ") //FIX THIS
                    .style("left", (d3.event.pageX + 15) + "px") //adjust these numbers for tooltip location
                    .style("top", (d3.event.pageY - 15) + "px");  
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "black")
                //make div disappear
                tooltip0.transition()
                .duration('200')
                .style('opacity', 0);
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


    function DisplayTable() {
        // const testMap = useMap();
        var brushed_streets = [];
        var brushed_streets2 = [];
        var selected_region = [];

        // disregard brushes w/o selections  
        if (!d3.event.selection) return;

        // this makes the brush box go away after selection
        d3.select(this).call(brush.move, null);

        var d_brushed = [];
        var coorArray = [];
        var totalMiles = 0;
        //THIS LINE
        d3.selectAll(".brushed").data()
        .filter(function(d) {
            coorArray.push(d.OBJECTID);
            // d_brushed.push(d.ST_NAME);
            // d_brushed.push('ID: ' + d.OBJECTID); //CHANGE what part of data to print
            totalMiles = totalMiles + parseFloat(d.Shape__Length);
            totalMiles = Math.round(totalMiles * 1e4) / 1e4;
            d_brushed.push("Total selected miles: " + Math.round((totalMiles / 5280) * 1e2) / 1e2);
            d_brushed.push("Number of selected street sections: " + coorArray.length);
        });
        console.log(d_brushed);

        var geometryArray = [];
        coorArray.forEach(function(i) {
            const streetIDS = data.features.map(function(i) {
                return {'OBJECTID': i.properties.OBJECTID,
                        'geometry':  i.geometry,
                        'ST_NAME': i.properties.ST_NAME
                    };
            })
            streetIDS.forEach(function(streetid) {
                if(streetid.OBJECTID === i){
                    var temp = {'OBJECTID': streetid.OBJECTID,
                                'geometry': streetid.geometry,
                                'ST_NAME': streetid.ST_NAME};
                    geometryArray.push(temp);
                }
            })
        })

        console.log(geometryArray);

        var mapW = 500; //CHANGE this if you change the map container size in map.js
        var mapH = 600;
        var projection = d3.geoEquirectangular()
        .scale(mapW * 100)
        .center([-118.4, 34.03])
        .translate([mapW/2, mapH/2]);
        var geoGenerator = d3.geoPath().projection(projection);

        if (geometryArray.length > 0) {
            //clear all selected streets in map
            brushed_streets = [];
            brushed_streets2 = [];
            //for each brushed street, display in map
            geometryArray.forEach(i => brushed_streets.push(i));
            geometryArray.forEach(function(i) {
                var temp = i.ST_NAME;
                i.geometry['ST_NAME'] = temp;
            });
            geometryArray.forEach(i => brushed_streets2.push(i.geometry));
            //clear out previous selected streets
            d3.select('#mapContainer').select('[id="selected_streets"]')
            .remove();
            //clear out previous selected streets in leaflet
            d3.selectAll("path[class*='street']").style('stroke', 'none');

            console.log(brushed_streets);
            console.log(brushed_streets2);

            //draw circles
            var coordinates = [];
            brushed_streets2.forEach(function(i) {
                console.log(i);
                //longitude
                var lon = i.coordinates[0][1];
                // var lon = i.geometry.coordinates[0][1];
                //latitude
                var lat = i.coordinates[0][0];
                // var lat = i.geometry.coordinates[0][0];
                var temp = {'longitude': lon,
                            'latitude': lat};
                coordinates.push(temp);
            })

            d3.select('#mapContainer')
            .select('svg')
            .append('g')
            .attr('id', 'selected_streets')
            .selectAll('circle')
            .data(coordinates)
            .enter()
            .append('circle')
            .attr('cx', function(d) { 
                return projection([d.latitude, d.longitude])[0];
            })
            .attr('cy', function(d) {
                return projection([d.latitude, d.longitude])[1];
            })
            .attr('r', 8)
            .style('opacity', 0.5)
            .style('fill', '#B8EC87');

            //tooltip for map
            var tooltip2 = d3.select('#mapContainer').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

            var tooltip3 = d3.select('#leafletTooltip').append('div')
            .attr('class', 'tooltipTwo')
            .style('opacity', 0);

            console.log(brushed_streets2);
            d3.select('[id="selected_streets"]')
            .selectAll("path")
            .data(brushed_streets2)
            .join('path')
            .attr("fill", "none")
            .style("stroke", "blue")
            .style('r', 5)
            .style('stroke-width', '0.2px') //FIX: when we zoom in, the red line should change size as zoom scale
            .attr('d', geoGenerator)
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "grey")
                    .style('stroke-width', '0.3px')
                //make div appear
                tooltip2.transition()
                    .duration(100)
                    .style('opacity', 1);
                //CHANGE tooltip fields
                console.log(d);
                tooltip2.html("Street Name: " + d.ST_NAME + " ") //FIX THIS
                    .style("left", (d3.event.pageX + 15) + "px") //adjust these numbers for tooltip location
                    .style("top", (d3.event.pageY - 15) + "px");                    
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('100')
                    .style("stroke", "blue")
                    .style('stroke-width', '0.2px');

                //make div disappear
                tooltip2.transition()
                .duration('200')
                .style('opacity', 0);
            });

            brushed_streets.forEach(function(i) {
                console.log(i.OBJECTID);
                var id = ".street" + i.OBJECTID;
                d3.select(id).style('stroke', 'blue')
                        .attr("fill", "none")
                        // .attr("style", "pointer-events: visible;")
                        .style("pointer-events", "visible")
                        .style('stroke-width', '20px')
                        .style("stroke-opacity", 0.7)
                        .on('click', function() {
                            console.log(d3.select(this).attr('class'));
                        })
                        .on('mouseover', function (d, i) {
                            d3.select(this).transition()
                                .duration('100')
                                .style("stroke", "red")
                                .style('stroke-width', '20px')
                            //make div appear
                            tooltip3.transition()
                                .duration(100)
                                .style('opacity', 1);
                            //CHANGE tooltip fields
                            var temp = d3.select(this).attr('class');
                            var temp2 = temp.slice(6, temp.length);
                            var streetName;
                            data.features.forEach(function(i) {
                                if(i.properties.OBJECTID == temp2) {
                                    streetName = i.properties.ST_NAME;
                                }
                            })

                            tooltip3.html('Street name: ' + streetName)
                            .attr('x', w - 50)
                            .attr('y', h);              
                        })
                        .on('mouseout', function (d, i) {
                            d3.select(this).transition()
                                .duration('100')
                                .style("stroke", "blue")
                                .style('stroke-width', '20px');
        
                            //make div disappear
                            tooltip3.transition()
                            .duration('200')
                            .style('opacity', 0);
                        });
            })

        } else {
            //clear all selected streets in map
            brushed_streets = [];
            d3.select('#mapContainer')
            .select('[id="selected_streets"]')
            .remove();

            //clear selected streets in leaflet
            //select all paths that have the word street in the class name
            d3.selectAll("path[class*='street']").style('stroke', 'none');

        }

        if (d_brushed.length > 0) {
            //clear all displayed selected dots
            selected_region = [];
            //for each brushed dot, add into display array
            // d_brushed.forEach(i => selected_region.push(i));
            selected_region.push(d_brushed[d_brushed.length - 1]);
            selected_region.push(d_brushed[d_brushed.length - 2]);
            d3.select('#selected_regions_title').select('text').remove();
            d3.select('#selected_regions_title')
            .append('text')
            .attr('x', 0)
            .attr('y', h + 80)
            .html(selected_region.join(', '));
        } else {
            //clear all displayed selected dots
            selected_region = [];
            d3.select('#selected_regions_title').select('text').remove();
        }
    }

    var brush = d3.brush()
    .on("brush", highlightBrushedCircles)
    .on("end", DisplayTable); 


}

export default CityMap;
