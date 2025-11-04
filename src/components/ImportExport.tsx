// src/components/ImportExport.tsx
'use client';
import React, { useState } from 'react';
import { parseCsvFile } from '@/utils/csv';
import { useDispatch, useSelector } from 'react-redux';
import { importData } from '@/store/tableSlice';
import { RootState } from '@/store';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography
} from '@mui/material';

export default function ImportExport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useDispatch();
  const columns = useSelector((s: RootState) => s.table.columns);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    try {
      const rows = await parseCsvFile(file);
      // Validate required columns exist in CSV (based on at least name, email, age, role)
      const sample = rows[0] || {};
      const required = ['name', 'email', 'age', 'role'];
      const missing = required.filter(r => !Object.prototype.hasOwnProperty.call(sample, r));
      if (missing.length > 0) {
        setError(`Missing required columns: ${missing.join(', ')}`);
        return;
      }

      // Ensure dynamic columns are included (add missing props)
      const rowsWithIds = rows.map((r, i) => ({ id: String(Date.now() + i), ...r }));
      dispatch(importData(rowsWithIds));
      setSuccess(`Imported ${rowsWithIds.length} rows`);
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Import CSV</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Upload a CSV file with columns: name, email, age, role (plus optional dynamic columns)
          </Typography>
        </Box>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {error && <Typography color="error" mt={2}>{error}</Typography>}
        {success && <Typography color="primary" mt={2}>{success}</Typography>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
