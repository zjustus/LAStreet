import React from 'react';
import './documentation.css';

function Documentation () {
    return (
        <div className='docContainer'>
            <div className='docBox'>
                <h1>Documentation</h1>
                <p>Following the data crawling and processing will be explained:</p>

                <h2>Condition Rating</h2>
                <p>Condition rating is performed by comparing the condition and features of the streets with the required conditions and features, based on the street designation. The required features based on designation are taken from "City of Los Angeles Complete Street Design Guide". The following images show the standard design for local streets and local hillside streets in Los Angeles.</p>
                <br></br>

                <h4>Standard Design:</h4>
                <div className='streetDesign'>
                    <h1>Hillside Local</h1>
                    <div className='designInfo'>
                        <img src={process.env.PUBLIC_URL+'images/Hillside Local Design.png'} alt='Hillside Local Design' width='350px'></img>
                            <p>Roadway Width: 36 ft. min <br></br>
                            Right-of-Way Width: 44ft<br></br>
                            On-Street Parking: both sides of street<br></br>
                            Target Operating Speed: 15mph</p>
                    </div>
                </div>
                <div className='streetDesign'>
                    <h1>Local Street Standard</h1>
                    <div className='designInfo'>
                        <img src={process.env.PUBLIC_URL+'images/Local Street Design.png'} alt='Local Street Design' width='270px'></img>
                        <p>Roadway Width: 36 ft.<br></br>
                        Right-of-Way Width: 60ft<br></br>
                        Typical Number of Lanes: 1 lane in each direction<br></br>
                        Typical Sidewalk/Border Width: 12 ft<br></br>
                        Target Operating Speed: 20mph</p>
                    </div>
                </div>
                <br></br>

                <h2>Condition Data Requisition</h2>
                <p>The data for describing the actual street condition is mainly pulled from four different GIS databases.</p>
                <div className='greyBox'  style={{marginLeft: '70px'}}>
                    <ul>
                        <li>StreetsLA GeoHub Street Inventory as a base dataset</li>
                        <li>StreetsLA GeoHub PCI for adding PCI information</li>
                        <li>Street Centerline (data.lacity.org) for adding designation information</li>
                        <li>Hillside Ordinance Geohub for geometric information of hillside ordinance layers</li>
                    </ul>
                </div>
                <br></br>
                <div className='designInfo'>
                    <img src={process.env.PUBLIC_URL+'images/Hillside Ordinance Layer.png'} alt='Hillside Ordinance Layer' width='27%'></img>
                    <p>As the project is only focusing on streets located in the Hillside Ordinance layer, 
                    only these streets will be analyzed in terms of a condition rating. 
                    The Hillside Ordinance layer can be viewed in the following figure.</p>
                </div>

                <p1>Hillside Ordinance layer on Los Angeles GeouHub [2]</p1>
                <br></br>

                <h3>Dataset fusion is performed by matching the SECT_IDs across the GIS databases. 
                    The following GIS databases are used to receive feature information for all sections:
                </h3>
                <div className='thingsInColumn'>
                    <div className='greyBox'>
                        <ul>
                            <li>Sidewalks Geohub for Sidewalk existence</li>
                            <li>Curbs Geohub for curb existence</li>
                        </ul>
                    </div>
                    <img src={process.env.PUBLIC_URL+'images/Sidewalk Layers.png'} alt='Sidewalk Layers'width='500px'></img>
                    <p1>Sidewalk layers on Los Angeles GeoHub [2]</p1>
                </div>
                <br></br>

                <h3>As the sidewalks and curbs are not allocated to any SECT_ID, a manual allocation has to be performed. 
                    In the GIS databases, the street geometry is described using line elements, whereas the sidewalk and curb geometries are described as polygon elements. 
                    The allocation process for sidewalks/curbs to street segments is described as follows:
                </h3>

                <div className='greenBox'>
                    <ul>
                        <li>Interpolate additional points in 1 m distance for all street geometries</li>
                        <li>Build a KD-tree of all the street points and keep knowledge of associated SECT IDs</li>
                        <li>For every curb or sidewalk polygon corner point, search the closest street point</li>
                        <li>If the street points are closer than 0.75 x street width, associate the point to the SECT ID</li>
                    </ul>
                </div>

                <h3>This procedure makes sure that every curb/sidewalk is matched to a certain SECT_ID, if the closest point of the SECT_ID is not too far away. 
                    If curbs and sidewalks are missing in the GIS database, they will not be accounted for in this procedure.</h3>

                <h3>In communication with CityLA, the following required street widths have been set:</h3>

                <table id="myTable">
                <tr>
                    <th>Designation</th>
                    <th>Required Width</th>
                    <th>Designation</th>
                    <th>Required Width</th>
                </tr>
                <tr>
                    <td>Avenue I</td>
                    <td>70</td>
                    <td>Modified Avenue III</td>
                    <td>46</td>
                </tr>
                <tr>
                    <td>Avenue II</td>
                    <td>56</td>
                    <td>Modified Boulevard II</td>
                    <td>80</td>
                </tr>
                <tr>
                    <td>Avenue III</td>
                    <td>46</td>
                    <td>Modified Collector</td>
                    <td>40</td>
                </tr>
                <tr>
                    <td>Boulevard I</td>
                    <td>100</td>
                    <td>Modified Local Street Standard</td>
                    <td>28</td>
                </tr>
                <tr>
                    <td>Boulevard II</td>
                    <td>80</td>
                    <td>Modified Scenic Arterial Mountain</td>
                    <td>28</td>
                </tr>
                <tr>
                    <td>Collector</td>
                    <td>40</td>
                    <td>Mountain Collector</td>
                    <td>40</td>
                </tr>
                <tr>
                    <td>Hillside Collector</td>
                    <td>40</td>
                    <td>None</td>
                    <td>28</td>
                </tr>
                <tr>
                    <td>Local Street - Standard</td>
                    <td>28</td>
                    <td>Private</td>
                    <td>20</td>
                </tr>
                <tr>
                    <td>Modified Avenue I</td>
                    <td>70</td>
                    <td>Scenic Parkway</td>
                    <td>20</td>
                </tr>
                <tr>
                    <td>Modified Avenue II</td>
                    <td>56</td>
                    <td>Unidentified</td>
                    <td>28</td>
                </tr>
                </table>

                <h2>Sub Condition Rating</h2>
                <p>The rating process contains 4 different categories: Width, PCI, Sidewalks, and Curbs. For every category, a score from 0.1 to 1 is assigned.</p>
                <br></br>
                <br></br>
                <br></br>
                <p>Following, the four sub-rating categories are described:</p>
                
                <div className='conditionRating'>
                    <div className='rating'>
                        <div className='ratingTitle'>
                            Width Rating
                        </div>
                        <div className='ratingDescription'>
                        The width rating is dependent on the ratio between the actual street width and the designated street width, which can be seen in the table above. If the ratio is below 0.5, the street section gets the minimum sub-score of 0.1. If the actual width is equal to or greater than the designated width, the street section gets the maximum score of 1.0. The scores in between are connected by a second-order polynomial.
                        </div>
                    </div>
                    <div className='rating'>
                        <div className='ratingTitle'>
                            Curb and Sidewalk Rating
                        </div>
                        <div className='ratingDescription'>
                        The curb and sidewalk rating is dependent on the ratio of designated curb or sidewalk points to section length. Street sections get a top score of 1.0 if the desired ratio is equal to or above the average ratio of all sections, excluding the sections with 0 designated sidewalks or curbs. Street sections get the minimum score of 0.1 if the ratio is 0. The scores in between are connected by a second-order polynomial.
                        </div>
                    </div>
                    <div className='rating'>
                        <div className='ratingTitle'>
                            PCI Rating
                        </div>
                        <div className='ratingDescription'>
                        The PCI rating can be described as the square of the PCI divided by 100.
                        </div>
                    </div>
                    <br></br>
                    <h3>The following figure shows the rating curves for all sub-ratings except PCI:</h3>
                    <br></br>
                    <br></br>
                <img src={process.env.PUBLIC_URL+'images/Sub-ratings.jpg'} alt='Sub-Ratings for Street Width, Sidewalk, and Curb' width='80%'></img>
                </div>
            </div>
        </div>
    );
}

export default Documentation;