import './chart.css';
import {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
import * as d3Slider from 'd3-simple-slider';

function Chart() {

    function getGeoData(url) {
        return fetch(url)
            .then(function(response) {
                return response.json();
            });
    }

    getGeoData('/hillside_inventory_LA_centrality_full.geojson')
    .then(function(data) {

        data.features.forEach(function(feature) {
            //width rating = actual width / designation width
            var width_ratio = feature.properties['width_ratio'];
            var width_rating;
            if(width_ratio > 1)
            {
                width_rating = 1.0;
            }
            else if(width_ratio < 0.5)
            {
                width_rating = 0.1;
            }
            else
            {
                width_rating = 3.6 * (width_ratio - 0.5)**2 + 0.1;
            }
            //round to 4 decimal digits
            width_rating = Math.round(width_rating * 1e4) / 1e4;
            feature.properties['width_rating'] = width_rating;

            //pci rating = pci ^ 2 / 100
            var pci = feature.properties['pci'];
            var pci_rating;
            pci_rating = (pci / 100) ** 2;
            pci_rating = Math.round(pci_rating * 1e4) / 1e4;
            feature.properties['pci_rating'] = pci_rating;

            //sidewalk rating = designated sidewalk points / section length
            var sidewalk_ratio = feature.properties['sidewalk_ratio'];
            var sidewalk_rating;
            if(sidewalk_ratio > 0.19)
            {
                sidewalk_rating = 1;
            }
            else if(sidewalk_ratio < 0)
            {
                sidewalk_rating = 0.1;
            }
            else
            {
                sidewalk_rating = 24.931 * sidewalk_ratio ** 2 + 0.1;
            }
            sidewalk_rating = Math.round(sidewalk_rating * 1e4) / 1e4;
            feature.properties['sidewalk_rating'] = sidewalk_rating;

            //curb rating = designated curb points / section length
            var curb_ratio = feature.properties['curb_ratio'];
            var curb_rating;
            if(curb_ratio > 0.25)
            {
                curb_rating = 1;
            }
            else if(curb_ratio < 0)
            {
                curb_rating = 0.1;
            }
            else
            {
                curb_rating = 14.4 * curb_ratio ** 2 + 0.1;
            }
            curb_rating = Math.round(curb_rating * 1e4) / 1e4;
            feature.properties['curb_rating'] = curb_rating;
        });

        var updatedGeoData = data.features;
        var newGeoData = []; //holds a list of each street's properties
        updatedGeoData.forEach(function(street){
            newGeoData.push(street['properties']);
        })

        //Condition weights default
        var widthRW = 0.33;
        var pciRW = 0.33;
        var curbRW = 0.26;
        var sidewalkRW = 0.07;

        //Importance weights default
        var distanceW = 0.25;
        var populationW = 0.25;
        var timeW = 0.25;
        var widthW = 0.25;

        //sliders
        //npm install d3-simple-slider
        d3.select('#sliderContainer')
        .select('svg')
        .remove();
        d3.select('#sliderValues')
        .select('g')
        .remove();

        var slider = d3Slider.sliderBottom()
                            .min(0)
                            .max(1)
                            .width(180)
                            .ticks(5)
                            // .step(0.1) //remove this if you dont want steps
                            .default(0.33)
                            .on('onchange', function(val) {
                                sliderValue.text(d3.format('.2')(val));
                                // widthSlider(val);
                                // widthRW = this.value();
                                // console.log('widthRW is: ' + widthRW);
                            });

        var sliderValue = d3.select('#sliderValues')
                            .append('g')
                            .append('text')

        //display default
        // sliderValue.text(d3.format('.2')(slider.value()));

        // CHANGE: COME BACK AND FINISH THIS YOURE SO CLOSE
        // function widthSlider(input) {
        //     widthRW = input;
        //     newGeoData.forEach(function(i) {
        //         i['widthRW'] = widthRW;
        //     })
        //     console.log(newGeoData);
        // }

        d3.select('#sliderContainer')
            .append('svg')
            .attr('width', 500)
            .attr('height', 80)
            .append('g')
            .attr('transform', 'translate(30,30)')
            .call(slider);


        //insert importance and condition values in data
        newGeoData.forEach(function(i) {
            //Condition
            const RW = i['width_rating'];
            const RP = i['pci_rating'];
            const RC = i['curb_rating'];
            const RS = i['sidewalk_rating'];
            const condition = RW * widthRW + RP * pciRW + RC * curbRW + RS * sidewalkRW;
            i['condition'] = condition;
            //Importance
            const CD = i['centrality_distance'];
            const CT = i['centrality_time'];
            const CW = i['centrality_width'];
            const CP = i['centrality_population'];
            const importance = CD * distanceW + CT * timeW + CW * widthW + CP * populationW;
            i['importance'] = importance;
        })
        console.log(newGeoData);  
        
        
        //draw chart
        //wipe off old chart before plotting new chart with new data
        d3.select('#container')
        .select('svg')
        .remove();
        d3.select('#container')
        .select('button')
        .remove();

        d3.select('#container')
        .append('button')
        .attr('id', 'resetButton')
        .text('Reset Zoom')
        .on('click', function() {
            d3.select('#container')
            .select('svg')
            .call(zoom.transform, d3.zoomIdentity.scale(1));
        });

        //responsive graph (fix refreshing to resize issue)
        const margin = {top: 20, right: 20, bottom: 30, left: 40};

        var default_w = 750 - margin.left - margin.right;
        var default_h = 550 - margin.top - margin.bottom;
        var default_ratio = default_w / default_h;

        var current_w = window.innerWidth;
        var current_h = window.innerHeight;
        var current_ratio = current_w / current_h;

        var height;
        var width;

        if(current_ratio > default_ratio) {
            height = default_h;
            width = default_w;
        } // mobile
        else {
            margin.left = 40;
            width = current_w - 40;
            height = width / default_ratio;
        }

        var w = width - 50 - margin.right;
        var h = height - margin.top - margin.bottom;


        var svg = d3.select('#container')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('overflow', 'visible')
                .attr('margin-top', '100px')
                .attr('style', 'outline: thin solid lightgrey'); //border
    
        //set up scaling
        var xScale = d3.scaleLinear()
        .domain([0, 1.0]) //CHANGE range of x axis
        .range([0, w]);
        var yScale = d3.scaleLog() //CHANGE based on data
        .domain([1e-10, 1]) //CHANGE range of y axis
        .range([h, 0]);

        //set up axis
        var xAxis = svg.append('g')
                    .attr('transform',`translate(0, ${h})`)
                    .attr('class', 'axis')
                    .call(d3.axisBottom(xScale).ticks(5)); //CHANGE ticks frequency

        var yAxis = svg.append('g')
                    .attr('class', 'axis')
                    .call(d3.axisLeft(yScale).ticks(5)); //CHANGE ticks frequency

        // set up axis labeling
        svg.append('text')
        .attr('class', 'label')
        .attr('x', w/2 - 30)
        .attr('y', h + 50)
        .text('Condition'); //CHANGE labeling
        svg.append('text')
        .attr('class', 'label')
        .attr('y', h/2)
        .attr('x', -120)
        .text('Importance'); //CHANGE labeling

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", w )
        .attr("height", h )
        .attr("x", 0)
        .attr("y", 0);

        // Create the scatter variable: where both the circles and the brush take place
        var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)");

        //tooltip
        var tooltip = d3.select('#container').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

        //set up svg data
        var myScatter = scatter.selectAll()
        .data(newGeoData)
        .enter()
        .append('circle')
        .attr('cx', function(d) {
            return xScale(d.condition); //CHANGE x axis data
        })
        .attr('cy', function(d) {
            return yScale(d.importance);//CHANGE y axis data
        })
        .attr('r', 6)
        .attr('class', 'non_brushed')
        //expand points upon hover
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr("r", 7);
            //make div appear
            tooltip.transition()
                .duration(100)
                .style('opacity', 1);
            //CHANGE tooltip fields
            tooltip.html("Street Name: " + d.ST_NAME + " " +
                        "Condition: " + Math.round(d.condition * 1e4) / 1e4 + " " + 
                        "Importance: " + Math.round(d.importance * 1e4) / 1e4)
                .style("left", (d3.event.pageX + 15) + "px") //adjust these numbers for tooltip location
                .style("top", (d3.event.pageY - 15) + "px");
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                    .duration('200')
                    .attr("r", 5);
            //make div disappear
            tooltip.transition()
                .duration('200')
                .style('opacity', 0);
        });

        //BRUSH FEATURE VERSION 2
        function highlightBrushedCircles() {
            if (d3.event.selection != null) {
                // revert circles to initial style
                myScatter.attr("class", "non_brushed");
                var brush_coords = d3.brushSelection(this);

                // style brushed circles
                myScatter.filter(function (){
                            var cx = d3.select(this).attr("cx"),
                                cy = d3.select(this).attr("cy");
                            return isBrushed(brush_coords, cx, cy);
                        })
                        .attr("class", "brushed");
            }
        }

        function isBrushed(brushBox, cx, cy)
        {
            var x0 = brushBox[0][0],
            x1 = brushBox[1][0],
            y0 = brushBox[0][1],
            y1 = brushBox[1][1];
            
            if(x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1)
            {
                return true;
            }
            else{
                return false;
            }
        }

        var selected_region = [];

        function displayTable() {
            // disregard brushes w/o selections  
            if (!d3.event.selection) return;

            // this makes the brush box go away after selection
            d3.select(this).call(brush.move, null);

            var d_brushed = [];
            //THIS LINE
            d3.selectAll(".brushed").data()
            .filter(function(d) {
                d_brushed.push(d.ST_NAME);
                d_brushed.push('PCI is ' + d.pci); //CHANGE what part of data to print
            });
            console.log(d_brushed);

            // console.log('inside: ' + selected_region + 'length: ' + selected_region.length);
            if (d_brushed.length > 0) {
                //clear all displayed selected dots
                selected_region = [];
                //for each brushed dot, add into display array
                d_brushed.forEach(i => selected_region.push(i));
                d3.select('#selected_regions_title').select('text').remove();
                d3.select('#selected_regions_title')
                .append('text')
                .attr('x', 600)
                .attr('y', h - 80)
                .html(selected_region.join(', '));
            } else {
                //clear all displayed selected dots
                selected_region = [];
                d3.select('#selected_regions_title').select('text').remove();
            }
            // d3.select('#selected_regions_title').append('text').html(selected_region.join(', '));
        }

        var brush = d3.brush()
        .on("brush", highlightBrushedCircles)
        .on("end", displayTable); 

        svg.append("g")
        .call(brush);

        function makeSelectedSection() {
            const section = d3.select('#container')
                .select('svg')
                .append('g')
                .attr('id', 'selected_regions_title')
                .append('text')
                .style('fill', 'lightgrey')
                .attr('x', 600)
                .attr('y', h - 100)
                .html('Brush to select:');
        }

        makeSelectedSection();

        //ZOOM FEATURE
        var zoom = d3.zoom().filter(() => !d3.event.button)
        .scaleExtent([0.5, 20]) //unzoom x0.5, zoom x20
        .extent([[0, 0], [w, h]])
        .on('zoom', handleZoom);


        // invisible rect
        // you can only zoom and pan inside this rectangle
        // FIX: but this takes away the tool tip
        // svg.append('rect')
        // .attr('width', w)
        // .attr('height', h)
        // .style('fill', 'none')
        // .style('pointer-events', 'all')
        // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        // .call(zoom);
 
        var svgZoom = d3.select('#container').select('svg').call(zoom);  //initiate zoom
        svgZoom.call(zoom.transform, d3.zoomIdentity.scale(1));

        function handleZoom() {
            var xScaleNew = d3.event.transform.rescaleX(xScale);
            var yScaleNew = d3.event.transform.rescaleY(yScale);

            xAxis.call(d3.axisBottom(xScaleNew));
            yAxis.call(d3.axisLeft(yScaleNew));
            
            scatter.selectAll('circle')
                    .attr('cx', function(d) {return xScaleNew(d.condition)}) //CHANGE BASED ON XAXIS
                    .attr('cy', function(d) {return yScaleNew(d.importance)}); //CHANGE BASED ON YAXIS
        }

    })


    
    //draw grid lines if you want

    return (
        <div bigContainer>
            <div id='sliderFamily'>
                <div id='sliderContainer'/>
                <div id='sliderValues'/>
            </div>
            <div id='container'>
            </div>
        </div>
    );

}



export default Chart;
