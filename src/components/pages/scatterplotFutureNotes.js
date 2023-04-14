import './scatter.css';
import * as d3 from 'd3';
import 'leaflet/dist/leaflet.css';

function Scatterplot(){

//     const canvas = d3.select('canvas');
//     const context = canvas.node().getContext('2d');
//     canvas.attr('width', width).attr('height', height);


//     const points = canvas.selectAll('circle')
//     .data(data)
//     .join('circle')
//     .attr('cx', d => xScale(d.x))
//     .attr('cy', d => yScale(d.y))
//     .attr('r', 5)
//     .attr('fill', 'blue');


//     const selected = new Set();
//     canvas.on('click', function(event) {
//         const [x, y] = d3.pointer(event);
//         const clicked = findClosest(x, y);
        
//         if (selected.has(clicked)) {
//             selected.delete(clicked);
//         } 
//         else {
//             selected.add(clicked);
//         }

//         redraw();
//     });

// }

// function findClosest(x, y) {
//     let closestDist = Infinity;
//     let closestPoint;
//     points.each(function(d) {
//       const dist = Math.sqrt((xScale(d.x) - x) ** 2 + (yScale(d.y) - y) ** 2);
//       if (dist < closestDist) {
//         closestDist = dist;
//         closestPoint = d;
//       }
//     });
//     return closestPoint;
// }


// function redraw() {
//     context.clearRect(0, 0, width, height);
//     points.each(function(d) {
//       context.beginPath();
//       context.arc(xScale(d.x), yScale(d.y), 5, 0, 2 * Math.PI);
//       if (selected.has(d)) {
//         context.fillStyle = 'red';
//       } 
//       else {
//         context.fillStyle = 'blue';
//       }
//       context.fill();
//     });

  <canvas id="scatterplot"></canvas>
  // Get the canvas element
  const canvas = document.getElementById("scatterplot");

  // Set the canvas context to 2D
  const context = canvas.getContext('2d');

  // Set the canvas width and height
  canvas.width = 500;
  canvas.height = 500;

  // Set the data for the scatterplot
  const data = [  { x: 50, y: 100 },  { x: 200, y: 300 },  { x: 300, y: 200 },  { x: 400, y: 400 },];

  // Create scales for the x and y axes
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, canvas.width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([canvas.height, 0]);

  // Draw the data points on the canvas
  data.forEach(d => {
    context.beginPath();
    context.arc(xScale(d.x), yScale(d.y), 5, 0, 2 * Math.PI);
    context.fillStyle = "blue";
    context.fill();
  });


  
}
  



export default Scatterplot;