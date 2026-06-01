const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub; // username is in 'sub' claim
    } catch (e) {
        return null;
    }
};

export const api = {
    login: async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    signup: async (username, password) => {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error('Signup failed');
        return response.json();
    },

    getProjects: async () => {
        const response = await fetch(`${API_URL}/projects`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    createProject: async (name) => {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    },

    getAllTasks: async () => {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch all tasks');
        return response.json();
    },

    getTasks: async (projectId) => {
        const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch tasks for project');
        return response.json();
    },

    createTask: async (title, projectId) => {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, status: 'pending', project_id: projectId }),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    updateTaskStatus: async (taskId, status) => {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    deleteTask: async (taskId) => {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return response.json();
    }
};
