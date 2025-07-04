const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/ShoppingList');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to check token and set req.userId
function authMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
}

// ✅ Create new shopping list
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const newList = new ShoppingList({
      name,
      owner: req.userId,
      items: [],
      collaborators: [],
    });

    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Add item to a shopping list
router.post('/:listId/items', authMiddleware, async (req, res) => {
  const { name, quantity } = req.body;
  const { listId } = req.params;

  try {
    const list = await ShoppingList.findById(listId);

    if (!list) return res.status(404).json({ error: 'List not found' });
    if (list.owner.toString() !== req.userId &&
        !list.collaborators.includes(req.userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const newItem = {
      name,
      quantity,
      bought: false,
    };

    list.items.push(newItem);
    await list.save();

    // 🔄 Real-time update via socket
    global.io.to(listId).emit('item_added', {
      listId,
      item: list.items[list.items.length - 1],
    });

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Mark item as bought or not bought
router.patch('/:listId/items/:itemId', authMiddleware, async (req, res) => {
  const { listId, itemId } = req.params;
  const { bought } = req.body;

  try {
    const list = await ShoppingList.findById(listId);
    if (!list) return res.status(404).json({ error: 'List not found' });

    if (list.owner.toString() !== req.userId &&
        !list.collaborators.includes(req.userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.bought = bought;
    await list.save();

    // 🔄 Real-time update
    global.io.to(listId).emit('item_updated', {
      listId,
      itemId,
      bought,
    });

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Delete item from a shopping list
router.delete('/:listId/items/:itemId', authMiddleware, async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    const list = await ShoppingList.findById(listId);
    if (!list) return res.status(404).json({ error: 'List not found' });

    if (list.owner.toString() !== req.userId &&
        !list.collaborators.includes(req.userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    list.items = list.items.filter(i => i._id.toString() !== itemId);
    await list.save();

    // 🔄 Real-time update
    global.io.to(listId).emit('item_deleted', {
      listId,
      itemId,
    });

    res.status(200).json({ message: 'Item deleted', list });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

// ✅ Add collaborator to a list
router.post('/:listId/collaborators', authMiddleware, async (req, res) => {
  const { listId } = req.params;
  const { collaboratorId } = req.body;

  try {
    const list = await ShoppingList.findById(listId);
    if (!list) return res.status(404).json({ error: 'List not found' });

    if (list.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only owner can add collaborators' });
    }

    if (list.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ error: 'Collaborator already added' });
    }

    list.collaborators.push(collaboratorId);
    await list.save();

    // (Optional) Emit if you want others to know
    global.io.to(listId).emit('collaborator_added', {
      listId,
      collaboratorId,
    });

    res.status(200).json({ message: 'Collaborator added', list });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
