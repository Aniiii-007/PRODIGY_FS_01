import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { FiCheckSquare, FiCalendar, FiList, FiShoppingCart, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasks: 0,
    schedules: 0,
    todos: 0,
    shopping: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [tasksRes, schedulesRes, todosRes, shoppingRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/schedules'),
        axios.get('/api/todos'),
        axios.get('/api/shopping'),
      ]);

      setStats({
        tasks: tasksRes.data.count,
        schedules: schedulesRes.data.count,
        todos: todosRes.data.count,
        shopping: shoppingRes.data.count,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Tasks',
      count: stats.tasks,
      icon: FiCheckSquare,
      color: 'from-blue-500 to-blue-600',
      path: '/tasks',
    },
    {
      title: 'Schedules',
      count: stats.schedules,
      icon: FiCalendar,
      color: 'from-purple-500 to-purple-600',
      path: '/schedules',
    },
    {
      title: 'Todos',
      count: stats.todos,
      icon: FiList,
      color: 'from-green-500 to-green-600',
      path: '/todos',
    },
    {
      title: 'Shopping Lists',
      count: stats.shopping,
      icon: FiShoppingCart,
      color: 'from-orange-500 to-orange-600',
      path: '/shopping',
    },
  ];

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
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-gradient mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">Welcome back! Here's your overview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.path}
                  className="glass-card rounded-xl p-6 hover:scale-105 transition-transform duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-100">
                      {card.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 group-hover:text-primary-400 transition-colors">
                    {card.title}
                  </h3>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-display font-bold text-gray-100 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/tasks"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800 hover:bg-primary-500/10 
                           hover:border-primary-500/50 border border-white/10 transition-all"
                >
                  <FiPlus className="text-primary-400" size={20} />
                  <span className="text-gray-200">Create New Task</span>
                </Link>
                <Link
                  to="/schedules"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800 hover:bg-primary-500/10 
                           hover:border-primary-500/50 border border-white/10 transition-all"
                >
                  <FiPlus className="text-primary-400" size={20} />
                  <span className="text-gray-200">Add Schedule</span>
                </Link>
                <Link
                  to="/todos"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800 hover:bg-primary-500/10 
                           hover:border-primary-500/50 border border-white/10 transition-all"
                >
                  <FiPlus className="text-primary-400" size={20} />
                  <span className="text-gray-200">Add Todo</span>
                </Link>
                <Link
                  to="/shopping"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800 hover:bg-primary-500/10 
                           hover:border-primary-500/50 border border-white/10 transition-all"
                >
                  <FiPlus className="text-primary-400" size={20} />
                  <span className="text-gray-200">Create Shopping List</span>
                </Link>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-display font-bold text-gray-100 mb-4">
                Activity Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Items</span>
                  <span className="text-2xl font-bold text-gray-100">
                    {stats.tasks + stats.schedules + stats.todos + stats.shopping}
                  </span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-sm text-gray-500">
                  You're managing your tasks efficiently! Keep up the great work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
