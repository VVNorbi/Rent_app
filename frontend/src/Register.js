import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Zaimportuj plik ze stylami CSS

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Walidacja pól formularza
        if (!username || !password || !email) {
            setError('Wszystkie pola są wymagane!');
            return;
        }
        
        axios.post('http://localhost:8000/api/register/', {
            username,
            password,
            email,
        }).then(response => {
            console.log(response);
            // Możesz dodać tutaj przekierowanie lub inny feedback po udanej rejestracji
        }).catch(error => {
            console.log(error);
            setError('Błąd podczas rejestracji. Spróbuj ponownie później.');
        });
    };

    return (
        <div className="register-container">
            <div className="register-form-container">
                <h2>Rejestracja</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" placeholder="Nazwa użytkownika" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button type="submit">Zarejestruj się</button>
                </form>
            </div>
        </div>
    );
}

export default Register;