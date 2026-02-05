import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.data);
    } catch (error) {
      toast.error('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask._id}`, formData);
        toast.success('Task updated successfully');
      } else {
        await axios.post('/api/tasks', formData);
        toast.success('Task created successfully');
      }
      fetchTasks();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Error deleting task');
      }
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">Tasks</h1>
              <p className="text-gray-400">Manage your tasks and stay organized</p>
            </div>
            <button
              onClick={() => openModal()}
              className="gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2
                       hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              <FiPlus size={20} />
              New Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <p className="text-gray-400 text-lg">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="glass-card rounded-xl p-6 hover:border-primary-500/50 transition-all animate-slide-in"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">{task.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(task)}
                        className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="text-primary-400" size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="text-red-400" size={18} />
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                  )}

                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {task.dueDate && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gradient">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                           text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-500/20 transition-all"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                           text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-500/20 transition-all resize-none"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                             text-gray-100 focus:border-primary-500 focus:ring-2 
                             focus:ring-primary-500/20 transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                             text-gray-100 focus:border-primary-500 focus:ring-2 
                             focus:ring-primary-500/20 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                           text-gray-100 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3 rounded-lg
                         hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tasks;
