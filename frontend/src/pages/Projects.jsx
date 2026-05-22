import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Plus } from 'lucide-react';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        try {
            await api.createProject(newProjectName);
            setNewProjectName('');
            setIsCreating(false);
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)' }}>All Projects</h2>
                <button 
                    className="btn-primary" 
                    onClick={() => setIsCreating(!isCreating)}
                >
                    <Plus size={16} style={{ marginRight: '4px' }}/> Create Project
                </button>
            </div>

            {isCreating && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter project name..."
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn-primary">Save Project</button>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {projects.length === 0 && <div style={{ padding: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>No projects found.</div>}
                {projects.map((project, idx) => (
                    <Link 
                        to={`/projects/${project.id}/tasks`}
                        key={project.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px 24px',
                            borderBottom: idx < projects.length - 1 ? '1px solid var(--border-color)' : 'none',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-dark)', fontSize: '16px', fontWeight: '600' }}>{project.name}</h3>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Project ID: {project.id}</span>
                        </div>
                        <span style={{ color: 'var(--primary-color)', fontSize: '14px', fontWeight: '500' }}>View Tasks →</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
