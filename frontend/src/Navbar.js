import React from 'react';
import './navbar.scss';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <a href="/">Logo</a>
            </div>
            <ul className="nav-menu">
                <li className="nav-item">
                    <a href="/">Strona główna</a>
                </li>
                <li className="nav-item">
                    <a href="#about">O nas</a>
                </li>
                <li className="nav-item">
                    <a href="/list">Lista ofert</a>
                </li>
                <li className="nav-item">
                    <a href="#contact">Kontakt</a>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;