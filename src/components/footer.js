import React from 'react';
import './footer.css';

function Footer() {
    return (
        <div className='footerContainer'>
            <div className='footerInfo'>
                <div className='InfoItem'>
                    <h1>Engineer Change.</h1>
                    <p>UCLA Samueli School of Engineering 
                        Department of Civil and Environmental Engineering
                        Los Angeles, CA 90095</p>
                </div>
                <div className='InfoItem'>
                    <h1> Contact </h1>
                    <p>Sriram Narasimhan <br></br>Email: snarasim@ucla.edu</p>
                </div>
            </div>

        <div className='footerBar'>
            <div className='website-rights'>
                © 2022 SRI Lab
            </div>
        </div>    
        </div>
    )
}

export default Footer;