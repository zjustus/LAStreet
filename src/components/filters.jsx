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
                console.log(result);
            },
            (error) =>{
                console.log(error);
            }
        );

    }, []);

    // creates useState of functions
    const [inputValues, setInputValues] = useState([0,20,30,40,60])
    const updateInput = (number, value) =>{
        const newArray = [...inputValues]; // clone old array
        newArray[number] = value; // set value
        setInputValues(newArray); // update array
    }

    // Creates an Input
    function rangeInput(min, max, defaultValue, setValue){
        return(
            < input type="range" min={min} max={max} value={defaultValue} onChange={(e) => setValue(e.target.value)} />
        )
    }

    // Generate List of Inputs
    return (
        <div>
            <ul>
                {inputValues.map((value, index) =>rangeInput(0, 100, value, (x) => updateInput(index,x)))}
            </ul>
        </div>
    );
};