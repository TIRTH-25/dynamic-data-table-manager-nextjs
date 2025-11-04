// ColumnManager

'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addColumn, toggleColumnVisibility } from '@/store/tableSlice';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Box, FormControlLabel, Checkbox, List, ListItem, ListItemText
} from '@mui/material';
import { useForm } from 'react-hook-form';

export default function ColumnManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useDispatch();
  const columns = useSelector((s: RootState) => s.table.columns);

  const { register, handleSubmit, reset } = useForm<{ key: string; label: string }>();

  const onSubmit = (data: { key: string; label: string }) => {
    const key = data.key.trim().toLowerCase().replace(/\s+/g, '_');
    if (!key) return;
    dispatch(addColumn({ key, label: data.label.trim() || data.key }));
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={2} display="flex" gap={1}>
          <TextField {...register('key', { required: true })} label="Field Name (e.g., department)" fullWidth />
          <TextField {...register('label')} label="Display Label" fullWidth />
          <Button type="submit" variant="contained">Add</Button>
        </Box>

        <List>
          {Object.entries(columns).map(([k, cfg]) => (
            <ListItem key={k}>
              <ListItemText primary={cfg.label} secondary={k} />
              <FormControlLabel
                control={<Checkbox checked={cfg.visible} onChange={() => dispatch(toggleColumnVisibility(k))} disabled={cfg.fixed} />}
                label={cfg.fixed ? 'fixed' : 'visible'}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
