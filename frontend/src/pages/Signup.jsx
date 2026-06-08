import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { KeyRound, User } from 'lucide-react';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await api.signup(username, password);
            // Optionally auto-login, or redirect to login page
            navigate('/login');
        } catch (err) {
            setError('Failed to create account. Username might be taken.');
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'var(--bg-color)',
            padding: '20px'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'var(--primary-light)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-color)',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        margin: '0 auto 16px auto'
                    }}>
                        TF
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>Create an Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sign up to get started</p>
                </div>

                {error && (
                    <div style={{ 
                        backgroundColor: '#fef2f2', 
                        color: '#ef4444', 
                        padding: '12px', 
                        borderRadius: 'var(--radius-md)', 
                        fontSize: '14px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '8px' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '8px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '8px' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
                        Sign Up
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
                                Login
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
