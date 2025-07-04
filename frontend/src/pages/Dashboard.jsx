import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [open, setOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/lists').then(res => setLists(res.data)).catch(() => setLists([]));
  }, []);

  const handleCreateList = async () => {
    if (!newListName) return;
    const res = await api.post('/lists', { name: newListName });
    setLists([...lists, res.data]);
    setOpen(false);
    setNewListName('');
  };

  return (
    <>
      <Navbar />
      <Box p={3} maxWidth={600} mx="auto">
        <Typography variant="h4" mb={2}>Welcome, {user?.username}!</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
          Create New List
        </Button>
        <Paper>
          <List>
            {lists.map(list => (
              <ListItem button key={list._id} onClick={() => navigate(`/lists/${list._id}`)}>
                <ListItemText primary={list.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create Shopping List</DialogTitle>
          <DialogContent>
            <TextField
              label="List Name"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateList} variant="contained">Create</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
} 