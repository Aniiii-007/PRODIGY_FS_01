const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  purchased: {
    type: Boolean,
    default: false,
  },
});

const shoppingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a shopping list title'],
      trim: true,
    },
    items: [shoppingItemSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Shopping', shoppingSchema);
