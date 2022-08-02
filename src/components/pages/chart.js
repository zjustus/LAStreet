import './chart.css';
import {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';


function Chart() {

    var data = [[90, 20, 'A'],
        [20, 109, 'B'],
        [66, 44, 'C'],
        [53, 80, 'D'],
        [24, 182, 'E'],
        [3, 130, 'F'],
        [99, 176, 'G'],
        [54, 150, 'H'],
        [10, 159, 'I'],
        [18, 120, 'J'],
        [37, 144, 'K'],
        [62, 180, 'L'],
        [45, 182, 'M'],
        [80, 172, 'N'],
        [20, 100, 'O'],
        [56, 94, 'P'],
        [43, 180, 'Q'],
        [34, 182, 'R'],
        [88, 172, 'S'],
        [26, 130, 'T'],
        [64, 144, 'U'],
        [53, 111, 'V'],
        [56, 138, 'W'],
        [77, 174, 'X'],
        [10, 161, 'I'],
        [10, 164, 'S'],
        [12, 163, 'J'],
        [16, 162, 'F'],
        [14, 120, 'J'],
        [37, 144, 'K'],
        [62, 180, 'L'],
        [44, 161, 'I'],
        [47, 161, 'S'],
        [43, 165, 'J'],
        [62, 180, 'B'],
        [42, 159, 'J'],
        [49, 152, 'I'],
        [44, 149, 'E'],
        [50, 162, 'F'],
        [45, 175, 'M'],
        [81, 174, 'A'],
        [20, 100, 'O'],
        [56, 94, 'P'],
        [43, 179, 'W'],
        [37, 181, 'C'],
        [88, 143, 'E'],
        [28, 132, 'Y'],
        [64, 155, 'V']];
    //sort data if you're making a line
        data.sort(function(a, b) {
            return a[0] - b[0];
        });
    
    useEffect(() => {
        // testZoom();
        drawChart();
    }, [data]);
    

    function drawChart() {
        //wipe off old chart and reset button before plotting new chart with new data
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
            console.log('hello');
            d3.select('#container')
            .select('svg')
            .call(zoom.transform, d3.zoomIdentity.scale(1));
        });

        //responsive graph (fix refreshing to resize issue)
        const margin = {top: 20, right: 20, bottom: 30, left: 40};

        var default_w = 700 - margin.left - margin.right;
        var default_h = 500 - margin.top - margin.bottom;
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
            .domain([0, 100])
            .range([0, w]);
        var yScale = d3.scaleLinear()
            .domain([0, 200])
            .range([h, 0]);

        // //line
        // const line = d3.line()
        // .x(d => xScale(d[0]))
        // .y(d => yScale(d[1]))
        // .curve(d3.curveMonotoneX);
        
        //set up axis
        // var xAxis = d3.axisBottom(xScale).ticks(data.length);
        // var yAxis = d3.axisLeft(yScale).ticks(10); //d3 rounds sometimes
        var xAxis = svg.append('g')
                    .attr('transform',`translate(0, ${h})`)
                    .attr('class', 'axis')
                    .call(d3.axisBottom(xScale).ticks(15));
                    // .call(d3.axisBottom(xScale).ticks(data.length));

        var yAxis = svg.append('g')
                    .attr('class', 'axis')
                    .call(d3.axisLeft(yScale).ticks(10));
        //path
        // svg.append('path')
        // .datum(data)
        // .attr('fill', 'none')
        // .attr('stroke', 'black')
        // .attr('stroke-width', 1)
        // .attr('class', 'line')
        // .attr('d', line);

        // set up axis labeling
        svg.append('text')
            .attr('class', 'label')
            .attr('x', w/2 - 30)
            .attr('y', h + 50)
            .text('Condition');
        svg.append('text')
            .attr('class', 'label')
            .attr('y', h/2)
            .attr('x', -120)
            .text('Importance');

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
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', 6)
            // .attr("stroke", "#32CD32")
            // .attr("stroke-width", 1.5)
            .attr("fill", "blue")
            .attr('class', 'non_brushed'); //delete to go back to previous version

        function initToolTip () {
            //expand points upon hover
            myScatter
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                     .duration('100')
                     .attr("r", 7)
                     .attr("stroke", "#32CD32")
                     .attr("stroke-width", 1.5);
                //make div appear
                tooltip.transition()
                    .duration(100)
                    .style('opacity', 1);
                tooltip.html("Condition: " + d[0] + " " + "Importance: " + d[1])
                    .style("left", (d3.event.pageX + 15) + "px") //adjust these numbers for tooltip location
                    .style("top", (d3.event.pageY - 15) + "px");
           })
           .on('mouseout', function (d, i) {
                d3.select(this).transition()
                     .duration('200')
                     .attr("r", 5)
                     .attr("stroke", "none");
                //make div disappear
                tooltip.transition()
                    .duration('200')
                    .style('opacity', 0);
           });
        }

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

            //THIS LINE
            var d_brushed =  d3.selectAll(".brushed").data();

            // populate table if one or more elements is brushed
            if (d_brushed.length > 0) {
                //clear all displayed selected dots
                selected_region = [];
                //for each brushed dot, add into display array
                d_brushed.forEach(i => selected_region.push(i));
                d3.select('#selected_regions_title').select('text').remove();
                d3.select('#selected_regions_title')
                .append('text')
                .style('fill', 'lightgrey')
                .attr('x', 600)
                .attr('y', h - 80)
                .html(selected_region.join(','));
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
            const section = d3.select('svg')
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

        //invisible rect
        // svg.append('rect')
        //     .attr('width', w)
        //     .attr('height', h)
        //     .style('fill', 'none')
        //     .style('pointer-events', 'all')
        //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var svgZoom = d3.select('svg').call(zoom);  //initiate zoom
        svgZoom.call(zoom.transform, d3.zoomIdentity.scale(1));



        function handleZoom() {
            var xScaleNew = d3.event.transform.rescaleX(xScale);
            var yScaleNew = d3.event.transform.rescaleY(yScale);

            xAxis.call(d3.axisBottom(xScaleNew));
            yAxis.call(d3.axisLeft(yScaleNew));
            
            scatter.selectAll('circle')
                    .attr('cx', function(d) {return xScaleNew(d[0])})
                    .attr('cy', function(d) {return yScaleNew(d[1])});
        }
        
        initToolTip();
    }
    //     //draw grid lines if you want

    return (
        <div className='containerContainer'>
            {/* <button onClick={test}>RESET</button> */}
            <div id='container'>
                <div id='table'/>
            </div>
        </div>
    );

}



export default Chart;
