import './scatter.css';
import * as d3 from 'd3';

import 'leaflet/dist/leaflet.css';

function Scatter(){ 
    
    let dataExample = [];
    //Removes error due to the variable LastSelection not getting used 
    let lastSelection;

    //Points that will be selected 
    let selectedPoints = [];

    //Replace this section with the data from UCLA
    for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * 20) + 1;
        const y = Math.floor(Math.random() * 20) + 1;
        console.log(x + " " + y);
        dataExample.push([x, y]);
        
    }


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

    //Used to manipulate what is displayed on the scatterplot
    const context = canvasChart.node().getContext('2d');

    // Init Scales (.domain places the values from our data points on the plot)
    const x = d3.scaleLinear().domain([0, d3.max(dataExample, (d) => d[0])]).range([0, width]).nice();

    //For the y axis the height and zero change because when using canvas the origin is on the top left rather than the bottom
    const y = d3.scaleLinear().domain([0, d3.max(dataExample, (d) => d[1])]).range([height, 0]).nice();



    // Init Axis
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
    canvasChart.on('click', () => {
        const mouseX = d3.event.offsetX - margin.left;
        const mouseY = d3.event.offsetY - margin.top;

        //Reverts pixels back to original position AKA untransformed
        const untransformedX = Math.round(x.invert(mouseX) + 2); //Plus 2 is added because x is off by two points for some reason
        const untransformedY = Math.round(y.invert(mouseY) - 1);

        // console.log(d3.mouse(container.node()));
        console.log("X: " + untransformedX + " Y: " + untransformedY);

        //Uses find() to search the data example array, then it checks the first and second element of each value in the array.
        //If both are equal the corresponding data point will bre returned. Current issue is that values in the arrays are whole
        // And when you click a point it is a float; therefore, we must return the closest point to the area selected
        //You guys may want to figure out how to select a point based on the circle created of it as opposed to distance 
        //from the point's position. And of course make the point appear on its exact location rather than a rounded number
        const point = dataExample.find(d => d[0] === untransformedX && d[1] === untransformedY); //Currently returns undefined

        //Checks to see if selected point is also in the original array
        //If Point is in the array which it is obviously not
        if (point) {
            console.log("point: " + point);
            const index = selectedPoints.findIndex(d => d[0] === untransformedX && d[1] === untransformedY);
            if (index > -1) {
                selectedPoints.splice(index, 1);
            } else {
                selectedPoints.push(point);
            }
            draw(lastTransform);
        }
        else{
            // console.log("point: " + [untransformedX, untransformedY]);

            // selectedPoints.push([untransformedX, untransformedY]);
            console.log(selectedPoints);
        }
    });





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

    const brushButton = toolsList.select('#brush').on('click', () => {
        toolsList.selectAll('.active').classed('active', false);
        brushButton.classed('active', true);
        canvasChart.style('z-index', 0);
        svgChartParent.style('z-index', 1);
    });

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

            console.log(minX, maxX, minY, maxY);

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
            canvasChart
                .transition()
                .duration(200)
                .ease(d3.easeLinear)
                .call(zoom_function.transform,
                    d3.zoomIdentity
                        .translate(zx(originalPoint[0]) * -1, zy(originalPoint[1]) * -1)
                        .scale(t.k));
            lastSelection = null;
        } else {
            brushSvg.call(brush.move, null);
        }
    }
}
export default Scatter;