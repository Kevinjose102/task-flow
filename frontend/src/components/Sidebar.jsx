import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, CheckSquare, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  const navLinkStyle = ({ isActive }) => {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
      backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.2s',
      marginBottom: '4px'
    };
  };

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--surface-color)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid var(--border-color)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '0 8px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>Task Flow</h1>
      </div>

      <div style={{ flex: 1 }}>
        <nav style={{ marginBottom: '32px' }}>
          {menuItems.map(item => (
            <NavLink key={item.name} to={item.path} style={navLinkStyle}>
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <nav>
        <button 
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            backgroundColor: 'transparent',
            fontWeight: '500',
            transition: 'all 0.2s',
            width: '100%',
            textAlign: 'left'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
