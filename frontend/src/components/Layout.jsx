import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <Sidebar onLogout={handleLogout} />
            <main style={{ marginLeft: '240px', flex: 1, padding: '40px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
