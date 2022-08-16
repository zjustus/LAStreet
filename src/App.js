import './App.css';
import React from 'react';
import Navbar from './components/navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/pages/home';
import Application from './components/pages/application';
import Footer from './components/footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function App() {

  // const { pathname, hash, key } = useLocation();

  // useEffect(() => {
  //   // if not a hash link, scroll to top
  //   if (hash === '') {
  //     window.scrollTo(0, 0);
  //   }
  //   // else scroll to id
  //   else {
  //     setTimeout(() => {
  //       const id = hash.replace('#', '');
  //       const element = document.getElementById(id);
  //       if (element) {
  //         element.scrollIntoView();
  //       }
  //     }, 0);
  //   }
  // }, [pathname, hash, key]); // do this on route change

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/application' element={<Application/>} />
      </Routes>
      <Footer/>
    </Router>
    </>
    
  );
}

export default App;
