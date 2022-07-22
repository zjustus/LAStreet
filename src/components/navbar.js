import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './navbar.css';
import {Button} from './button';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        }
        else
        {
            setButton(true);
        }
    }

    useEffect(() => {
        showButton()
    }, []);

    window.addEventListener('resize', showButton)

    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to='/' className="navbar-logo" onClick={closeMobileMenu}>
                        HSPA 
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/application' className='nav-links' onClick={closeMobileMenu}>
                                Application
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/documentation' className='nav-links' onClick={closeMobileMenu}>
                                Documentation
                            </Link>
                        </li>
                    </ul>
                    {button && <Button buttonStyle='btn--outline'>GET STARTED</Button>}
                </div>
            </nav>
        </>
    )
}

const STYLES = ['navbar--white', 'navbar--blue'];

export default Navbar;
// export default Navbar = ({barStyle}) => {
//     const checkbarStyle = STYLES.includes(barStyle) ? barStyle : STYLES[0];
//     return (
//     <Navbar
//         className={`navbar ${checkbarStyle} `}>
//     </Navbar>);
// }
