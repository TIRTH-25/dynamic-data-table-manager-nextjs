// src/components/DataTable.tsx
'use client';
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {
  setSortBy, setSearchQuery, setCurrentPage, setRowsPerPage
} from '@/store/tableSlice';
import {
  Paper, Box, Typography, TextField, IconButton, Button, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel,
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ColumnManager from './ColumnManager';
import ImportExport from './ImportExport';
import { exportRowsToCsv } from '@/utils/csv';

export default function DataTable() {
  const dispatch = useDispatch();
  const table = useSelector((s: RootState) => s.table);

  const [columnModalOpen, setColumnModalOpen] = React.useState(false);
  const [importModalOpen, setImportModalOpen] = React.useState(false);

  const visibleColumns = useMemo(() => {
    return Object.entries(table.columns)
      .filter(([, c]) => c.visible)
      .map(([k, c]) => ({ key: k, label: c.label }));
  }, [table.columns]);

  const filtered = useMemo(() => {
    const q = table.searchQuery.trim().toLowerCase();
    let arr = table.data;
    if (q) {
      arr = arr.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      );
    }
    // sort
    const sBy = table.sortBy;
    const order = table.sortOrder;
    arr = [...arr].sort((a, b) => {
      const av = a[sBy];
      const bv = b[sBy];
      const aStr = String(av ?? '').toLowerCase();
      const bStr = String(bv ?? '').toLowerCase();
      if (!isNaN(Number(aStr)) && !isNaN(Number(bStr))) {
        return order === 'asc' ? Number(aStr) - Number(bStr) : Number(bStr) - Number(aStr);
      }
      if (aStr < bStr) return order === 'asc' ? -1 : 1;
      if (aStr > bStr) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [table]);

  const pageStart = table.currentPage * table.rowsPerPage;
  const paginated = filtered.slice(pageStart, pageStart + table.rowsPerPage);

  const handleSort = (colKey: string) => {
    dispatch(setSortBy(colKey));
  };

  const handleExport = () => {
    // Only include visible columns
    const rows = filtered.map(r => {
      const out: Record<string, any> = {};
      visibleColumns.forEach(c => out[c.label] = r[c.key]);
      return out;
    });
    exportRowsToCsv(rows, 'table-export.csv');
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6">Dynamic Data Table Manager</Typography>
          <Typography variant="body2" color="textSecondary">Next.js + Redux Toolkit + MUI + TypeScript</Typography>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Search across all fields..."
            value={table.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            InputProps={{
              startAdornment: <SearchIcon />
            }}
          />
          <Button variant="contained" startIcon={<ViewColumnIcon />} onClick={() => setColumnModalOpen(true)}>
            Manage Columns
          </Button>
          <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => setImportModalOpen(true)}>
            Import CSV
          </Button>
          <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export CSV
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map(col => (
                <TableCell key={col.key} sortDirection={table.sortBy === col.key ? table.sortOrder : false}>
                  <TableSortLabel
                    active={table.sortBy === col.key}
                    direction={table.sortBy === col.key ? table.sortOrder : 'asc'}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map(row => (
              <TableRow key={row.id}>
                {visibleColumns.map(col => (
                  <TableCell key={col.key}>{row[col.key]}</TableCell>
                ))}
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center">
                  No data found — try importing CSV or adjust search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2">
          Showing {pageStart + 1} to {Math.min(pageStart + table.rowsPerPage, filtered.length)} of {filtered.length} entries
        </Typography>

        <TablePagination
          component="div"
          count={filtered.length}
          page={table.currentPage}
          onPageChange={(_, newPage) => dispatch(setCurrentPage(newPage))}
          rowsPerPage={table.rowsPerPage}
          onRowsPerPageChange={(e) => dispatch(setRowsPerPage(Number(e.target.value)))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      <ColumnManager open={columnModalOpen} onClose={() => setColumnModalOpen(false)} />
      <ImportExport open={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </Paper>
  );
}
