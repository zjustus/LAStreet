import React, {useState, useEffect} from 'react';
import { Button } from './button';
import './herosection.css';

function HeroSection() {

    const [offsetY, setOffsetY] = useState(0);
    const handleScroll = () => setOffsetY(window.pageYOffset);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className='hero-background'>
            <div className='hero-container'>
                <h1>Hillside Street</h1>
                <p>Prioritization Application</p>
                <div className='description-box'>
                    <div className='textbox'>
                    This application shows prioritized streets in terms of 
                    capital improvement given user input data and boundaries
                    </div>
                    <div className='hero-btns'>
                        <Button 
                            className='btns'
                            buttonStyle='btn--clear'
                            buttonSize='btn--large'
                        >
                            START
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;