import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('EMPLOYEE');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', { username, password, role });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Username might be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="logo" style={{ justifyContent: 'center', marginBottom: '30px' }}>
                    <span style={{ fontSize: '40px' }}>📦</span>
                    <h2 style={{ fontSize: '28px' }}>Join InvManager</h2>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Username</label>
                        <input
                            type="text"
                            className="glass-input form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Pick a username"
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
                            placeholder="Choose a password"
                        />
                    </div>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Role</label>
                        <select
                            className="glass-input form-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {error && <p style={{ color: 'var(--error)', marginBottom: '20px', fontSize: '14px' }}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Creating Account...' : 'Register Now'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
