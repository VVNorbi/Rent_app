import React, { useState } from 'react';
import axios from 'axios';

const SearchForm = () => {
    const [location, setLocation] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [areaMin, setAreaMin] = useState('');
    const [areaMax, setAreaMax] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/search/', {
                params: {
                    location: location,
                    price_max: priceMax,
                    area_min: areaMin,
                    area_max: areaMax
                }
            });
            alert(response.data.message);  // Powiadomienie o sukcesie
        } catch (error) {
            alert('Błąd podczas wyszukiwania ofert');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Wyszukiwarka ofert wynajmu</h2>
            <form>
                <label>Miejscowość:</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} /><br />
                <label>Cena do:</label>
                <input type="text" value={priceMax} onChange={e => setPriceMax(e.target.value)} /><br />
                <label>Powierzchnia od:</label>
                <input type="text" value={areaMin} onChange={e => setAreaMin(e.target.value)} /><br />
                <label>Powierzchnia do:</label>
                <input type="text" value={areaMax} onChange={e => setAreaMax(e.target.value)} /><br />
                <button type="button" onClick={handleSearch}>Szukaj</button>
            </form>
        </div>
    );
};

export default SearchForm;