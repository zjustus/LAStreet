import './App.css';
import React from 'react';
import Navbar from './components/navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/pages/home';
import Application from './components/pages/application';
import Footer from './components/footer';

function App() {
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
