import React, { useState, useEffect } from 'react';
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import styled from 'styled-components';
import axios from 'axios';

// https://react.semantic-ui.com/usage
import { Card, Input } from 'semantic-ui-react'


export default function FilterSearchAPI(geoData) {

    // const [APIData, setAPIData] = useState([])
    // const [filteredResults, setFilteredResults] = useState([]);
    // const [searchInput, setSearchInput] = useState('');
    
    // useEffect(() => {
    //     const getStreets = async function(){
    //         const baseURL = 'http://localhost:3001/filteredData'; 
    //     const response = await axios.get(baseURL)

    //   /*filter the data this time, data doesn't have image and we need an image for each street*/
    //     const data = response.data.filter(street => street.properties.OBJECTID);    
    //     console.log("data", data); 
    //     let tenRandomStreets = [];   
    //             /** Select 10 random streets */
    
    //             for (let i = 0; i < 15; i++) {
    //                 const index = Math.floor(Math.random() * data.length);
    //                 tenRandomStreets.push(data[index]);
          
    //              };
                
    //                   //set characters to characters state
    //             setAPIData(tenRandomStreets);
    //             /** ----------------------------------------------------------------------------------------- */
    //         }
    //      getStreets()       

    // }, []);

    // const searchItems = (searchValue) => {
    //     setSearchInput(searchValue)
    //     if (searchInput !== '') {
    //         const filteredData = APIData.filter((street) => {
    //             return Object.values(street).join('').toLowerCase().includes(searchInput.toLowerCase())
    //         })
    //         setFilteredResults(filteredData)
    //     }
    //     else{
    //         setFilteredResults(APIData)
    //     }
    // }
    console.log(geoData)
    return (
        <div style={{ padding: 20 }}>

     <p className='text-center bureau'>BUREAU OF ENGINEERING 2023 - UCLA Search Street Engine</p><br></br>
     <p className='text-center par-ex'>Special Remark: Every time the web page is reloaded we have a new randomly selected dataset.</p>
     <hr className='hr_liner'></hr>
     <AppWrapper>
      {/* <MDBInputGroup>
              <MDBInput label='Search for Street Address'/>
              <MDBBtn rippleColor='dark'>
                    <MDBIcon icon='search' />      
              </MDBBtn>
        </MDBInputGroup> */}

        <Card.Group itemsPerRow={3} style={{ marginTop: 20 }}>
            {geoData.length > 1 ? (
                geoData.map((street) => {
                    return (
                        <Card key={street.properties.OBJECTID}>
                            <Card.Content>
                                <Card.Header>{street.properties.ST_NAME}</Card.Header>
                                <Card.Description>
                                    {street.properties.ST_FROM}
                                    {street.properties.ST_TO}
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    )
                })
                ) : (
                    geoData.map((street) => {
                        return (
                            <Card  key={street.properties.OBJECTID}>
                                <Card.Content>
                                    <Card.Header>{street.properties.ST_NAME}</Card.Header>
                                    <Card.Description>
                                        {street.properties.OBJECTID}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        )
                    })
                )}
            </Card.Group>
            </AppWrapper>  
        </div>
    )
    
}
const AppWrapper = styled.div`
width:100%;
height:100%;
display:flex;
flex-flow:row wrap;
justify-content:space-evenly;
align-items:center;
`