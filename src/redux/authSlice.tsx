import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Auth {
    apiKey: string;
    isAuthorized: boolean;
}


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        apiKey: '',
        isAuthorized: false,
    } as Auth,
    reducers: {
        setAuth: (state, action) => {
            const { apiKey, isAuthorized } = action.payload
            state.apiKey = apiKey
            state.isAuthorized = isAuthorized
        },
    },
});

export const selectAuth = (state: RootState) => state.auth

// Export the slice's reducer and actions
export const { setAuth } = authSlice.actions;
export default authSlice.reducer;