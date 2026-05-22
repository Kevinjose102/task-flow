import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getUserFromToken } from '../api';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const navigate = useNavigate();
    const username = getUserFromToken() || 'User';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsData, tasksData] = await Promise.all([
                api.getProjects(),
                api.getAllTasks()
            ]);
            setProjects(projectsData);
            setTasks(tasksData);
        } catch (err) {
            if (err.message.includes('fetch') || err.message.includes('Failed')) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        try {
            await api.createProject(newProjectName);
            setNewProjectName('');
            setIsCreatingProject(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateTaskStatus = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        try {
            await api.updateTaskStatus(taskId, newStatus);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.deleteTask(taskId);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)' }}>
                    Welcome back, {username}
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Here is an overview of your workspace.</p>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Projects</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-dark)' }}>{projects.length}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Tasks</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-dark)' }}>{tasks.length}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Completed Tasks</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary-color)' }}>{completedTasksCount}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Projects Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Projects</h3>
                        <button 
                            className="btn-secondary" 
                            style={{ padding: '6px 12px' }}
                            onClick={() => setIsCreatingProject(!isCreatingProject)}
                        >
                            <Plus size={16} style={{ marginRight: '4px' }}/> New Project
                        </button>
                    </div>

                    {isCreatingProject && (
                        <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Project name..."
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="btn-primary">Save</button>
                        </form>
                    )}

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {projects.length === 0 && <div style={{ padding: '20px', color: 'var(--text-muted)' }}>No projects found.</div>}
                        {projects.map((project, idx) => (
                            <Link 
                                to={`/projects/${project.id}/tasks`}
                                key={project.id}
                                style={{
                                    display: 'block',
                                    padding: '16px 20px',
                                    borderBottom: idx < projects.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <h4 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '500' }}>{project.name}</h4>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Tasks Section */}
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Tasks</h3>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {tasks.length === 0 && <div style={{ padding: '20px', color: 'var(--text-muted)' }}>No tasks found.</div>}
                        {tasks.slice(-5).reverse().map((task, idx) => {
                            const isCompleted = task.status === 'completed';
                            return (
                                <div key={task.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 20px',
                                    borderBottom: idx < Math.min(tasks.length, 5) - 1 ? '1px solid var(--border-color)' : 'none',
                                    backgroundColor: isCompleted ? 'var(--bg-color)' : 'transparent'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button 
                                            onClick={() => handleUpdateTaskStatus(task.id, task.status)}
                                            style={{ color: isCompleted ? 'var(--primary-color)' : 'var(--text-muted)' }}
                                        >
                                            {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                        </button>
                                        <span style={{ 
                                            color: isCompleted ? 'var(--text-muted)' : 'var(--text-dark)',
                                            textDecoration: isCompleted ? 'line-through' : 'none'
                                        }}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteTask(task.id)}
                                        style={{ color: 'var(--text-muted)' }}
                                        onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
