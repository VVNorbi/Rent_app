import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import stylów CSS

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.access);
            onLoginSuccess(); // Wywołanie funkcji przekazanej przez propsy
            navigate('/'); // Przekierowanie do strony głównej po zalogowaniu
        } catch (error) {
            setError('Niepoprawna nazwa użytkownika lub hasło.');
            console.error('Błąd logowania:', error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="mb-4">Zaloguj się</h2>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary btn-block mt-4">Zaloguj się</button>
            </form>
        </div>
    );
}

export default Login;