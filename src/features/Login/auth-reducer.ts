import { setAppStatusAC } from '../../app/app-reducer';
import { authAPI, FieldErrorType, LoginParamsType } from '../../api/todolists-api';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>( 'auth/login', async ( param, ThunkAPI ) => {
  ThunkAPI.dispatch( setAppStatusAC( { status: 'loading' } ) );
  try {
    const res = await authAPI.login( param );
    if ( res.data.resultCode === 0 ) {
      ThunkAPI.dispatch( setAppStatusAC( { status: 'succeeded' } ) );
    } else {
      handleServerAppError( res.data, ThunkAPI.dispatch );
      return ThunkAPI.rejectWithValue( { errors: res.data.messages, fieldsErrors: res.data.fieldsErrors } );
    }
  } catch ( err ) {
    // @ts-ignore
    const error: AxiosError = err;
    handleServerNetworkError( error, ThunkAPI.dispatch );
    return ThunkAPI.rejectWithValue( { errors: [ error.message ], fieldsErrors: undefined } );
  }
} );
export const logoutTC = createAsyncThunk( 'auth/logout', async ( param, ThunkAPI ) => {
  ThunkAPI.dispatch( setAppStatusAC( { status: 'loading' } ) );
  const res = await authAPI.logout();
  try {
    if ( res.data.resultCode === 0 ) {
      ThunkAPI.dispatch( setAppStatusAC( { status: 'succeeded' } ) );
    } else {
      handleServerAppError( res.data, ThunkAPI.dispatch );
      return ThunkAPI.rejectWithValue( {} );
    }
  } catch ( err ) {
    // @ts-ignore
    const error: AxiosError = err;
    handleServerNetworkError( error, ThunkAPI.dispatch );
  }
} );

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
    builder.addCase( loginTC.fulfilled, ( state ) => {
      state.isLoggedIn = true;
    } );
    builder.addCase( logoutTC.fulfilled, ( state ) => {
      state.isLoggedIn = false;
    } );
  },
} );

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions;
