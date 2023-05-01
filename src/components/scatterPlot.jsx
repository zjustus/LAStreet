/**
 * ScatterPlot Function
 * this component given an array of geoJson data will draw a scatter plot and return selected data by calling a function
 * 
 */

import { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';

// Settings
const circleRadius = 5;
const circleColor = '#7ed6df';
const selectionColor = '#ff7979';
const TextColor = '#130f40';
const xProperty = 'condition';
const yProperty = 'importance';

export default function ScatterPlot({geoData, callback, width, height}){
    const canvasRef = useRef(null);
    const mouseLocation = useRef({x:0, y:0});
    const mouseDown = useRef(false);
    const [selectionBox, setSelectionBox] = useState({x1:0, y1:0, x2:0, y2:0});
    const selection = useRef([]);



    useEffect(() =>{
        const data = geoData.map(d => {return {"x": d.properties[xProperty], 'y':d.properties[yProperty]}})
        const current = canvasRef.current;
        const context = current.getContext('2d');
        context.clearRect(0, 0, width, height);
        selection.current = [];


        // The Scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.x))
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.y))
            .range([height, 0]);

        // Draw the points
        context.fillStyle = circleColor;
        geoData.forEach(d => {

            const x = xScale(d.properties[xProperty])
            const y = yScale(d.properties[yProperty])

            let x1 = selectionBox.x1;
            let x2 = selectionBox.x2;
            let y1 = selectionBox.y1;
            let y2 = selectionBox.y2;
            if(selectionBox.x1 > selectionBox.x2){
                x1 = selectionBox.x2
                x2 = selectionBox.x1
            }
            if(selectionBox.y1 > selectionBox.y2){
                y1 = selectionBox.y2
                y2 = selectionBox.y1
            }
            
            // Change point color if selected
            if(
                x >= x1 && x <= x2 &&
                y >= y1 && y <= y2
            ){
                context.fillStyle = selectionColor;
                selection.current.push(d)

            }
            else context.fillStyle = circleColor;

            context.beginPath();
            context.arc(x, y, circleRadius, 0, Math.PI * 2);
            context.fill();
        });

        context.fillStyle = TextColor;

        // X Axes
        context.font = '16px sans-serif';
        context.textAlign = 'center';
        context.fillText(xProperty, width / 2, height - 10);

        // Y Axes
        context.save();
        context.translate(20, height / 2);
        context.rotate(-Math.PI / 2);
        context.textAlign = 'center';
        context.fillText(yProperty, 0, 0);
        context.restore();

        // Title
        // context.font = '20px sans-serif';
        // context.textAlign = 'center';
        // context.fillText('Scatter Plot Title', width / 2, 30);

        // Draw Selection Box
        if(mouseDown.current){
            const {x1, y1, x2, y2} = selectionBox
            context.beginPath();
            context.rect(x1, y1, x2-x1, y2-y1);
            context.stroke();
        }

        // Mouse & Selection management
        const handleMouseMove = e => {
            const bounds = canvasRef.current.getBoundingClientRect();
            const x1 = selectionBox.x1;
            const y1 = selectionBox.y1;
            const x2 = e.clientX - bounds.left;
            const y2 = e.clientY - bounds.top;
            mouseLocation.current = {'x':x2, 'y':y2}

            if(mouseDown.current){
                setSelectionBox({x1, y1, x2, y2})
                // console.log(selection)
            }

        };
        const handleMouseDown = (e => {
            mouseDown.current = true
            setSelectionBox({
                x1:mouseLocation.current.x,
                y1:mouseLocation.current.y,
                x2:mouseLocation.current.x,
                y2:mouseLocation.current.y
            })
        });
        const handleMouseUp = (e => {
            mouseDown.current = false
            callback(selection.current)
        });
        

        current.addEventListener('mousemove', handleMouseMove);
        current.addEventListener('mousedown', handleMouseDown);
        current.addEventListener('mouseup', handleMouseUp);

        // Remove event listener when unmounting the component
        return () => {
            current.removeEventListener('mousemove', handleMouseMove);
            current.removeEventListener('mousedown', handleMouseDown);
            current.removeEventListener('mouseup', handleMouseUp);
        };

            
    }, [geoData, selectionBox, callback, width, height])

    return (
        <canvas ref={canvasRef} width={width} height={height}></canvas>
      );
}