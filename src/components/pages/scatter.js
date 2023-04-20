import './scatter.css';
import * as d3 from 'd3';

import 'leaflet/dist/leaflet.css';

function Scatter(){ 
    
    let dataExample = [];
    //Removes error due to the variable LastSelection not getting used 
    let lastSelection;

    //Points that will be selected 
    let selectedPoints = [];

    //Replace this section with the data from UCLA Currently returns random points from 0 to 1 just like Condition and Importance
    for (let i = 0; i < 2000; i++) {
        const x = Math.random();
        const y = Math.random();
        // console.log(x + " " + y);
        dataExample.push([x, y]);
        
    }

    //Ensures all data points are in order so that when it comes to find out which point is the closest to the clicked point this can be done more easily
    dataExample.sort();
    console.log('Before Conversion: ' + dataExample[0]);

    //Characteristics of the graph
    const pointColor = 'blue'
    const margin = { top: 20, right: 15, bottom: 60, left: 70 };
    const outerWidth = 800;
    const outerHeight = 600;
    const width = outerWidth - margin.left - margin.right;
    const height = outerHeight - margin.top - margin.bottom;

    const container = d3.select('.scatter-container');

    let lastTransform = null;


    //Initialize svg (It is still needed to to draw out the scatter plot's axes)
    const svgChart = container.append('svg:svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .attr('class', 'svg-plot')
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Initialize the canvas, this is where the points will be placed on 
    const canvasChart = container.append('canvas')
        .attr('width', width)
        .attr('height', height)
        .style('margin-left', margin.left + 'px')
        .style('margin-top', margin.top + 'px')
        .attr('class', 'canvas-plot');

    // Prepare buttons
    const toolsList = container.select('.tools')
        .style('margin-top', margin.top + 'px')
        .style('visibility', 'visible');

    toolsList.select('#reset').on('click', () => {
        const t = d3.zoomIdentity.translate(0, 0).scale(1);
        canvasChart.transition()
            .duration(200)
            .ease(d3.easeLinear)
            .call(zoom_function.transform, t)
    });

    const context = canvasChart.node().getContext('2d');

    // Initialize Scales (.domain places the values from our data points on the plot)
    const x = d3.scaleLinear().domain([0, d3.max(dataExample, (d) => d[0])]).range([0, width]).nice();

    //For the y axis the height and zero change because when using canvas the origin is on the top left rather than the bottom
    const y = d3.scaleLinear().domain([0, d3.max(dataExample, (d) => d[1])]).range([height, 0]).nice();



    // Initialize Axis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Add Axis
    const gxAxis = svgChart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    const gyAxis = svgChart.append('g')
        .call(yAxis);

    // Add labels
    svgChart.append('text')
        .attr('x', `-${height / 2}`)
        .attr('dy', '-3.5em')
        .attr('transform', 'rotate(-90)')
        .text('Importance');
    svgChart.append('text')
        .attr('x', `${width / 2}`)
        .attr('y', `${height + 40}`)
        .text('Condition');


    //Detects when user inputs a mouse click 
    // canvasChart.on('click', event => {
    //     const mouseX = d3.event.offsetX;
    //     const mouseY = d3.event.offsetY;

    //     //Reverts pixels back to original position AKA untransformed
    //     const untransformedX = x.invert(mouseX); 
    //     const untransformedY = y.invert(mouseY);

    //     console.log("X: " + untransformedX + " Y: " + untransformedY);

    //     const point = dataExample.find(d => d[0] === untransformedX && d[1] === untransformedY); //Currently returns undefined

    //     //Checks to see if selected point is also in the original array
    //     if (point) {
    //         console.log("point: " + point);
    //         const index = selectedPoints.findIndex(d => d[0] === untransformedX && d[1] === untransformedY);
    //         if (index > -1) {
    //             selectedPoints.splice(index, 1);
    //         } else {
    //             selectedPoints.push(point);
    //         }
    //         draw(lastTransform);
    //     }
    //     else{
    //         // console.log("point: " + [untransformedX, untransformedY]);

    //         // selectedPoints.push([untransformedX, untransformedY]);
    //         console.log(selectedPoints);
    //     }
    // });


    //Gets the values between selected points may need to set 0 to smaller points
    function getInBetweenValues(x0, y0, x1, y1) {

        console.log('Checking values between x0: ' + x0 + ' y0: ' + y0 + ' x1: '+ x1 + ' y1: ' + y1);
        let highlightedPoints = [];
        for(let i = 0; i < dataExample.length; i++){
            console.log(((x0 <= dataExample[i][0]) && (dataExample[i][0] <= x1)) && (y0 >= dataExample[i][1])&&(dataExample[i][1] >= y1));

            // console.log(y0 >= dataExample[i][1] >= y1);

            if(((x0 <= dataExample[i][0]) && (dataExample[i][0] <= x1)) && (y0 >= dataExample[i][1])&&(dataExample[i][1] >= y1)){
                console.log(dataExample[i] + ' OH YEAH');
                highlightedPoints.push(dataExample[i]);
            }
            
        }

        // for(let i = 0; i < highlightedPoints.length; i++){
        //     console.log('Selected: ' + highlightedPoints[i] );
        // }

        return highlightedPoints;
    }



    // Draw plot on canvas. Since canvas uses 'pixels' to dictate at what point an element is drawn, we need to convert the data points we have to 'pixels'
    //Assign a value to each pixel is the next step
    function draw(transform) {

        lastTransform = transform;
        const scaleX = transform.rescaleX(x);
        const scaleY = transform.rescaleY(y);
        gxAxis.call(xAxis.scale(scaleX));
        gyAxis.call(yAxis.scale(scaleY));
    
        context.clearRect(0, 0, width, height);
    
        dataExample.forEach(point => {
            drawPoint(scaleX, scaleY, point, transform.k);
        });
    
        selectedPoints.forEach(point => {
            drawPoint(scaleX, scaleY, point, transform.k);
        });

    }

    // Initial draw made with no zoom
    draw(d3.zoomIdentity)

    function drawPoint(scaleX, scaleY, point, k) {
        context.beginPath();
        context.fillStyle = selectedPoints.some(d => d[0] === point[0] && d[1] === point[1]) ? 'red' : pointColor;
        const px = scaleX(point[0]);
        const py = scaleY(point[1]);

        context.arc(px, py, 1.2 * k, 0, 2 * Math.PI, true);
        context.fill();
        

    }

    function updatePoints(colorPoints){
        console.log('Im finally here');
        // const point = dataExample.find(d => d[0] === untransformedX && d[1] === untransformedY); //Currently returns undefined
        // selectedPoints.splice(index, 1);

        // selectedPoints.push(point);

        // draw(lastTransform);


        // colorPoints
        //Checks to see if selected point is also in the original array
        //If Point is in the array which it is obviously not
        // if (point) {
        //     console.log("point: " + point);

        colorPoints.forEach(point => {
            if(selectedPoints.indexOf(point) === -1)selectedPoints.push(point);
            // selectedPoints.splice(point, 1); 
            // selectedPoints.push(point);
        });
        console.log(selectedPoints);
        // for(int i = 0; i < selectedPoints.length;i++){
        //     selectedPoints
        // }
        // const index = selectedPoints.findIndex(d => d[0] === untransformedX && d[1] === untransformedY);
        // if (index > -1) {
        //     selectedPoints.splice(index, 1);
        // } else {
        //     selectedPoints.push(point);
        // }
        draw(lastTransform);
        // }
    }

    // Zoom/Drag handler
    const zoom_function = d3.zoom().scaleExtent([1, 1000])
        .on('zoom', () => {
            const transform = d3.event.transform;
            context.save();
            draw(transform);
            context.restore();
        });

    canvasChart.call(zoom_function);

    //Box Zoom
    const svgChartParent = d3.select('svg');
    const zoomButton = toolsList.select('#zoom').on('click', () => {
        toolsList.selectAll('.active').classed('active', false);
        zoomButton.classed('active', true);
        canvasChart.style('z-index', 1);
        svgChartParent.style('z-index', 0);
    });


    //Brush Feature
    const brushButton = toolsList.select('#brush').on('click', () => {
        toolsList.selectAll('.active').classed('active', false);
        brushButton.classed('active', true);
        canvasChart.style('z-index', 0);
        svgChartParent.style('z-index', 1);
    });

    //Start
    const brush = d3.brush().extent([[0, 0], [width, height]])
        .on("start", () => { brush_startEvent(); })
        .on("brush", () => { brush_brushEvent(); })
        .on("end", () => { brush_endEvent(); })
        .on("start.nokey", function() {
            d3.select(window).on("keydown.brush keyup.brush", null);
        });

    const brushSvg = svgChart
        .append("g")
        .attr("class", "brush")
        .call(brush);

    let brushStartPoint = null;

    function brush_startEvent() {
        const sourceEvent = d3.event.sourceEvent;
        const selection = d3.event.selection;
        
        if (sourceEvent.type === 'mousedown') {
            brushStartPoint = {
                mouse: {
                    x: sourceEvent.screenX,
                    y: sourceEvent.screenY
                },
                x: selection[0][0],
                y: selection[0][1]
            }
        } else {
            brushStartPoint = null;
        }
    }

    function brush_brushEvent() {
        if (brushStartPoint !== null) {
            const scale = width / height;
            const sourceEvent = d3.event.sourceEvent;
            const mouse = {
                x: sourceEvent.screenX,
                y: sourceEvent.screenY
            };
            if (mouse.x < 0) { mouse.x = 0; }
            if (mouse.y < 0) { mouse.y = 0; }
            let distance = mouse.y - brushStartPoint.mouse.y;
            let yPosition = brushStartPoint.y + distance;
            let xCorMulti = 1;

            if ((distance < 0 && mouse.x > brushStartPoint.mouse.x) || (distance > 0 && mouse.x < brushStartPoint.mouse.x)) {
                xCorMulti = -1;
            }

            if (yPosition > height) {
                distance = height - brushStartPoint.y;
                yPosition = height;
            } else if (yPosition < 0) {
                distance = -brushStartPoint.y;
                yPosition = 0;
            }

            let xPosition = brushStartPoint.x + distance * scale * xCorMulti;
            const oldDistance = distance;

            if (xPosition > width) {
                distance = (width - brushStartPoint.x) / scale;
                xPosition = width;
            } else if (xPosition < 0) {
                distance = brushStartPoint.x / scale;
                xPosition = 0;
            }

            if (oldDistance !== distance) {
                distance *= (oldDistance < 0) ? -1 : 1;
                yPosition = brushStartPoint.y + distance;
            }

            const selection = svgChart.select(".selection");

            const posValue = Math.abs(distance);
            selection.attr('width', posValue * scale).attr('height', posValue);

            if (xPosition < brushStartPoint.x) {
                selection.attr('x', xPosition);
            }
            if (yPosition < brushStartPoint.y) {
                selection.attr('y', yPosition);
            }

            const minX = Math.min(brushStartPoint.x, xPosition);
            const maxX = Math.max(brushStartPoint.x, xPosition);
            const minY = Math.min(brushStartPoint.y, yPosition);
            const maxY = Math.max(brushStartPoint.y, yPosition);

            // console.log('Minimum X: ' + x.invert(minX) + ' Maximum X: ' + x.invert(maxX) + ' Minimum Y: '+   y.invert(minY) + ' Maximum Y: '  + y.invert(maxY));

            console.log(getInBetweenValues(x.invert(minX),y.invert(minY),x.invert(maxX),y.invert(maxY)));

            lastSelection = { x1: minX, x2: maxX, y1: minY, y2: maxY };
        }
    }


    function brush_endEvent() {
        const s = d3.event.selection;
        if (!s && lastSelection !== null) {
            // Re-scale axis for the last transformation
            let zx = lastTransform.rescaleX(x);
            let zy = lastTransform.rescaleY(y);
            
            // Calc distance on Axis-X to use in scale
            let totalX = Math.abs(lastSelection.x2 - lastSelection.x1);

            
            // Get current point [x,y] on canvas
            const originalPoint = [zx.invert(lastSelection.x1), zy.invert(lastSelection.y1)];
            console.log('Zoomed Values for original points ' + originalPoint);
            console.log(lastSelection);
            updatePoints(getInBetweenValues(x.invert(lastSelection.x1),y.invert(lastSelection.y1),x.invert(lastSelection.x2),y.invert(lastSelection.y2)));

            // Calc scale mapping distance AxisX in width * k
            // Example: Scale 1, width: 830, totalX: 415
            // Result in a zoom of 2
            const t = d3.zoomIdentity.scale(((width * lastTransform.k) / totalX));
            // Re-scale axis for the new transformation
            zx = t.rescaleX(x);
            zy = t.rescaleY(y);
            
            // Call zoomFunction with a new transformation from the new scale and brush position.
            // To calculate the brush position we use the originalPoint in the new Axis Scale.
            // originalPoint it's always positive (because we're sure it's within the canvas).
            // We need to translate this originalPoint to [0,0]. So, we do (0 - position) or (position * -1)
            // canvasChart
            //     .transition()
            //     .duration(200)
            //     .ease(d3.easeLinear)
            //     .call(zoom_function.transform,
            //         d3.zoomIdentity
            //             .translate(zx(originalPoint[0]) * -1, zy(originalPoint[1]) * -1)
            //             .scale(t.k));
            // lastSelection = null;
        } else {
            brushSvg.call(brush.move, null);
        }
    }
}
export default Scatter;