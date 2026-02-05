import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiClock, FiMapPin } from 'react-icons/fi';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data.data);
    } catch (error) {
      toast.error('Error fetching schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await axios.put(`/api/schedules/${editingSchedule._id}`, formData);
        toast.success('Schedule updated successfully');
      } else {
        await axios.post('/api/schedules', formData);
        toast.success('Schedule created successfully');
      }
      fetchSchedules();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving schedule');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await axios.delete(`/api/schedules/${id}`);
        toast.success('Schedule deleted successfully');
        fetchSchedules();
      } catch (error) {
        toast.error('Error deleting schedule');
      }
    }
  };

  const openModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        title: schedule.title,
        description: schedule.description || '',
        startTime: schedule.startTime ? new Date(schedule.startTime).toISOString().slice(0, 16) : '',
        endTime: schedule.endTime ? new Date(schedule.endTime).toISOString().slice(0, 16) : '',
        location: schedule.location || '',
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">Schedules</h1>
              <p className="text-gray-400">Plan and manage your events</p>
            </div>
            <button
              onClick={() => openModal()}
              className="gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2
                       hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              <FiPlus size={20} />
              New Schedule
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <p className="text-gray-400 text-lg">No schedules yet. Add your first event!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className="glass-card rounded-xl p-6 hover:border-primary-500/50 transition-all animate-slide-in"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-100 mb-2">{schedule.title}</h3>
                      {schedule.description && (
                        <p className="text-gray-400 mb-4">{schedule.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-primary-400" />
                          <span>{formatDateTime(schedule.startTime)} - {formatDateTime(schedule.endTime)}</span>
                        </div>
                        {schedule.location && (
                          <div className="flex items-center gap-2">
                            <FiMapPin className="text-primary-400" />
                            <span>{schedule.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(schedule)}
                        className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="text-primary-400" size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="text-red-400" size={18} />
                      </button>
                    </div>
                  </div>
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
                {editingSchedule ? 'Edit Schedule' : 'New Schedule'}
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
                  placeholder="Meeting, Event, etc."
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
                  placeholder="Event description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                             text-gray-100 focus:border-primary-500 focus:ring-2 
                             focus:ring-primary-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                             text-gray-100 focus:border-primary-500 focus:ring-2 
                             focus:ring-primary-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                           text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-500/20 transition-all"
                  placeholder="Event location"
                />
              </div>

              <button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3 rounded-lg
                         hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Schedules;
