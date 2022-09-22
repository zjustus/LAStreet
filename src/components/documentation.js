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
                        <img src={'/LAStreet/images/Hillside local design.png'} alt='Hillside Local Design' width='350px'></img>
                            <p>Roadway Width: 36 ft. min <br></br>
                            Right-of-Way Width: 44ft<br></br>
                            On-Street Parking: both sides of street<br></br>
                            Target Operating Speed: 15mph</p>
                    </div>
                </div>
                <div className='streetDesign'>
                    <h1>Local Street Standard</h1>
                    <div className='designInfo'>
                        <img src={'/LAStreet/images/Local street design.png'} alt='Local Street Design' width='270px'></img>
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
                    <img src={'/LAStreet/images/Hillside Ordinance Layer.png'} alt='Hillside Ordinance Layer' width='27%'></img>
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
                    <img src={'/LAStreet/images/Sidewalk Layers.png'} alt='Sidewalk Layers'width='500px'></img>
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
                    <img src={'/LAStreet/images/Sub-ratings.jpg'} alt='Sub-Ratings for Street Width, Sidewalk, and Curb' width='80%'></img>
                </div>

                <h2>Condition (Combined Rating)</h2>
                <p>The overall rating is a linear combination 
             of all 4 categories and can be viewed in the following formula. The ratings
             R are precalculated, whereas the weights w are free to choose
             in the Hillside Street Prioritization Application. The more weight is assigned
             to a certain sub-rating category, compared to the other ones, the more important
             this sub-category becomes.</p>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <p>For Example: If the width rating weight is chosen to be 1 and all other rating weights
             are chosen to be 0, the full rating will just be based on the width of the street
             compared to its designated width.</p>

             <div className='formula'>
                <h3>Condition=R<span id="sub">width</span>*w<span id="sub">width</span>
                    +R<span id="sub">PCI<span id="super">2</span></span>*w<span id="sub">PCI</span>
                    +R<span id="sub">Curb</span>*w<span id="sub">Curb</span>
                    +R<span id="sub">Sidewalk</span>*w<span id="sub">Sidewalk</span>
                </h3> 
            </div> 

            <br></br>
            <br></br>
            <br></br>

             <h2>Importance Rating</h2>
             <p>In the following paragraph, the importance metric will be described. 
        To analyze the whole network from a mathematical perspective, we have transformed the
        transportation network into a graph system. In this graph, all the road intersections
        are considered nodes or vertices, and the roads are considered edges or links.
            </p>
            <br></br>
            <br></br>
            <br></br>

            <p>The nodes and edges of this transportation graph satisfy the following criteria:</p>

            <div className='greyBox' style={{marginLeft: '70px'}}>
                    <ol>
                        <li>The vertices must occur where more than 2 edges meet</li>
                        <li>The endpoints of edges are vertices/nodes</li>
                        <li>Nodes/vertices can occur in the middle of a link (then that link is separated into two links)</li>
                    </ol>
            </div>

            <div className='thingsInColumn'>
                <img src={'/LAStreet/images/Small Sample.jpg'} alt='Small Sample' width='350px'></img>
                <p>Small sample graph to demonstrate the criteria</p>
            </div>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <p>The LA Streets Network in graph representation contains 50924 Nodes and 70983 Edges. The graph representation of the LA Streets Network is displayed in the following figure.</p>
 

            <div className='thingsInColumn'>
                <img src={'/LAStreet/images/LA Streets Network.jpg'} alt='LA Street Network' width='550px'></img>
                <p>Graph representation of the LA Streets Network complete (left) and zoomed in (right) with nodes (red) and edges (blue)</p>
            </div>


            <h2>Definition of Importance</h2>
                <p>The objective here is to find out the importance of roads -- in terms of graph theory, the importance of edges. 
                    One good metric to find out important edges is “edge betweenness centrality” [4].
                </p>

                <br></br>
                <br></br>
                <br></br>
                <br></br>   

                <p>
                    In graph theory, edge betweenness centrality is a measure of importance or centrality of edges in a graph based on shortest paths. For every pair of nodes in a connected graph, there exists at least one shortest path between the nodes/vertices such that either the number of edges that the path passes through (for unweighted graphs) or the sum of the costs of the edges (for weighted graphs) is minimized.
                    The edge betweenness centrality for each edge is directly related to the number of the shortest paths that pass through this specific edge. [5]
                </p>

                <br></br>
                <br></br>
                <br></br>
                <br></br>   

                <p>
                    One example of edge betweenness centrality is shown in the following Figure. 
                    In this graph, the most important link is highlighted in red as the most shortest paths pass through this link/edge.
                </p>

                <div className='thingsInColumn'>
                    <img src={'/LAStreet/images/Example Network.jpg'} alt='Example Network' width='550px'></img>
                    <p>Example Network: The most important edge is highlighted</p>
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>  
                <br></br>
                <br></br>

                <p>The mathematical expression for edge betweenness centrality is as follows:</p>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <p>Betweenness centrality of an edge e is the sum of the fraction of all-pairs shortest paths that pass through e. 
                    In other words, we find the shortest path from every node to every node in the whole network and for every edge,
                     we count how many shortest paths pass through it. The edges with more shortest paths passing through it are getting a higher betweenness centrality value and hence, 
                     are more important.
                </p>


                <div className='thingsInColumn'>
                    <img src={'/LAStreet/images/Centrality Of An Edge.jpg'} alt='Centrality of An Edge' width='550px'></img>
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <p>The following two figures highlight some of the most important streets in the LA street network, when importance is purely defined by betweenness centrality.</p>
                <div className='thingsInColumn'>
                    <img src={'/LAStreet/images/LA Road Network.jpg'} alt='LA Road Network' width='250px'></img>
                    <br></br>
                    <p>Important streets in Los Angeles based on betweenness centrality</p>
                </div>
                <br></br>
                <br></br>
                <div className='thingsInColumn'>
                    <img src={'/LAStreet/images/Important Streets.jpg'} alt='Important streets in LA based on betweenness centrality' width='450px'></img>
                    <br></br>
                    <p>Important streets in Los Angeles based on betweenness centrality in Google Maps [6]</p>
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <p>Following, we briefly discuss the concept of the shortest path – which is the basis of calculating the edge betweenness centrality. 
                    Assuming we have a graph like it's shown in the following figure. Each edge in this graph has an assigned cost that can be described for example by distance or travel time. 
                    The shortest path from node i to node j will always be the path that accumulates the least costs while traveling.
                </p>

                <div className='thingsInColumn'>
                    <img src={'/LAStreet/images/Weighted Graph.jpg'} alt='Weighted Graph' width='350px'></img>
                    <br></br>
                    <p>Weighted graph (graph with assigned costs for every edge)</p>
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <p>The following table shows the costs for different paths from node A to node B.
                    From this table, it can be seen that the A-D-C-B accumulates the least amount of cost when traveling from node A to B. 
                    So, path A-D-C-B is considered to be the shortest path. To get more information to algorithmically find the shortest paths in a network, please refer to [7].
                </p>


                <table id="myTable">
                <tr>
                    <th>Path</th>
                    <th>Cost</th>
                </tr>
                <tr>
                    <td>A-B</td>
                    <td>6 miles</td>
                </tr>
                <tr>
                    <td>A-D-B</td>
                    <td>7 miles</td>

                </tr>
                <tr>
                    <td>A-D-C-B</td>
                    <td>5 miles</td>
                </tr>
                </table>

                <h2>Types of Costs</h2>
                <p>Converting the LA Streets Network to a graph initially leads to receiving an unweighted graph (that has no costs assigned to any edges). 
                    The graph representation of the LA Streets Network contains 50924 Nodes and 70983 Edges. 
                    To assign costs to the edges, the following quantities are used:
                </p>

                <div className='typesOfCosts'>
                    <div className='quantities'>
                        <div className='quantityTitle'>
                            Distance
                        </div>
                        <div className='quantityDescription'>
                            The most intuitive way to describe the cost of traveling from one point to another might be the distance. 
                            This distance can be measured for example in feet, meters, miles, or kilometers. 
                            The cost will be proportionally dependent on the distance.
                        </div>
                    </div>
                    <div className='quantities'>
                        <div className='quantityTitle'>
                            Travel Time:
                        </div>
                        <div className='quantityDescription'>
                        As the pure distance does not consider any traffic information or maximum speed limit, travel time can be used as a cost in the network. 
                        A cost assigned by travel time will serve well for daily traffic flow. The travel time can be measured for example in seconds or minutes. 
                        The assigned cost is proportionally dependent on the travel time.
                        </div>
                    </div>      
                    <div className='quantities'>
                        <div className='quantityTitle'>
                            Street Width
                        </div>
                        <div className='quantityDescription'>
                        The street width is the only metric that is included in both, condition rating and importance rating. The street width is measured for example in feet. 
                        When using the street width as a cost, wider streets get assigned lower costs. 
                        In other words, street width and assigned cost behave inversely proportional.
                        </div>
                    </div>
                    <div className='quantities'>
                        <div className='quantityTitle'>
                            Population:
                        </div>
                        <div className='quantityDescription'>
                        Another approach is to use population information as costs. Each edge has population information assigned that can be inverted to get a cost. 
                        Same as with width, population information and assigned cost will behave proportionally. So, streets with a high population will have low costs. 
                        This metric can be used to focus more on streets that are located in population-dense areas.
                        </div>
                    </div>          
                </div>


                <h2>Importance Data Acquisition</h2>    
                <p>Following, the data acquisition for all importance metrics is described.</p>

                <div className='importanceMetrics'>
                    <div className='metrics'>
                        <div className='metricTitle'>
                            Distance and Travel Time:
                        </div>
                        <div className='metricDescription'>
                            Distance and travel time information was collected by using Google Distance Matrix API [8]. 
                            In total, 70983 requests have been made, to receive travel time and distance information for every edge in the graph, using the two connecting node coordinates of each edge as an input. 
                            This procedure is equivalent to asking Google Maps to give travel time information from every intersection in Los Angeles to its neighboring intersections. The following figure shows the output for one particular request, compared to an equivalent google maps request.
                        </div>
                        <br></br>
                        <div className='thingsInColumn'>
                            <img src={'/LAStreet/images/Google Maps Request.jpg'} alt='Google Maps Request' width='850px'></img>
                            <br></br>
                            <p>Google Maps [6] request (left) and Google Distance Matrix API [8] request (right)</p>
                        </div>
                    </div>
                </div>

                <div className='importanceMetrics'>
                    <div className='metrics'>
                        <div className='metricTitle'>
                            Street Width
                        </div>
                        <div className='metricDescription'>
                         Street width information is taken from StreetsLA GeoHub.
                        </div>
                    </div>
                </div>

                <div className='importanceMetrics'>
                    <div className='metrics'>
                        <div className='metricTitle'>
                            Population
                        </div>
                        <div className='metricDescription'>
                            Population information is pulled from Census Blocks 2020 GIS dataset on Los Angeles Geohub. 
                            The dataset provides spatial population information in form of polygons. 
                            The edges of these polygons usually overlap with the road network as shown in the following image.
                        </div>
                        <div className='thingsInColumn'>
                            <img src={'/LAStreet/images/Census Blocks Layer.jpg'} alt='Google Maps Request' width='750px'></img>
                            <br></br>
                            <p>Census Blocks Layer on Los Angeles Geohub [2]</p>
                        </div>
                        <br></br>
                        <div className='metricDescription'>
                            To allocate population values to certain street sections, additional points in a 1-meter distance were added to each polygon edge. 
                            Then, for each point, the closest street section was found. The total population is then divided into the neighboring sections, based on the number of closest points for each section.
                             A sample calculation can be viewed in the following image. In this example, there are only two polygons containing the population. 
                             The total population is assigned to the neighboring street segments, whereas longer edges receive larger shares of the total population. 
                             Street sections can receive population shares from several polygons. These shares will be summed up.
                        </div>
                        <div className='thingsInColumn'>
                            <img src={'/LAStreet/images/Population Allocation.jpg'} alt='Population allocation to street sections' width='650px'></img>
                            <br></br>
                            <p>Population allocation to street sections</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Documentation;