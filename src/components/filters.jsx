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
        const change = (e)=>{ 
            defaultValue = e.target.value 
            console.log("wee", defaultValue)
        }
        return(
            < input type="range" min={min} max={max} value={defaultValue} onChange={setValue}/>
        )
    }

    const [inputValues, setInputValues] = useState([0,20,30,40,60])
    const updateInput = (number, value) =>{

    }

    const updateValue = (y, x) => updateInput(10, y);
    updateValue(5, updateInput)
    

    return (
        <div>
            <ul>
                <li>{rangeInput(0, 100, inputValues[0], updateInput(0))}</li>
                <li>{rangeInput(0, 100, inputValues[1], updateInput(1))}</li>
                <li>{rangeInput(0, 100, inputValues[2], updateInput(2))}</li>
                <li>{rangeInput(0, 100, inputValues[3], updateInput(3))}</li>
                <li>{rangeInput(0, 100, inputValues[4], updateInput(4))}</li>
            </ul>
        </div>
    );
};