import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import HomePage from './HomePage'; // Dodaj import HomePage
import OfferList from './OfferList';

function App() {
    const handleLoginSuccess = () => {
        return <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/list" element={<OfferList/>} />
            </Routes>
        </Router>
    );
}

export default App;