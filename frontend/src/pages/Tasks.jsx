import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { Plus, CheckCircle2, Circle, Trash2, ArrowLeft } from 'lucide-react';

export default function Tasks() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    // Only allow creating a task if we are viewing a specific project
    const isProjectView = !!projectId;

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            const data = isProjectView ? await api.getTasks(projectId) : await api.getAllTasks();
            setTasks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !isProjectView) return;
        try {
            await api.createTask(newTaskTitle, parseInt(projectId));
            setNewTaskTitle('');
            setIsCreating(false);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        try {
            await api.updateTaskStatus(taskId, newStatus);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.deleteTask(taskId);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {isProjectView && (
                <div style={{ marginBottom: '24px' }}>
                    <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <ArrowLeft size={16} /> Back to Projects
                    </Link>
                </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)' }}>
                    {isProjectView ? `Tasks for Project ${projectId}` : 'All Tasks'}
                </h2>
                
                {isProjectView && (
                    <button 
                        className="btn-primary" 
                        onClick={() => setIsCreating(!isCreating)}
                    >
                        <Plus size={16} style={{ marginRight: '4px' }}/> Add Task
                    </button>
                )}
            </div>

            {isProjectView && isCreating && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="What needs to be done?"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn-primary">Save Task</button>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {tasks.length === 0 && <div style={{ padding: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>No tasks found.</div>}
                
                {tasks.map((task, idx) => {
                    const isCompleted = task.status === 'completed';
                    return (
                        <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 24px',
                            borderBottom: idx < tasks.length - 1 ? '1px solid var(--border-color)' : 'none',
                            backgroundColor: isCompleted ? 'var(--bg-color)' : 'transparent',
                            transition: 'background-color 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                <button 
                                    onClick={() => handleUpdateStatus(task.id, task.status)}
                                    style={{ color: isCompleted ? 'var(--primary-color)' : 'var(--text-muted)' }}
                                >
                                    {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </button>
                                <div>
                                    <span style={{ 
                                        display: 'block',
                                        fontSize: '15px', 
                                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-dark)',
                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                        fontWeight: '500',
                                        marginBottom: '4px'
                                    }}>
                                        {task.title}
                                    </span>
                                    {!isProjectView && (
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Project ID: {task.project_id}</span>
                                    )}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    backgroundColor: isCompleted ? '#dcfce7' : '#f3f4f6',
                                    color: isCompleted ? '#166534' : 'var(--text-muted)'
                                }}>
                                    {isCompleted ? 'Completed' : 'Pending'}
                                </span>
                                
                                <button 
                                    onClick={() => handleDeleteTask(task.id)}
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
