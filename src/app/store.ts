import { tasksReducer } from '../features/TodolistsList/tasks-reducer';
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer';
import { combineReducers } from 'redux';
import { appReducer } from './app-reducer';
import { authReducer } from '../features/Login/auth-reducer';
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { useDispatch } from 'react-redux';

const rootReducer = combineReducers( {
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
} );

export const store = configureStore( {
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend( thunkMiddleware ),

} );

export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatchType>();

// @ts-ignore
window.store = store;
