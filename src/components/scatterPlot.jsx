/**
 * ScatterPlot Function
 * this component given an array of geoJson data will draw a scatter plot
 * 
 */

import { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';


export default function ScatterPlot({geoData, width, height}){
    const canvasRef = useRef(null);

    useEffect(() =>{
        const context = canvasRef.current.getContext('2d');

        // The Scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(geoData, d => d.x))
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain(d3.extent(geoData, d => d.y))
            .range([height, 0]);

        context.fillStyle = 'blue';
        geoData.forEach(d => {
        context.beginPath();
        context.arc(xScale(d.x), yScale(d.y), 5, 0, Math.PI * 2);
        context.fill();
        });

        context.font = '16px sans-serif';
        context.textAlign = 'center';
        context.fillText('X Axis Label', width / 2, height - 10);

        context.save();
        context.translate(20, height / 2);
        context.rotate(-Math.PI / 2);
        context.textAlign = 'center';
        context.fillText('Y Axis Label', 0, 0);
        context.restore();

        context.font = '20px sans-serif';
        context.textAlign = 'center';
        context.fillText('Scatter Plot Title', width / 2, 30);
            
    }, [geoData, width, height])

    return (
        <canvas ref={canvasRef} width={width} height={height}></canvas>
      );
}