import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    completed: false,
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data.data);
    } catch (error) {
      toast.error('Error fetching todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        await axios.put(`/api/todos/${editingTodo._id}`, formData);
        toast.success('Todo updated successfully');
      } else {
        await axios.post('/api/todos', formData);
        toast.success('Todo created successfully');
      }
      fetchTodos();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving todo');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(`/api/todos/${todo._id}`, {
        ...todo,
        completed: !todo.completed,
      });
      fetchTodos();
      toast.success(todo.completed ? 'Todo marked as incomplete' : 'Todo marked as complete');
    } catch (error) {
      toast.error('Error updating todo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(`/api/todos/${id}`);
        toast.success('Todo deleted successfully');
        fetchTodos();
      } catch (error) {
        toast.error('Error deleting todo');
      }
    }
  };

  const openModal = (todo = null) => {
    if (todo) {
      setEditingTodo(todo);
      setFormData({
        title: todo.title,
        category: todo.category || '',
        completed: todo.completed,
      });
    } else {
      setEditingTodo(null);
      setFormData({
        title: '',
        category: '',
        completed: false,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTodo(null);
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

  const completedTodos = todos.filter((t) => t.completed);
  const incompleteTodos = todos.filter((t) => !t.completed);

  return (
    <Layout>
      <div className="p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">Todos</h1>
              <p className="text-gray-400">Quick tasks and reminders</p>
            </div>
            <button
              onClick={() => openModal()}
              className="gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2
                       hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              <FiPlus size={20} />
              New Todo
            </button>
          </div>

          {todos.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <p className="text-gray-400 text-lg">No todos yet. Add your first todo!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {incompleteTodos.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-300 mb-4">Active Todos</h2>
                  <div className="space-y-3">
                    {incompleteTodos.map((todo) => (
                      <div
                        key={todo._id}
                        className="glass-card rounded-xl p-4 hover:border-primary-500/50 transition-all animate-slide-in
                                   flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => handleToggleComplete(todo)}
                            className="w-6 h-6 rounded-full border-2 border-gray-400 hover:border-primary-500
                                     transition-colors flex items-center justify-center"
                          >
                            {todo.completed && <FiCheck className="text-primary-500" size={16} />}
                          </button>
                          <div>
                            <h3 className="text-lg text-gray-100">{todo.title}</h3>
                            {todo.category && (
                              <span className="text-xs text-gray-500">{todo.category}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(todo)}
                            className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                          >
                            <FiEdit2 className="text-primary-400" size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(todo._id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="text-red-400" size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedTodos.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-300 mb-4">Completed</h2>
                  <div className="space-y-3">
                    {completedTodos.map((todo) => (
                      <div
                        key={todo._id}
                        className="glass-card rounded-xl p-4 hover:border-primary-500/50 transition-all
                                   flex items-center justify-between opacity-60"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => handleToggleComplete(todo)}
                            className="w-6 h-6 rounded-full border-2 border-primary-500 bg-primary-500
                                     transition-colors flex items-center justify-center"
                          >
                            <FiCheck className="text-white" size={16} />
                          </button>
                          <div>
                            <h3 className="text-lg text-gray-400 line-through">{todo.title}</h3>
                            {todo.category && (
                              <span className="text-xs text-gray-600">{todo.category}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(todo._id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="text-red-400" size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gradient">
                {editingTodo ? 'Edit Todo' : 'New Todo'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                  placeholder="What needs to be done?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category (Optional)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                           text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-500/20 transition-all"
                  placeholder="Personal, Work, etc."
                />
              </div>

              {editingTodo && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={formData.completed}
                    onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="completed" className="text-sm text-gray-300">
                    Mark as completed
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3 rounded-lg
                         hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                {editingTodo ? 'Update Todo' : 'Create Todo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Todos;
