/**
 * Filters Function
 * this Filters component retrieves a list of available filters from the API, 
 * allows for modification of the filter parameter
 * 
 * then calls a callback function upon updating
 * This callback function must accept a parameter that will hold the GeoJSON dataset
 */

import { useEffect, useState } from "react";

export default function Filters({callBack}){
    
    const [filters, setFilters] = useState({});
    // Get Filters from API
    useEffect(() =>{
        // fetch("http://192.168.56.5:3001/filters")
        fetch("http://localhost:3001/filters")
        .then((response) => response.json())
        .then(
            (result) =>{
                console.log(result);
                setFilters(result);
            },
            (error) =>{
                console.log(error);
            }
        );

    }, []);

    // Updates a specific property of the filters object
    const updateFilter = (filter, value) =>{
        let newFilters = {...filters};
        newFilters[filter].default = value;
        setFilters(newFilters);
    }

    // Creates a Slider Input
    function rangeInput(min, max, defaultValue, setValue){
        return(
            < input type="range" min={min} max={max} step="0.1" value={defaultValue} onChange={(e) => setValue(Number(e.target.value))} />
        )
    }

    // Creates a dropdown Input
    function selectInput(selection, defaultValue, setValue){       
        return(
            // This set value might be wrong...
            <select onChange={(e) => setValue(e.target.value)}>
                {Object.keys(selection).map((value) =>{
                    const FriendlyName = selection[value];
                    return(
                        <option key={value} value={value}>{FriendlyName}</option>
                    )
                })}
            </select>
        )
    }

    // Call the Callback
    function executeCallback(){

        // Build parameter list
        const filterValues = {};
        Object.keys(filters).forEach(filterKey => {
            if("default" in filters[filterKey])
                filterValues[filterKey] = filters[filterKey].default
        });
        const urlParams = new URLSearchParams(filterValues);

        // Get the GeoJson Data
        // fetch(`http://192.168.56.5:3001/filteredData?${urlParams}`)
        fetch(`http://localhost:3001/filteredData?${urlParams}`)
        .then((response) => response.json())
        .then(result =>{
            callBack(result)
            // console.log(result);
        })
        .catch(error =>{
            console.error("There was a problem fetching goeJson Data", error)
        })

        // execute call back function passing geoJson data
    }

    // Generate List of Inputs
    return (
        <div>
            <ul>
                {Object.keys(filters).map(filterKey =>{
                    const filter = filters[filterKey];
                    let theFilter = <h1>{filter.name}</h1>;
                    
                    if(filter.type === "number")
                        theFilter = rangeInput(
                            filter.min, 
                            filter.max, 
                            filter.default, 
                            (changeValue) => updateFilter(filterKey, changeValue)
                        )
                    else if(filter.type === "select"){
                        theFilter = selectInput(
                            filter.options,
                            filter.default,
                            (changeValue)=> updateFilter(filterKey, changeValue)
                        );
                    }
                    return(<li key={filterKey}>{filter.name}: {theFilter}</li>)
                })}
            </ul>
            <button onClick={executeCallback}>Submit</button>
        </div>
    );
};