import './chart.css';
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
import * as d3Slider from 'd3-simple-slider';
import Select, {components} from "react-select";
// import { Dropdown } from './dropdown';


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
        d3.select('#container').select('[id="selectButton"]').remove();
        d3.select('#container').append('select').attr('id', 'selectButton')
        .attr('multiple', 'true');
        //Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.
        var allGroup = ['disadvantage', 'nondisadvantage', 'lowincome'];
        d3.select('#container').select('[id="selectButton"]')
            .selectAll('myOption')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function(d) {return d;})
            .attr('value', function(d) {return d;})

        d3.select('[id="selectButton"]').on('change', function(d) {
            console.log(d3.select(this).property('value'));
        })

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

        d3.select('#container').selectAll('[id="dots"]').remove();
        d3.select('#container').select('[id="scatter"]').selectAll('circle')
        .data(filteredData).enter().append('circle').attr('id', 'dots')
        .attr('cx', function(d) {
            return xScale(d.condition); //CHANGE x axis data
        })
        .attr('cy', function(d) {
            return yScale(d.importance);//CHANGE y axis data
        })
        .attr('r', 5)
        .attr('class', 'non_brushed')

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

        function updateChart(data) {
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

            allowBrush();
        }

        function getFilteredData(data) {
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
            return filteredData;
        }
    
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
                        var filteredData = getFilteredData(newnewGeoData);
                        //update chart
                        updateChart(filteredData);
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
                        var filteredData = getFilteredData(newnewGeoData);
                        //update chart
                        updateChart(filteredData);
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
            var filteredData = getFilteredData(newnewGeoData);
            //update chart
            updateChart(filteredData);
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
            var filteredData = getFilteredData(newnewGeoData);
            //update chart
            updateChart(filteredData);
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
            var filteredData = getFilteredData(newnewGeoData);
            //update chart
            updateChart(filteredData);
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
            var filteredData = getFilteredData(newnewGeoData);
            //update chart
            updateChart(filteredData);
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
            var filteredData = getFilteredData(newnewGeoData);
            //update chart
            updateChart(filteredData);
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
            var filteredData = getFilteredData(newnewGeoData);
            //update chart
            updateChart(filteredData);
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

        function displayTable() {

            var selected_region = [];
            var brushed_streets = [];

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
                        geometryArray.push(streetid.geometry);
                    }
                })
            })

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
                //for each brushed street, display in map
                geometryArray.forEach(i => brushed_streets.push(i));
                //clear out previous selected streets
                d3.select('#mapContainer').select('[id="selected_streets"]')
                .remove();

                d3.select('#mapContainer')
                .select('svg')
                .append('g')
                .attr('id', 'selected_streets')
                .selectAll("path")
                .data(brushed_streets)
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
            } else {
                //clear all selected streets in map
                brushed_streets = [];
                d3.select('#mapContainer')
                .select('[id="selected_streets"]')
                .remove();
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
        .on("end", displayTable); 

        function allowBrush() {
            svg.append("g").attr('id', 'brushrect')
            .call(brush);
        }

        allowBrush();

        function makeSelectedSection() {
            const section = d3.select('#container')
                .select('svg')
                .append('g')
                .attr('id', 'selected_regions_title')
                .append('text')
                .style('fill', 'lightgrey')
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

    
    //draw grid lines if you want

    return (
        <div id='bigcontainer'>
            <Select id='mySelect' 
                    options={myOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    // onChange={(event) => {
                    //     console.log(event);

                    //     d3.select('#container')
                    //         .selectAll('[id="dots"')
                    //         .attr('class', 'brushed');
                    // }}
            />
            <div id='sliderFamily'>
                <div id='sliderFirstRow'>
                    <div id='sliderContainer1'>
                        <div id='sliderValueOne'/>
                    </div>
                    <div id='sliderContainer2'>
                        <div id='sliderValueTwo'/>
                    </div>
                    <div id='sliderContainer3'>
                        <div id='sliderValueThree'/>
                    </div>
                    <div id='sliderContainer4'>
                        <div id='sliderValueFour'/>
                    </div>
                </div>
                <div id='sliderSecondRow'>
                    <div id='sliderContainer5'>
                        <div id='sliderValueFive'/>
                    </div>
                    <div id='sliderContainer6'>
                        <div id='sliderValueSix'/>
                    </div>
                    <div id='sliderContainer7'>
                        <div id='sliderValueSeven'/>
                    </div>
                    <div id='sliderContainer8'>
                        <div id='sliderValueEight'/>
                    </div>
                </div>
            </div>
            <div id='container'>
            </div>
        </div>
    );

}


export default Chart;
