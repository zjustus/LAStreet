import React, {useState, useEffect} from 'react';
import HeroSection from "../herosection";
import Infobox from '../background';
import Documentation from '../documentation';
import './home.css';

function Home () {

    const [offsetY, setOffsetY] = useState(0);
    const handleScroll = () => setOffsetY(window.pageYOffset);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div>
            <div className='section' id="home">
                <HeroSection/>
            </div>
            <div className='section' id="infoBox">
                <Infobox/>
            </div>
            <div className='section' id="documentation">
                <Documentation/>
            </div>
        </div>
    );
}

export default Home;