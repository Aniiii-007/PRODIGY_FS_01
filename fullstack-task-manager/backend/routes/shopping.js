const express = require('express');
const router = express.Router();
const Shopping = require('../models/Shopping');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const shoppingLists = await Shopping.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: shoppingLists.length, data: shoppingLists });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching shopping lists', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shoppingList = await Shopping.findById(req.params.id);
    if (!shoppingList) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }
    if (shoppingList.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: shoppingList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching shopping list', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const shoppingList = await Shopping.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, message: 'Shopping list created successfully', data: shoppingList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating shopping list', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let shoppingList = await Shopping.findById(req.params.id);
    if (!shoppingList) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }
    if (shoppingList.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    shoppingList = await Shopping.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Shopping list updated successfully', data: shoppingList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating shopping list', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const shoppingList = await Shopping.findById(req.params.id);
    if (!shoppingList) {
      return res.status(404).json({ success: false, message: 'Shopping list not found' });
    }
    if (shoppingList.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Shopping.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Shopping list deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting shopping list', error: error.message });
  }
});

module.exports = router;
