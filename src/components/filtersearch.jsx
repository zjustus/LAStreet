import { useState, useEffect } from 'react';
// import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
// import styled from 'styled-components';
// import axios from 'axios';

// https://react.semantic-ui.com/usage
// import { Card, Input } from 'semantic-ui-react'


export default function FilterSearchAPI(input) {
    const geoData = input.geoData;
    console.log("Selected: ", geoData)
    return <div>
        {geoData.map(street =>{
            return <div>
                <h1>{street.properties['ST_NAME']}</h1>
            </div>
        })}
    </div>
}
// const AppWrapper = styled.div`
// width:100%;
// height:100%;
// display:flex;
// flex-flow:row wrap;
// justify-content:space-evenly;
// align-items:center;
// `