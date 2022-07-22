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
        <>
            <HeroSection/>
            <Infobox/>
            <Documentation/>
        </>
    );
}

export default Home;