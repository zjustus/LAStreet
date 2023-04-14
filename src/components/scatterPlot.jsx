/**
 * ScatterPlot Function
 * this component given an array of geoJson data will draw a scatter plot
 * 
 */

import { useRef, useEffect, useState } from "react";


export default function ScatterPlot({geoData}){
    const canvasRef = useRef();
    // const [selectedPoints, setSelectedPoints] = useState([]);
    
    //Update these later?
    const props = {
        width:100,
        height:100,
        maxX:10,
        minX:9,
        maxY:10,
        minY:9
    }

    useEffect(() =>{

        const canvas = canvasRef.current;
        if(!canvas) return; // die if canvas is null

        const ctx = canvas.getContext('2d');

        const xScale = props.width / (props.maxX - props.minX);
        const yScale = props.height / (props.maxY - props.minY);

        ctx.beginPath();
        ctx.moveTo(0, props.height);
        ctx.lineTo(props.width, props.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, props.height);
        ctx.stroke();

        // Draw your data points
        ctx.fillStyle = 'blue';
        geoData.forEach(d => {
            const x = (d.properties.condition - props.minX) * xScale;
            const y = props.height - ((d.properties.importance - props.minY) * yScale);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });  
    }, [geoData, props.height, props.maxX, props.maxY, props.minX, props.minY, props.width]);

    // Event listener for selecting points
    // function handleMouseDown(event) {
    //     const x = event.clientX - canvas.offsetLeft;
    //     const y = event.clientY - canvas.offsetTop;

    //     const clickedPoints = props.data.filter(d => {
    //       const pointX = (d.x - props.minX) * xScale;
    //       const pointY = props.height - ((d.y - props.minY) * yScale);
    //       const distance = Math.sqrt(Math.pow(pointX - x, 2) + Math.pow(pointY - y, 2));
    //       return distance <= 5;
    //     });

    //     setSelectedPoints(clickedPoints);
    // }
    // canvas.addEventListener('mousedown', handleMouseDown);

    return (
        <canvas ref={canvasRef} width={props.width} height={props.height}></canvas>
      );
}