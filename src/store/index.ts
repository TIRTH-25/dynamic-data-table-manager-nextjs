import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import tableReducer from './tableSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

// localStorage
import storage from 'redux-persist/lib/storage'; 

const rootReducer = combineReducers({
  table: tableReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['table'] 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
