import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Row, ColumnConfig } from '@/types';

export interface TableState {
  data: Row[];
  columns: Record<string, ColumnConfig>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  currentPage: number;
  rowsPerPage: number;
}

const initialRows: Row[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', age: 26, role: 'Developer' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', age: 35, role: 'Designer' },
  { id: '6', name: 'Diana Prince', email: 'diana@example.com', age: 29, role: 'Developer' },
  { id: '7', name: 'Edward Norton', email: 'edward@example.com', age: 41, role: 'Manager' },
  { id: '8', name: 'Fiona Green', email: 'fiona@example.com', age: 27, role: 'Designer' },
  { id: '9', name: 'George Miller', email: 'george@example.com', age: 38, role: 'Developer' },
  { id: '10', name: 'Hannah Lee', email: 'hannah@example.com', age: 31, role: 'Designer' },
  { id: '11', name: 'Ian Malcolm', email: 'ian@example.com', age: 44, role: 'Manager' },
  { id: '12', name: 'Julia Roberts', email: 'julia@example.com', age: 30, role: 'Developer' }
];

const initialColumns: Record<string, ColumnConfig> = {
  name: { label: 'Name', visible: true, fixed: true },
  email: { label: 'Email', visible: true, fixed: true },
  age: { label: 'Age', visible: true, fixed: true },
  role: { label: 'Role', visible: true, fixed: true }
};

const initialState: TableState = {
  data: initialRows,
  columns: initialColumns,
  sortBy: 'name',
  sortOrder: 'asc',
  searchQuery: '',
  currentPage: 0,
  rowsPerPage: 10
};

const slice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Row[]>) {
      state.data = action.payload;
    },
    importData(state, action: PayloadAction<Row[]>) {
      state.data = action.payload;
    },
    addColumn(state, action: PayloadAction<{ key: string; label: string }>) {
      const { key, label } = action.payload;
      if (!state.columns[key]) {
        state.columns[key] = { label, visible: true, fixed: false };
        // add empty field on existing rows
        state.data = state.data.map(r => ({ ...r, [key]: r[key] ?? '' }));
      }
    },
    toggleColumnVisibility(state, action: PayloadAction<string>) {
      const k = action.payload;
      if (state.columns[k] && !state.columns[k].fixed) {
        state.columns[k].visible = !state.columns[k].visible;
      }
    },
    setSortBy(state, action: PayloadAction<string>) {
      const key = action.payload;
      if (state.sortBy === key) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = key;
        state.sortOrder = 'asc';
      }
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 0;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
      state.currentPage = 0;
    }
  }
});

export const {
  setData,
  importData,
  addColumn,
  toggleColumnVisibility,
  setSortBy,
  setSearchQuery,
  setCurrentPage,
  setRowsPerPage
} = slice.actions;

export default slice.reducer;
