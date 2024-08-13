import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card.js'; // Upewnij się, że importujesz komponent Card
import './listPage.scss'; // Upewnij się, że importujesz niezbędne CSS dla layoutu
import Map from './Map.jsx'; // Upewnij się, że importujesz komponent Map
import Navbar from './Navbar';

const OfferList = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/offers/');
            setOffers(response.data.offers);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    return (
        
        <div className="listPage">
            <Navbar/>
            <div className="listContainer">
                <div className="wrapper">
                    {offers.map(offer => (
                        <Card key={offer.id} item={offer} />
                    ))}
                </div>
            </div>
            <div className="mapContainer">
              <Map />
            </div>
        </div>
    );
};

export default OfferList;