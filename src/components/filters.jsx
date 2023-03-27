import { useEffect, useState } from "react";

export default function Filters(){
    const [filters, setFilters] = useState(null);
    /**
     * - [] Get Filters from API
     * - [] display sliders / dropdowns
     * - [] update proper streets
     */

    // Get Filters from API
    useEffect(() =>{
        fetch("http://192.168.56.5:3001/filterFeatures")
        .then((response) => response.json())
        .then(
            (result) =>{
                setFilters(JSON.stringify(result));
                // console.log(result);
            },
            (error) =>{
                console.log(error);
            }
        );

    }, []);

    // const testing = "hello"
    function rangeInput(min, max, defaultValue, setValue){
        return(
            < input type="range" min={min} max={max} value={defaultValue} onChange={(e) => setValue(e.target.value)}/>
        )
    }

    const [inputValues, setInputValues] = useState([0,20,30,40,60])
    const updateInput = (number, value) =>{
        console.log("array slot: ", number, " | value: ", value);
        const newArray = [...inputValues];

        newArray[number] = value;
        setInputValues(newArray);
    }
    

    return (
        <div>
            <ul>
                <li>{rangeInput(0, 100, inputValues[0], (x) => {updateInput(0,x)})}</li>
                <li>{rangeInput(0, 100, inputValues[1], (x) => {updateInput(1,x)})}</li>
                <li>{rangeInput(0, 100, inputValues[2], (x) => {updateInput(2,x)})}</li>
                <li>{rangeInput(0, 100, inputValues[3], (x) => {updateInput(3,x)})}</li>
                <li>{rangeInput(0, 100, inputValues[4], (x) => {updateInput(4,x)})}</li>
            </ul>
        </div>
    );
};