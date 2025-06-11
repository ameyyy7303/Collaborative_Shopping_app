const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  bought: {
    type: Boolean,
    default: false,
  },
});

const ShoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [ItemSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
