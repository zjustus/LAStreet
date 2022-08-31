import './chart.css';
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
import * as d3Slider from 'd3-simple-slider';
import Select, {components} from "react-select";
import { LayerGroup, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as d3Geo from "d3-geo";
import './streetmap.css';
import { brush, svg } from 'd3';
// import { Dropdown } from './dropdown';

var get_brushed_streets = [];

function Chart() {


    function getGeoData(url) {
        return fetch(url)
            .then(function(response) {
                return response.json();
            });
    }

    function MyMap() {

        const streetMap = useMap();
        console.log('map center: ', streetMap.getCenter());

        getGeoData('/hillside_inventory_LA_centrality_full.geojson')
        .then(function(data) {
            const testsvg = d3.select(streetMap.getPanes().overlayPane).append('svg');
            const g = testsvg.append('g').attr('class', 'leaflet-zoom-hide');
    
            var transform = d3.geoTransform({point: projectPoint});
            var path = d3.geoPath().projection(transform);
    
            // streetMap.on('click', function(e) {
            //     var latlng = e.latlng;
            //     var layerpoint = e.layerPoint;
            //     var pixelPosition = streetMap.latLngToLayerPoint(latlng);
            //     alert(latlng + " " + layerpoint + " " + pixelPosition);
            // })
    
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


                // const geoShape = {
        //     "type": "FeatureCollection",
        //     "features": [
        //       {
        //         "type": "Feature",
        //         "geometry": {
        //           "type": "Polygon",
        //           "coordinates": [
        //             [
        //                 [
        //                   -118.4552,
        //                   34.07516
        //                 ],
        //                 [
        //                   -118.45484733581542,
        //                   34.070471286884505
        //                 ],
        //                 [
        //                   -118.4525728225708,
        //                   34.07057793348581
        //                 ],
        //                 [
        //                   -118.44746589660645,
        //                   34.06670302079997
        //                 ],
        //                 [
        //                   -118.44823837280273,
        //                   34.06375228036416
        //                 ],
        //                 [
        //                   -118.44167232513428,
        //                   34.064036693555465
        //                 ],
        //                 [
        //                   -118.43922615051268,
        //                   34.06755622779842
        //                 ],
        //                 [
        //                   -118.43866825103761,
        //                   34.07057793348581
        //                 ],
        //                 [
        //                   -118.43729496002196,
        //                   34.072426453244354
        //                 ],
        //                 [
        //                   -118.43883991241455,
        //                   34.07576790583159
        //                 ],
        //                 [
        //                   -118.43944072723389,
        //                   34.078291681576104
        //                 ],
        //                 [
        //                   -118.44403266906738,
        //                   34.07676320665508
        //                 ],
        //                 [
        //                   -118.44514846801756,
        //                   34.07356398381666
        //                 ],
        //                 [
        //                   -118.44918251037599,
        //                   34.073599531400916
        //                 ],
        //                 [
        //                   -118.45038414001463,
        //                   34.075661265763955
        //                 ],
        //                 [
        //                   -118.45386028289795,
        //                   34.0770120300335
        //                 ],
        //                 [
        //                   -118.45544815063477,
        //                   34.07569681246808
        //                 ]
        //               ]
        //           ]
        //         }
        //       }
        //     ]
        //   }
    }
    // const streetMap = useMap();

    getGeoData('/hillside_inventory_LA_centrality_full.geojson')
    .then(function(data) {

        data.features.forEach(function(feature) {
            //width rating = actual width / designation width
            var width_ratio = feature.properties['width_ratio'];
            var width_rating;
            if(width_ratio > 1) {
                width_rating = 1.0;
            }
            else if(width_ratio < 0.5) {
                width_rating = 0.1;
            }
            else {
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
            if(sidewalk_ratio > 0.19) {
                sidewalk_rating = 1;
            }
            else if(sidewalk_ratio < 0) {
                sidewalk_rating = 0.1;
            }
            else {
                sidewalk_rating = 24.931 * sidewalk_ratio ** 2 + 0.1;
            }
            sidewalk_rating = Math.round(sidewalk_rating * 1e4) / 1e4;
            feature.properties['sidewalk_rating'] = sidewalk_rating;

            //curb rating = designated curb points / section length
            var curb_ratio = feature.properties['curb_ratio'];
            var curb_rating;
            if(curb_ratio > 0.25) {
                curb_rating = 1;
            }
            else if(curb_ratio < 0) {
                curb_rating = 0.1;
            }
            else {
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

        //updatedGeoData contains properties and geometry array with the new rating calculations
        console.log(updatedGeoData);


        //new approach using only one array
        //Condition: widthRW, pciRW, curbRW, sidewalkRW
        //Importance: distanceW, populationW, timeW, widthW
        var sliderInputArray = {'widthRW': 0.33,'pciRW': 0.33,'curbRW': 0.26,'sidewalkRW': 0.07,
                            'distanceW': 0.25,'populationW': 0.25,'timeW': 0.25,'widthW': 0.25};


        //function to insert and update importance and condition values in data
        function importanceCondition (sliderInputArray) {
            newGeoData.forEach(function(i) {
                //Condition
                const RW = i['width_rating'];
                const RP = i['pci_rating'];
                const RC = i['curb_rating'];
                const RS = i['sidewalk_rating'];
                const condition = RW * sliderInputArray['widthRW'] + RP * sliderInputArray['pciRW'] + RC * sliderInputArray['curbRW'] + RS * sliderInputArray['sidewalkRW'];
                i['condition'] = condition;
                //Importance
                const CD = i['centrality_distance'];
                const CT = i['centrality_time'];
                const CW = i['centrality_width'];
                const CP = i['centrality_population'];
                const importance = CD * sliderInputArray['distanceW'] + CT * sliderInputArray['timeW'] + CW * sliderInputArray['widthW'] + CP * sliderInputArray['populationW'];
                i['importance'] = importance;            
                })
            return newGeoData;
        }
        importanceCondition(sliderInputArray);

        //newGeoData now contains a condition and importance field
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
                .attr('style', 'outline: thin solid lightgrey'); //border
    
        //set up scaling
        var xScale = d3.scaleLinear()
        .domain([0, 1]) //CHANGE range of x axis
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
        .attr("clip-path", "url(#clip)")
        .attr('id', 'scatter');


        //tooltip
        var tooltip = d3.select('#container').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

        //set up default svg data
        var myScatter = scatter.selectAll()
        .data(newGeoData)
        .enter()
        .append('circle')
        .attr('id', 'dots')
        .attr('cx', function(d) {
            return xScale(d.condition); //CHANGE x axis data
        })
        .attr('cy', function(d) {
            return yScale(d.importance); //CHANGE y axis data
        })
        .attr('r', 5)
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

        //testing d3 dropdown
        d3.select('#multiselect1').select('#selectBox1').remove();
        d3.select('#multiselect2').select('#selectBox2').remove();
        d3.select('#multiselect3').select('#selectBox3').remove();
        d3.select('#multiselect4').select('#selectBox4').remove();
        d3.select('#multiselect5').select('#selectBox5').remove();
        d3.select('#multiselect6').select('#selectBox6').remove();

        // var communityDropdown = d3.select('#filterFamily').append('select').attr('id', 'communityDropdown')
        // .attr('multiple', 'true');

        // communityDropdown
        //     .selectAll()
        //     .data(communityOptions)
        //     .enter()
        //     .append('option')
        //     .text(function(d) {return d.label;})
        //     .attr('value', function(d) {return d.value;})

        //Old version
        //Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.
        // IF ONLY I KNOW HOW TO USE THIS ARRAY INSTEAD OF IMPLEMENTING IT MANUALLY
        var communityOptions = [{ value: 'nondisadvantage', label: 'Non disadvantage Community' },
                                { value: 'disadvantage', label: 'Disadvantage Community' },
                                { value: 'lowincome', label: 'Low Income' }];

        //Current version
        //check boxes in dropdown menu
        var expanded = false;

        function showCheckboxes(inputCheckboxes) {
            
            var checkboxes = document.getElementById(inputCheckboxes);
            if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
            } else {
            checkboxes.style.display = "none";
            expanded = false;
            }
        }

        //Community dropdown
        var selectBox = d3.select('#multiselect1').append('div').attr('id', 'selectBox1')
                            .on('click',function() {showCheckboxes('checkboxes1');} );
        var communityDropdown = d3.select('#selectBox1').append('select');
        communityDropdown.append('option').text('Select community...');
        var overSelect = d3.select('#selectBox1').append('div').attr('id', 'overSelect');
        var checkBoxes1 = d3.select('#multiselect1').append('div').attr('id', 'checkboxes1');

        //HELP IDK WHY THIS DOESNT WORK SO I HAVE TO DO IT MANUALLY UGH
        // checkBoxes.selectAll('label')
        //     .data(communityOptions)
        //     .enter()
        //     .append('label')
        //     .attr('for', function(d) {return d.value;});

        checkBoxes1.append('label').text('Non disadvantage Community ').append('input').attr('type', 'checkbox').attr('value', 'nondisadvantage');
        checkBoxes1.append('label').text('Disadvantage Community ').append('input').attr('type', 'checkbox').attr('value', 'disadvantage');
        checkBoxes1.append('label').text('Low Income ').append('input').attr('type', 'checkbox').attr('value', 'lowincome');

        checkBoxes1.on('change', function(d) {
            communityDropdown.style('background-color', '#C6ECFF');
            var values = [];
            d3.selectAll('input[type=checkbox]:checked')
            .each(function() {values.push(this.value)});
            console.log(values);

            //get filtered data
            var filteredData = getFilteredData(newGeoData, userSelectedDesignation, userSelectedLocation, values, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            updateChart(filteredData, false);
        })

        //Withdrawn dropdown
        var selectBox = d3.select('#multiselect2').append('div').attr('id', 'selectBox2')
        .on('click',function() {showCheckboxes('checkboxes2');} );
        var withdrawnDropdown = d3.select('#selectBox2').append('select');
        withdrawnDropdown.append('option').text('Select withdrawn...');
        var overSelect = d3.select('#selectBox2').append('div').attr('id', 'overSelect');
        var checkBoxes2 = d3.select('#multiselect2').append('div').attr('id', 'checkboxes2');

        checkBoxes2.append('label').text('Withdrawn ').append('input').attr('type', 'checkbox').attr('value', 'withdrawn');
        checkBoxes2.append('label').text('Not Withdrawn').append('input').attr('type', 'checkbox').attr('value', 'notwithdrawn');

        checkBoxes2.on('change', function(d) {
            withdrawnDropdown.style('background-color', '#C6ECFF');
            var values = [];
            d3.selectAll('input[type=checkbox]:checked')
            .each(function() {values.push(this.value)});
            console.log(values);

            //get filtered data
            var filteredData = getFilteredData(newGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, values, userSelectedMaintain);
            updateChart(filteredData, false);
        })

        //Maintain dropdown
        var selectBox = d3.select('#multiselect3').append('div').attr('id', 'selectBox3')
        .on('click',function() {showCheckboxes('checkboxes3');} );
        var maintainDropdown = d3.select('#selectBox3').append('select');
        maintainDropdown.append('option').text('Select maintain...');
        var overSelect = d3.select('#selectBox3').append('div').attr('id', 'overSelect');
        var checkBoxes3 = d3.select('#multiselect3').append('div').attr('id', 'checkboxes3');

        checkBoxes3.append('label').text('Maintained ').append('input').attr('type', 'checkbox').attr('value', 'maintain');
        checkBoxes3.append('label').text('Not Maintained').append('input').attr('type', 'checkbox').attr('value', 'notmaintain');

        checkBoxes3.on('change', function(d) {
            maintainDropdown.style('background-color', '#C6ECFF');
            var values = [];
            d3.selectAll('input[type=checkbox]:checked')
            .each(function() {values.push(this.value)});
            console.log(values);

            //get filtered data
            var filteredData = getFilteredData(newGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, values);
            updateChart(filteredData, false);
        })

        //Location dropdown
        var selectBox = d3.select('#multiselect4').append('div').attr('id', 'selectBox4')
        .on('click',function() {showCheckboxes('checkboxes4');} );
        var locationDropdown = d3.select('#selectBox4').append('select');
        locationDropdown.append('option').text('Select Location...');
        var overSelect = d3.select('#selectBox4').append('div').attr('id', 'overSelect');
        var checkBoxes4 = d3.select('#multiselect4').append('div').attr('id', 'checkboxes4');

        checkBoxes4.append('label').text('North Los Angeles ').append('input').attr('type', 'checkbox').attr('value', 'northla');
        checkBoxes4.append('label').text('Central Los Angeles ').append('input').attr('type', 'checkbox').attr('value', 'centralla');
        checkBoxes4.append('label').text('South Los Angeles ').append('input').attr('type', 'checkbox').attr('value', 'southla');

        checkBoxes4.on('change', function(d) {
            locationDropdown.style('background-color', '#C6ECFF');
            var values = [];
            d3.selectAll('input[type=checkbox]:checked')
            .each(function() {values.push(this.value)});
            console.log(values);

            //get filtered data
            var filteredData = getFilteredData(newGeoData, userSelectedDesignation, values, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            updateChart(filteredData, false);
        })

        //Council District dropdown
        var selectBox = d3.select('#multiselect5').append('div').attr('id', 'selectBox5')
        .on('click',function() {showCheckboxes('checkboxes5');} );
        var councilDropdown = d3.select('#selectBox5').append('select');
        councilDropdown.append('option').text('Select Council District...');
        var overSelect = d3.select('#selectBox5').append('div').attr('id', 'overSelect');
        var checkBoxes5 = d3.select('#multiselect5').append('div').attr('id', 'checkboxes5');

        checkBoxes5.append('label').text('1 ').append('input').attr('type', 'checkbox').attr('value', '1');
        checkBoxes5.append('label').text('2 ').append('input').attr('type', 'checkbox').attr('value', '2');
        checkBoxes5.append('label').text('3 ').append('input').attr('type', 'checkbox').attr('value', '3');
        checkBoxes5.append('label').text('4 ').append('input').attr('type', 'checkbox').attr('value', '4');
        checkBoxes5.append('label').text('5 ').append('input').attr('type', 'checkbox').attr('value', '5');
        checkBoxes5.append('label').text('6 ').append('input').attr('type', 'checkbox').attr('value', '6');
        checkBoxes5.append('label').text('7 ').append('input').attr('type', 'checkbox').attr('value', '7');
        checkBoxes5.append('label').text('11 ').append('input').attr('type', 'checkbox').attr('value', '11');
        checkBoxes5.append('label').text('12 ').append('input').attr('type', 'checkbox').attr('value', '12');
        checkBoxes5.append('label').text('13 ').append('input').attr('type', 'checkbox').attr('value', '13');
        checkBoxes5.append('label').text('14 ').append('input').attr('type', 'checkbox').attr('value', '14');
        checkBoxes5.append('label').text('15 ').append('input').attr('type', 'checkbox').attr('value', '15');


        checkBoxes5.on('change', function(d) {
            councilDropdown.style('background-color', '#C6ECFF');
            var values = [];
            d3.selectAll('input[type=checkbox]:checked')
            .each(function() {values.push(this.value)});
            console.log(values);

            //get filtered data
            var filteredData = getFilteredData(newGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, values, userSelectedWithdrawn, userSelectedMaintain);
            updateChart(filteredData, false);
        })


        //Designation dropdown
        var selectBox = d3.select('#multiselect6').append('div').attr('id', 'selectBox6')
        .on('click',function() {showCheckboxes('checkboxes6');} );
        var designationDropdown = d3.select('#selectBox6').append('select');
        designationDropdown.append('option').text('Select Designation...');
        var overSelect = d3.select('#selectBox6').append('div').attr('id', 'overSelect');
        var checkBoxes6 = d3.select('#multiselect6').append('div').attr('id', 'checkboxes6');

        checkBoxes6.append('label').text('Avenue I ').append('input').attr('type', 'checkbox').attr('value', 'Avenue I');
        checkBoxes6.append('label').text('Avenue II ').append('input').attr('type', 'checkbox').attr('value', 'Avenue II');
        checkBoxes6.append('label').text('Avenue III ').append('input').attr('type', 'checkbox').attr('value', 'Avenue III');
        checkBoxes6.append('label').text('Boulevard I ').append('input').attr('type', 'checkbox').attr('value', 'Boulevard I');
        checkBoxes6.append('label').text('Boulevard II ').append('input').attr('type', 'checkbox').attr('value', 'Boulevard II');
        checkBoxes6.append('label').text('Collector ').append('input').attr('type', 'checkbox').attr('value', 'Collector');
        checkBoxes6.append('label').text('Hillside Collector ').append('input').attr('type', 'checkbox').attr('value', 'Hillside Collector');
        checkBoxes6.append('label').text('Local Street - Standard ').append('input').attr('type', 'checkbox').attr('value', 'Local Street - Standard');
        checkBoxes6.append('label').text('Modified Avenue I ').append('input').attr('type', 'checkbox').attr('value', 'Modified Avenue I');
        checkBoxes6.append('label').text('Modified Avenue II ').append('input').attr('type', 'checkbox').attr('value', 'Modified Avenue II');
        checkBoxes6.append('label').text('Modified Avenue III ').append('input').attr('type', 'checkbox').attr('value', 'Modified Avenue III');
        checkBoxes6.append('label').text('Modified Boulevard II ').append('input').attr('type', 'checkbox').attr('value', 'Modified Boulevard II');
        checkBoxes6.append('label').text('Modified Collector ').append('input').attr('type', 'checkbox').attr('value', 'Modified Collector');
        checkBoxes6.append('label').text('Modified Local Street Standard ').append('input').attr('type', 'checkbox').attr('value', 'Modified Local Street Standard');
        checkBoxes6.append('label').text('Modified Scenic Arterial Mountain ').append('input').attr('type', 'checkbox').attr('value', 'Modified Scenic Arterial Mountain');
        checkBoxes6.append('label').text('Mountain Collector ').append('input').attr('type', 'checkbox').attr('value', 'Mountain Collector');
        checkBoxes6.append('label').text('Private ').append('input').attr('type', 'checkbox').attr('value', 'Private');
        checkBoxes6.append('label').text('Scenic Parkway ').append('input').attr('type', 'checkbox').attr('value', 'Scenic Parkway');
        checkBoxes6.append('label').text('Unidentified ').append('input').attr('type', 'checkbox').attr('value', 'Unidentified');

        checkBoxes6.on('change', function(d) {
            designationDropdown.style('background-color', '#C6ECFF');
            var values = [];
            d3.selectAll('input[type=checkbox]:checked')
            .each(function() {values.push(this.value)});
            console.log(values);

            //get filtered data
            var filteredData = getFilteredData(newGeoData, values, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            updateChart(filteredData, false);
        })


        function getFilteredData(data, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain) {
            var filteredData = [];
            var designationData = designationFilter(userSelectedDesignation, data);
            var locationData = locationFilter(userSelectedLocation, data);
            var communityData = communityFilter(userSelectedCommunity, data);
            var councilData = councilFilter(userSelectedCouncil, data);
            var withdrawnData = withdrawnFilter(userSelectedWithdrawn, data);
            var maintainData = maintainFilter(userSelectedMaintain, data);
    
            //get the intersection between these arrays
            designationData.forEach (function(i) {
                if(locationData.includes(i) && communityData.includes(i) && councilData.includes(i) && withdrawnData.includes(i) && maintainData.includes(i)) {
                    filteredData.push(i);
                }
            })
            return filteredData;
        }

        // manual dropdown menu
        var userSelectedDesignation = ['Avenue I', 'Avenue II', 'Avenue III', 'Boulevard I', 'Boulevard II', 'Collector', 'Hillside Collector', 'Local Street - Standard', 'Modified Avenue I', 'Modified Avenue II', 'Modified Avenue III', 'Modified Boulevard II', 'Modified Collector', 'Modified Local Street Standard', 'Modified Scenic Arterial Mountain', 'Mountain Collector', 'Private', 'Scenic Parkway', 'Unidentified'];
        var userSelectedLocation = ['northla', 'centralla', 'southla'];
        var userSelectedCommunity = ['lowincome', 'disadvantage', 'nondisadvantage'];
        var userSelectedCouncil = ['1', '2', '3', '4', '5', '6', '7', '11', '12', '13', '14', '15'];
        var userSelectedWithdrawn = ['withdrawn', 'notwithdrawn'];
        var userSelectedMaintain = ['maintain', 'notmaintain'];

        function designationFilter(userSelected, data) {
            var temp = [];
            //if string 'disadvantage' is in the userSelected string array
            if(userSelected.indexOf('Avenue I') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Avenue I') { temp.push(i); }})
            }
            if(userSelected.indexOf('Avenue II') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Avenue II') { temp.push(i); }})
            }
            if(userSelected.indexOf('Avenue III') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Avenue III') { temp.push(i); }})
            }
            if(userSelected.indexOf('Boulevard I') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Boulevard I') { temp.push(i); }})
            }
            if(userSelected.indexOf('Boulevard II') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Boulevard II') { temp.push(i); }})
            }
            if(userSelected.indexOf('Collector') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Collector') { temp.push(i); }})
            }
            if(userSelected.indexOf('Hillside Collector') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Hillside Collector') { temp.push(i); }})
            }
            if(userSelected.indexOf('Local Street - Standard') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Local Street - Standard') { temp.push(i); }})
            }
            if(userSelected.indexOf('Modified Avenue I') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Modified Avenue I') { temp.push(i); }})
            }
            if(userSelected.indexOf('Modified Avenue II') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Modified Avenue II') { temp.push(i); }})
            }
            if(userSelected.indexOf('Modified Avenue III') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Modified Avenue III') { temp.push(i); }})
            }
            if(userSelected.indexOf('Modified Boulevard II') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Modified Boulevard II') { temp.push(i); }})
            }
            if(userSelected.indexOf('Modified Collector') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Modified Collector') { temp.push(i); }})
            }
            if(userSelected.indexOf('Modified Local Street Standard') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Modified Local Street Standard') { temp.push(i); }})
            }
            if(userSelected.indexOf('Modified Scenic Arterial Mountain') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Modified Scenic Arterial Mountain') { temp.push(i); }})
            }
            if(userSelected.indexOf('Mountain Collector') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Mountain Collector') { temp.push(i); }})
            }
            if(userSelected.indexOf('Private') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Private') { temp.push(i); }})
            }
            if(userSelected.indexOf('Scenic Parkway') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Scenic Parkway') { temp.push(i); }})
            }
            if(userSelected.indexOf('Unidentified') > -1) {
                data.forEach(function(i) { if(i['Street_Designation'] == 'Unidentified') { temp.push(i); }})
            }
            return temp;
        }

        //centroid_lat
        function locationFilter(userSelected, data) {
            var temp = [];
            //if string 'disadvantage' is in the userSelected string array
            if(userSelected.indexOf('northla') > -1) {
                data.forEach(function(i) { if(i['centroid_lat'] > 34.1935) { temp.push(i); }})
            }
            if(userSelected.indexOf('centralla') > -1) {
                data.forEach(function(i) { if(i['centroid_lat'] > 33.911 && i['centroid_lat'] < 34.1935) { temp.push(i); }})
            }
            if(userSelected.indexOf('southla') > -1) {
                data.forEach(function(i) { if(i['centroid_lat'] < 33.911) { temp.push(i); }})
            }
            return temp;
        }

        //communityFilter returns data after filtering userSelected communities
        function communityFilter(userSelected, data) {
            var temp = [];
            //if string 'disadvantage' is in the userSelected string array
            if(userSelected.indexOf('disadvantage') > -1) {
                data.forEach(function(i) { if(i['DAC'] == 1) { temp.push(i); }})
            }
            if(userSelected.indexOf('nondisadvantage') > -1) {
                data.forEach(function(i) { if(i['DAC'] == 0) { temp.push(i); }})
            }
            if(userSelected.indexOf('lowincome') > -1) {
                data.forEach(function(i) { if(i['lowincome'] == 1) { temp.push(i); }})
            }
            return temp;
        }

        function councilFilter(userSelected, data) {
            var temp = [];
            if(userSelected.indexOf('1') > -1) {
                data.forEach(function(i) { if(i['CD'] == 1) { temp.push(i); }})
            }
            if(userSelected.indexOf('2') > -1) {
                data.forEach(function(i) { if(i['CD'] == 2) { temp.push(i); }})
            }
            if(userSelected.indexOf('3') > -1) {
                data.forEach(function(i) { if(i['CD'] == 3) { temp.push(i); }})
            }
            if(userSelected.indexOf('4') > -1) {
                data.forEach(function(i) { if(i['CD'] == 4) { temp.push(i); }})
            }
            if(userSelected.indexOf('5') > -1) {
                data.forEach(function(i) { if(i['CD'] == 5) { temp.push(i); }})
            }
            if(userSelected.indexOf('6') > -1) {
                data.forEach(function(i) { if(i['CD'] == 6) { temp.push(i); }})
            }
            if(userSelected.indexOf('7') > -1) {
                data.forEach(function(i) { if(i['CD'] == 7) { temp.push(i); }})
            }
            if(userSelected.indexOf('11') > -1) {
                data.forEach(function(i) { if(i['CD'] == 11) { temp.push(i); }})
            }
            if(userSelected.indexOf('12') > -1) {
                data.forEach(function(i) { if(i['CD'] == 12) { temp.push(i); }})
            }
            if(userSelected.indexOf('13') > -1) {
                data.forEach(function(i) { if(i['CD'] == 13) { temp.push(i); }})
            }
            if(userSelected.indexOf('14') > -1) {
                data.forEach(function(i) { if(i['CD'] == 14) { temp.push(i); }})
            }
            if(userSelected.indexOf('15') > -1) {
                data.forEach(function(i) { if(i['CD'] == 15) { temp.push(i); }})
            }
            return temp;
        }

        function withdrawnFilter(userSelected, data) {
            var temp = [];
            if(userSelected.indexOf('withdrawn') > -1) {
                data.forEach(function(i) { if(i['withdrawn'] == 1) { temp.push(i); }})
            }
            if(userSelected.indexOf('notwithdrawn') > -1) {
                data.forEach(function(i) { if(i['withdrawn'] == 0) { temp.push(i); }})
            }
            return temp;
        }

        function maintainFilter(userSelected, data) {
            var temp = [];
            if(userSelected.indexOf('maintain') > -1) {
                data.forEach(function(i) { if(i['Not_maintained'] == 0) { temp.push(i); }})
            }
            if(userSelected.indexOf('notmaintain') > -1) {
                data.forEach(function(i) { if(i['Not_maintained'] == 1) { temp.push(i); }})
            }
            return temp;
        }
 
        var filteredData = [];

        var designationData = designationFilter(userSelectedDesignation, newGeoData);
        var locationData = locationFilter(userSelectedLocation, newGeoData);
        var communityData = communityFilter(userSelectedCommunity, newGeoData);
        var councilData = councilFilter(userSelectedCouncil, newGeoData);
        var withdrawnData = withdrawnFilter(userSelectedWithdrawn, newGeoData);
        var maintainData = maintainFilter(userSelectedMaintain, newGeoData);

        //get the intersection between these arrays
        designationData.forEach (function(i) {
            if(locationData.includes(i) && communityData.includes(i) && councilData.includes(i) && withdrawnData.includes(i) && maintainData.includes(i)) {
                filteredData.push(i);
            }
        })

        // d3.select('#container').selectAll('[id="dots"]').remove();
        // d3.select('#container').select('[id="scatter"]').selectAll('circle')
        // .data(filteredData).enter().append('circle').attr('id', 'dots')
        // .attr('cx', function(d) {
        //     return xScale(d.condition); //CHANGE x axis data
        // })
        // .attr('cy', function(d) {
        //     return yScale(d.importance);//CHANGE y axis data
        // })
        // .attr('r', 5)
        // .attr('class', 'non_brushed')

        //sliders
        //npm install d3-simple-slider
        d3.select('#sliderContainer1').select('svg').remove();
        d3.select('#sliderContainer2').select('svg').remove();
        d3.select('#sliderContainer3').select('svg').remove();
        d3.select('#sliderContainer4').select('svg').remove();
        d3.select('#sliderContainer5').select('svg').remove();
        d3.select('#sliderContainer6').select('svg').remove();
        d3.select('#sliderContainer7').select('svg').remove();
        d3.select('#sliderContainer8').select('svg').remove();
        d3.select('#sliderValueOne').select('g').remove();
        d3.select('#sliderValueTwo').select('g').remove();
        d3.select('#sliderValueThree').select('g').remove();
        d3.select('#sliderValueFour').select('g').remove();
        d3.select('#sliderValueFive').select('g').remove();
        d3.select('#sliderValueSix').select('g').remove();
        d3.select('#sliderValueSeven').select('g').remove();
        d3.select('#sliderValueEight').select('g').remove();

        function updateChart(data, turnOnAllowBrush) {
            //clean chart
            d3.select('#container').selectAll('[id="dots"]').remove();
            //update chart
            d3.select('#container')
            .select('[id="scatter"]')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('id', 'dots')
            .attr('cx', function(d) {
                return xScale(d.condition); //CHANGE x axis data
            })
            .attr('cy', function(d) {
                return yScale(d.importance);//CHANGE y axis data
            })
            .attr('r', 5)
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

            if(turnOnAllowBrush == true) {
                allowBrush();
            }
            else {

            }
        }

        // function getFilteredData(data) {
        //     var filteredData = [];
        //     var designationData = designationFilter(userSelectedDesignation, data);
        //     var locationData = locationFilter(userSelectedLocation, data);
        //     var communityData = communityFilter(userSelectedCommunity, data);
        //     var councilData = councilFilter(userSelectedCouncil, data);
        //     var withdrawnData = withdrawnFilter(userSelectedWithdrawn, data);
        //     var maintainData = maintainFilter(userSelectedMaintain, data);
    
        //     //get the intersection between these arrays
        //     designationData.forEach (function(i) {
        //         if(locationData.includes(i) && communityData.includes(i) && councilData.includes(i) && withdrawnData.includes(i) && maintainData.includes(i)) {
        //             filteredData.push(i);
        //         }
        //     })
        //     return filteredData;
        // }
    
        var slider1 = d3Slider.sliderBottom()
                    .min(0).max(1).width(100).ticks(5).default(0.33)
                 // .step(0.1) //remove this if you dont want steps
                    .on('onchange', function(val) {
                        sliderValue1.text(d3.format('.2')(val));
                        sliderInputArray['widthRW'] = val;
                        svg.selectAll('[id="dots"]').remove();

                        //update data
                        console.log(sliderInputArray);
                        var newnewGeoData = importanceCondition(sliderInputArray);
                        //get filtered data
                        var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
                        //update chart
                        updateChart(filteredData, true);
                    });

        var slider2 = d3Slider.sliderBottom()
                    .min(0).max(1).width(100).ticks(5).default(0.33)
                    .on('onchange', function(val) {
                        sliderValue2.text(d3.format('.2')(val));
                        sliderInputArray['pciRW'] = val;
                        svg.selectAll('[id="dots"]').remove();

                        //update data
                        console.log(sliderInputArray);
                        var newnewGeoData = importanceCondition(sliderInputArray);
                        //get filtered data
                        var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
                        //update chart
                        updateChart(filteredData, true);
                    });

        var slider3 = d3Slider.sliderBottom()
        .min(0).max(1).width(100).ticks(5).default(0.26)
        .on('onchange', function(val) {
            sliderValue3.text(d3.format('.2')(val));
            sliderInputArray['curbRW'] = val;
            svg.selectAll('[id="dots"]').remove();

            //update data
            console.log(sliderInputArray);
            var newnewGeoData = importanceCondition(sliderInputArray);
            //get filtered data
            var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            //update chart
            updateChart(filteredData, true);
        });
        
        var slider4 = d3Slider.sliderBottom()
        .min(0).max(1).width(100).ticks(5).default(0.07)
        .on('onchange', function(val) {
            sliderValue4.text(d3.format('.2')(val));
            sliderInputArray['sidewalkRW'] = val;
            svg.selectAll('[id="dots"]').remove();

            //update data
            console.log(sliderInputArray);
            var newnewGeoData = importanceCondition(sliderInputArray);
            //get filtered data
            var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            //update chart
            updateChart(filteredData, true);
        });
        
        var slider5 = d3Slider.sliderBottom()
        .min(0).max(1).width(100).ticks(5).default(0.25)
        .on('onchange', function(val) {
            sliderValue5.text(d3.format('.2')(val));
            sliderInputArray['distanceW'] = val;
            svg.selectAll('[id="dots"]').remove();

            //update data
            console.log(sliderInputArray);
            var newnewGeoData = importanceCondition(sliderInputArray);
            //get filtered data
            var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            //update chart
            updateChart(filteredData, true);
        });

        var slider6 = d3Slider.sliderBottom()
        .min(0).max(1).width(100).ticks(5).default(0.25)
        .on('onchange', function(val) {
            sliderValue6.text(d3.format('.2')(val));
            sliderInputArray['timeW'] = val;
            svg.selectAll('[id="dots"]').remove();

            //update data
            console.log(sliderInputArray);
            var newnewGeoData = importanceCondition(sliderInputArray);
            //get filtered data
            var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            //update chart
            updateChart(filteredData, true);
        });

        var slider7 = d3Slider.sliderBottom()
        .min(0).max(1).width(100).ticks(5).default(0.25)
        .on('onchange', function(val) {
            sliderValue7.text(d3.format('.2')(val));
            sliderInputArray['widthW'] = val;
            svg.selectAll('[id="dots"]').remove();

            //update data
            console.log(sliderInputArray);
            var newnewGeoData = importanceCondition(sliderInputArray);
            //get filtered data
            var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            //update chart
            updateChart(filteredData, true);
        });

        var slider8 = d3Slider.sliderBottom()
        .min(0).max(1).width(100).ticks(5).default(0.25)
        .on('onchange', function(val) {
            sliderValue8.text(d3.format('.2')(val));
            sliderInputArray['populationW'] = val;
            svg.selectAll('[id="dots"]').remove();

            //update data
            console.log(sliderInputArray);
            var newnewGeoData = importanceCondition(sliderInputArray);
            //get filtered data
            var filteredData = getFilteredData(newnewGeoData, userSelectedDesignation, userSelectedLocation, userSelectedCommunity, userSelectedCouncil, userSelectedWithdrawn, userSelectedMaintain);
            //update chart
            updateChart(filteredData, true);
        });

        var sliderValue1 = d3.select('#sliderValueOne').append('g').append('text');
        var sliderValue2 = d3.select('#sliderValueTwo').append('g').append('text');
        var sliderValue3 = d3.select('#sliderValueThree').append('g').append('text');
        var sliderValue4 = d3.select('#sliderValueFour').append('g').append('text');
        var sliderValue5 = d3.select('#sliderValueFive').append('g').append('text');
        var sliderValue6 = d3.select('#sliderValueSix').append('g').append('text');
        var sliderValue7 = d3.select('#sliderValueSeven').append('g').append('text');
        var sliderValue8 = d3.select('#sliderValueEight').append('g').append('text');

        d3.select('#sliderContainer1').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider1);
        d3.select('#sliderContainer2').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider2);
        d3.select('#sliderContainer3').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider3);
        d3.select('#sliderContainer4').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider4);
        d3.select('#sliderContainer5').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider5);
        d3.select('#sliderContainer6').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider6);
        d3.select('#sliderContainer7').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider7);
        d3.select('#sliderContainer8').append('svg').attr('width', 150).attr('height', 80).append('g').attr('transform', 'translate(30,30)').call(slider8);

        //BRUSH FEATURE
        function highlightBrushedCircles() {
            if (d3.event.selection != null) {
                // revert circles to initial style
                var dots = d3.select('#container').selectAll('[id="dots"]');

                dots.attr("class", "non_brushed");
                var brush_coords = d3.brushSelection(this);

                // style brushed circles
                dots.filter(function (){
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
            //THIS LINE
            d3.selectAll(".brushed").data()
            .filter(function(d) {
                coorArray.push(d.OBJECTID);
                d_brushed.push(d.ST_NAME);
                d_brushed.push('ID: ' + d.OBJECTID); //CHANGE what part of data to print
            });
            console.log(d_brushed);

            var geometryArray = [];
            coorArray.forEach(function(i) {
                const streetIDS = data.features.map(function(i) {
                    return {'OBJECTID': i.properties.OBJECTID,
                            'geometry':  i.geometry};
                })
                streetIDS.forEach(function(streetid) {
                    if(streetid.OBJECTID === i){
                        var temp = {'OBJECTID': streetid.OBJECTID,
                                    'geometry': streetid.geometry};
                        geometryArray.push(temp);
                    }
                })
            })

            var mapW = 600; //CHANGE this if you change the map container size in map.js
            var mapH = 700;
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
                geometryArray.forEach(i => brushed_streets2.push(i.geometry));
                //clear out previous selected streets
                d3.select('#mapContainer').select('[id="selected_streets"]')
                .remove();
                //clear out previous selected streets in leaflet
                d3.selectAll("path[class*='street']").style('stroke', 'none');

                console.log(brushed_streets);
                d3.select('#mapContainer')
                .select('svg')
                .append('g')
                .attr('id', 'selected_streets')
                .selectAll("path")
                .data(brushed_streets2)
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

                brushed_streets.forEach(function(i) {
                    console.log(i.OBJECTID);
                    var id = ".street" + i.OBJECTID;
                    d3.select(id).style('stroke', 'blue')
                            .attr("fill", "none")
                            .style('stroke-width', '20px')
                            .style("stroke-opacity", 0.7);
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
                d_brushed.forEach(i => selected_region.push(i));
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

        // var brush = d3.brush()
        // .on("brush", highlightBrushedCircles)
        // .on("end", displayTable); 

        // svg.append("g").attr('id', 'brushrect')
        // .call(brush);


        var brush = d3.brush()
        .on("brush", highlightBrushedCircles)
        .on("end", DisplayTable); 

        function allowBrush(activate) {
            if(activate == true) {
                svg.append("g").attr('id', 'brushrect')
                .call(brush);
            }
            else {
                d3.select('#brushrect').remove();
            }
        }

        var clicked = false;
        d3.select('#switchModeButton')
        .on('click', function(d) {
            if (!clicked) {
                d3.select('#switchModeButton').text('Brush mode');
                allowBrush(true);
                clicked = true;
            } else {
                d3.select('#switchModeButton').text('Tooltip mode');
                clicked = false;
                allowBrush(false);
            }
        })
        // allowBrush();

        function makeSelectedSection() {
            const section = d3.select('#container')
                .select('svg')
                .append('g')
                .attr('id', 'selected_regions_title')
                .append('text')
                .style('fisll', 'lightgrey')
                .attr('x', 0)
                .attr('y', h + 80)
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

    const myOptions = [
        { value: 'advantage', label: 'Non disadvantage Community' },
        { value: 'disadvantage', label: 'Disadvantage Community' },
        { value: 'lowincome', label: 'Low Income' }
    ];

    //leaflet map
    const position = [34.03, -118.26];
    const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
    });

    var arrCoordinates = [
        [-118.4452, 34.0689],
        [-118.3, 34.06],
        [-118.4, 34.06]
    ];

    
    function MultipleMarkers() {
        return arrCoordinates.map((coordinate, index) => {
          return <Marker key={index} position={[coordinate[1], coordinate[0]]} icon={icon}>
                      <Popup>
                          This is {coordinate[0]}, {coordinate[1]}.
                          {get_brushed_streets}
                      </Popup>
          </Marker>;
        });
    }
    //draw grid lines if you want

    const center = [-41.2858, 174.7868];
    return (
        <div id='bigcontainer'>
            {/* <Select id='mySelect' 
                    options={myOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    onChange={(event) => {
                        console.log(event);
                    }}
            /> */}
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
                </div>
                <div id='sliderSecondRow'>
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
            <button id='switchModeButton'>Tooltip mode</button>
            <div id='chartAndMap'>
                <div id='container'>
                </div>
                <MapContainer center={position} zoom={10} style={{ height: "100vh" }}>
                    <MyMap/>
                    <LayerGroup>
                        {/* <MyMap/> */}
                    </LayerGroup>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <MultipleMarkers /> */}
                </MapContainer>
            </div>
        </div>
    );

}


export default Chart;
