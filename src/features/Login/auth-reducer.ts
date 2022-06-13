import { Dispatch } from 'redux';
import { setAppStatusAC } from '../../app/app-reducer';
import { authAPI, LoginParamsType } from '../../api/todolists-api';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const loginTC = createAsyncThunk( 'auth/login', async ( param: LoginParamsType, ThunkAPI ) => {
  ThunkAPI.dispatch( setAppStatusAC( { status: 'loading' } ) );
  try {
    const res = await authAPI.login( param );
    if ( res.data.resultCode === 0 ) {

      ThunkAPI.dispatch( setAppStatusAC( { status: 'succeeded' } ) );
      return { isLoggedIn: true };
    } else {
      handleServerAppError( res.data, ThunkAPI.dispatch );
      return { isLoggedIn: false };
    }
  } catch ( error ) {
    // @ts-ignore
    handleServerNetworkError( error, ThunkAPI.dispatch );
    return { isLoggedIn: false };
  }
} );

export const loginTC_ = ( data: LoginParamsType ) => ( dispatch: Dispatch ) => {

};

const slice = createSlice( {
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC( state, action: PayloadAction<{ value: boolean }> ) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    } )
  }
} );

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions;

// thunks

export const logoutTC = () => ( dispatch: Dispatch ) => {
  dispatch( setAppStatusAC( { status: 'loading' } ) );
  authAPI.logout()
    .then( res => {
      if ( res.data.resultCode === 0 ) {
        dispatch( setIsLoggedInAC( { value: false } ) );
        dispatch( setAppStatusAC( { status: 'succeeded' } ) );
      } else {
        handleServerAppError( res.data, dispatch );
      }
    } )
    .catch( ( error ) => {
      handleServerNetworkError( error, dispatch );
    } );
};

