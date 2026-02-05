import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiShoppingCart } from 'react-icons/fi';

const Shopping = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    items: [{ name: '', quantity: 1, purchased: false }],
  });

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  const fetchShoppingLists = async () => {
    try {
      const response = await axios.get('/api/shopping');
      setShoppingLists(response.data.data);
    } catch (error) {
      toast.error('Error fetching shopping lists');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredItems = formData.items.filter((item) => item.name.trim() !== '');
    
    if (filteredItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      const dataToSend = { ...formData, items: filteredItems };
      if (editingList) {
        await axios.put(`/api/shopping/${editingList._id}`, dataToSend);
        toast.success('Shopping list updated successfully');
      } else {
        await axios.post('/api/shopping', dataToSend);
        toast.success('Shopping list created successfully');
      }
      fetchShoppingLists();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving shopping list');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shopping list?')) {
      try {
        await axios.delete(`/api/shopping/${id}`);
        toast.success('Shopping list deleted successfully');
        fetchShoppingLists();
      } catch (error) {
        toast.error('Error deleting shopping list');
      }
    }
  };

  const handleToggleItem = async (listId, itemId) => {
    try {
      const list = shoppingLists.find((l) => l._id === listId);
      const updatedItems = list.items.map((item) =>
        item._id === itemId ? { ...item, purchased: !item.purchased } : item
      );
      await axios.put(`/api/shopping/${listId}`, {
        ...list,
        items: updatedItems,
      });
      fetchShoppingLists();
    } catch (error) {
      toast.error('Error updating item');
    }
  };

  const openModal = (list = null) => {
    if (list) {
      setEditingList(list);
      setFormData({
        title: list.title,
        items: list.items.length > 0 ? list.items : [{ name: '', quantity: 1, purchased: false }],
      });
    } else {
      setEditingList(null);
      setFormData({
        title: '',
        items: [{ name: '', quantity: 1, purchased: false }],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingList(null);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, purchased: false }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">Shopping Lists</h1>
              <p className="text-gray-400">Organize your shopping needs</p>
            </div>
            <button
              onClick={() => openModal()}
              className="gradient-primary text-white px-6 py-3 rounded-lg flex items-center gap-2
                       hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              <FiPlus size={20} />
              New List
            </button>
          </div>

          {shoppingLists.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <FiShoppingCart className="mx-auto mb-4 text-gray-600" size={64} />
              <p className="text-gray-400 text-lg">No shopping lists yet. Create your first list!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shoppingLists.map((list) => {
                const totalItems = list.items.length;
                const purchasedItems = list.items.filter((item) => item.purchased).length;
                const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;

                return (
                  <div
                    key={list._id}
                    className="glass-card rounded-xl p-6 hover:border-primary-500/50 transition-all animate-slide-in"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-semibold text-gray-100">{list.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(list)}
                          className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="text-primary-400" size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(list._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="text-red-400" size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>{purchasedItems} of {totalItems} items</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {list.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <button
                            onClick={() => handleToggleItem(list._id, item._id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                                     ${item.purchased ? 'border-primary-500 bg-primary-500' : 'border-gray-500'}`}
                          >
                            {item.purchased && <FiCheck className="text-white" size={14} />}
                          </button>
                          <span className={`flex-1 ${item.purchased ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-500">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-2xl w-full animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gradient">
                {editingList ? 'Edit Shopping List' : 'New Shopping List'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <FiX size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">List Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg
                           text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-500/20 transition-all"
                  placeholder="Grocery Shopping, Hardware Store, etc."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-300">Items</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                  >
                    <FiPlus size={16} />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        placeholder="Item name"
                        className="flex-1 px-4 py-2 bg-dark-800 border border-white/10 rounded-lg
                                 text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 
                                 focus:ring-primary-500/20 transition-all"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-20 px-4 py-2 bg-dark-800 border border-white/10 rounded-lg
                                 text-gray-100 focus:border-primary-500 focus:ring-2 
                                 focus:ring-primary-500/20 transition-all"
                      />
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="text-red-400" size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3 rounded-lg
                         hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                {editingList ? 'Update List' : 'Create List'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Shopping;
