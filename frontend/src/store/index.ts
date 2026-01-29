import { configureStore } from '@reduxjs/toolkit';
import meReducer from './slices/me.slice';

export const store = configureStore({
  reducer: {
    me: meReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
