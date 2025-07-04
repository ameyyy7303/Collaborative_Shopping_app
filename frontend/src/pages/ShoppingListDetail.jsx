import React, { useEffect, useState, useRef } from 'react';

import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Checkbox, TextField, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export default function ShoppingListDetail() {
  const { listId } = useParams();
  const { user } = useAuth();
  const [list, setList] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [collabOpen, setCollabOpen] = useState(false);
  const [collaboratorId, setCollaboratorId] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    api.get(`/lists/${listId}`).then(res => setList(res.data));
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join_list', listId);
    socketRef.current.on('item_added', ({ item }) => {
      setList(prev => ({ ...prev, items: [...prev.items, item] }));
    });
    socketRef.current.on('item_updated', ({ itemId, bought }) => {
      setList(prev => ({
        ...prev,
        items: prev.items.map(i => i._id === itemId ? { ...i, bought } : i)
      }));
    });
    socketRef.current.on('item_deleted', ({ itemId }) => {
      setList(prev => ({
        ...prev,
        items: prev.items.filter(i => i._id !== itemId)
      }));
    });
    socketRef.current.on('collaborator_added', ({ collaboratorId }) => {
      setList(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, collaboratorId]
      }));
    });
    return () => socketRef.current.disconnect();
  }, [listId]);

  const handleAddItem = async () => {
    if (!newItem) return;
    await api.post(`/lists/${listId}/items`, { name: newItem, quantity });
    setNewItem('');
    setQuantity(1);
  };

  const handleToggleBought = async (item) => {
    await api.patch(`/lists/${listId}/items/${item._id}`, { bought: !item.bought });
  };

  const handleDeleteItem = async (item) => {
    await api.delete(`/lists/${listId}/items/${item._id}`);
  };

  const handleAddCollaborator = async () => {
    await api.post(`/lists/${listId}/collaborators`, { collaboratorId });
    setCollabOpen(false);
    setCollaboratorId('');
  };

  if (!list) return <Typography>Loading...</Typography>;

  const isOwner = list.owner === user?.id || list.owner === user?._id;
  const canEdit = isOwner || (list.collaborators && list.collaborators.includes(user?.id));

  return (
    <>
      <Navbar />
      <Box p={3} maxWidth={600} mx="auto">
        <Typography variant="h4" mb={2}>{list.name}</Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="Item"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            size="small"
            sx={{ mr: 1 }}
            disabled={!canEdit}
          />
          <TextField
            label="Qty"
            type="number"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            size="small"
            sx={{ width: 80, mr: 1 }}
            disabled={!canEdit}
          />
          <IconButton color="primary" onClick={handleAddItem} disabled={!canEdit}>
            <AddIcon />
          </IconButton>
          {isOwner && (
            <IconButton color="secondary" onClick={() => setCollabOpen(true)}>
              <PersonAddIcon />
            </IconButton>
          )}
        </Box>
        <Paper>
          <List>
            {list.items.map(item => (
              <ListItem key={item._id} secondaryAction={canEdit && (
                <IconButton edge="end" onClick={() => handleDeleteItem(item)}>
                  <DeleteIcon />
                </IconButton>
              )}>
                <Checkbox checked={item.bought} onChange={() => handleToggleBought(item)} disabled={!canEdit} />
                <ListItemText
                  primary={item.name}
                  secondary={`Qty: ${item.quantity}`}
                  sx={{ textDecoration: item.bought ? 'line-through' : 'none' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Dialog open={collabOpen} onClose={() => setCollabOpen(false)}>
          <DialogTitle>Add Collaborator</DialogTitle>
          <DialogContent>
            <TextField
              label="Collaborator User ID"
              value={collaboratorId}
              onChange={e => setCollaboratorId(e.target.value)}
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCollabOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCollaborator} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
} 