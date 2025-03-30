import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSilce';
import { authApi } from '@/features/api/authApi';
import { coursApi } from '@/features/api/courseApi';

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [coursApi.reducerPath]: coursApi.reducer,  // Fixed variable name
    auth: authReducer
});

export default rootReducer;
