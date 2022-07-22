import React from 'react';
import './background.css';
function Infobox () {
    return (
        <>
        <div className='backgroundContainer'>
            <div className='backgroundBox'>
                <h1>Background</h1>
                <p>This web application is developed as part of the LA Streets project by City of Los Angeles and UCLA. 
                    The following documentation provides background information on the Hillside Street Prioritization Application (HSPA). 
                    The LA Streets project aims for maximizing capital improvement by repairing and upgrading streets in the Los Angeles Hillside areas. 
                    In the first stage of the project, publicly available data is used to prioritize streets by a combination of rating and importance. 
                    The web application enables the user to give weights to specific options and filter out desired streets.
                    </p>
            </div>
        </div>
        </>
    ); 
}

export default Infobox;