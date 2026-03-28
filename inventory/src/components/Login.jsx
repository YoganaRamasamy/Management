import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="logo" style={{ justifyContent: 'center', marginBottom: '30px' }}>
                    <span style={{ fontSize: '40px' }}>📦</span>
                    <h2 style={{ fontSize: '28px' }}>InvManager</h2>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Username</label>
                        <input
                            type="text"
                            className="glass-input form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            className="glass-input form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <p style={{ color: 'var(--accent-red)', marginBottom: '20px' }}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Don't have an account? <a href="/register" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
