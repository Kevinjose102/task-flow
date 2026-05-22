import { Search, Bell, Mail } from 'lucide-react';

export default function Topbar() {
  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      backgroundColor: 'transparent',
    }}>
      
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--radius-full)',
        padding: '8px 16px',
        width: '350px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Search size={18} color="var(--text-muted)" style={{ marginRight: '8px' }} />
        <input 
          type="text" 
          placeholder="Search task..." 
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '14px',
            color: 'var(--text-dark)'
          }}
        />
        <div style={{
          backgroundColor: 'var(--bg-color)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontWeight: '500'
        }}>⌘ F</div>
      </div>

      {/* Right Side Icons & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: 'var(--text-muted)'
          }}>
            <Mail size={18} />
          </button>
          <button style={{
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: 'var(--text-muted)'
          }}>
            <Bell size={18} />
          </button>
        </div>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontWeight: 'bold'
          }}>
            JD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)' }}>John Doe</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>johndoe@example.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}
