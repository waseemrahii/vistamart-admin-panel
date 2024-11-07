// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../../utils/axiosConfig'; 
// import apiConfig from '../../../config/apiConfig';  
// import { saveAuthData, getAuthData, clearAuthData } from '../../../utils/authHelper';
// // Initial state
// const initialState = {
//   isLoggedIn: false,
//   user: null,
//   error: null,
//   token: null,
//   loading: false, // Add loading state
// };

// // Async thunk for login
// export const login = createAsyncThunk(
//   'auth/login',
//   async ({ email, password, role }, thunkAPI) => {
//     try {
//       // Get API endpoint based on role from apiConfig
//       const apiEndpoint = apiConfig[role] || apiConfig.admin;

//       // Use axiosInstance for login request
//       const response = await axiosInstance.post(`${apiEndpoint}/employees/login`, { email, password });
//       const { accessToken, user } = response.data;

//       // Save token and user data using the helper
//       saveAuthData(role, accessToken, user);
      
//       return { token: accessToken, user, role }; // Return role for further usage
//     } catch (error) {

//       console.error('Login error:', error.response?.data || error.message);
//       return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred during login.');
//     }
//   }
// );

// // Auth slice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout: (state, action) => {
//       // Clear localStorage and reset state based on role using the helper
//       clearAuthData(action.payload);
//       state.isLoggedIn = false;
//       state.user = null;
//       state.token = null;
//       state.error = null;
//       state.loading = false; // Reset loading on logout
//     },
//     setAuthToken: (state, action) => {
//       // Set token in state and localStorage
//       state.token = action.payload;
//       localStorage.setItem('token', action.payload);
//     },
//     checkAuth: (state, action) => {
//       const { token, user } = getAuthData(action.payload);
      
//       if (token) {
//         state.isLoggedIn = true;
//         state.user = user;
//         state.token = token;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true; // Set loading to true when login starts
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoggedIn = true;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.error = null;
//         state.loading = false; // Reset loading to false when login succeeds
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.error = action.payload;
//         state.loading = false; // Reset loading to false when login fails
//       });
//   },
// });

// // Selectors
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectUser = (state) => state.auth.user;
// export const selectToken = (state) => state.auth.token;
// export const selectAuthError = (state) => state.auth.error;
// export const selectAuthLoading = (state) => state.auth.loading; // New loading state selector

// // Export actions and reducer
// export const { logout, setAuthToken, checkAuth } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosConfig';
import apiConfig from '../../../config/apiConfig';
import { saveAuthData, clearAuthData } from '../../../utils/authHelper';

// Initial state
const initialState = {
    isLoggedIn: false,
    user: null,
    error: null,
    token: null,
    loading: false,
};

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password, role }, thunkAPI) => {
        try {
            const apiEndpoint = apiConfig[role] || apiConfig.admin;
            const response = await axiosInstance.post(`${apiEndpoint}/employees/login`, { email, password });
            const { accessToken, user } = response.data;
            saveAuthData(accessToken, user); // Save the token and user to local storage
            console.log('user and token', accessToken )
            console.log('user and token', user)
            return { token: accessToken, user };
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred during login.');
        }
    }
);

// Check auth status (modified to not alter state on refresh)
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        // Return token and user without updating state
        return { token, user: user ? JSON.parse(user) : null };
    }
);

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            clearAuthData(); // Clear the authentication data
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true; // Set loading state to true when login is pending
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true; // User is logged in
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null; // Clear any previous errors
                state.loading = false; // Set loading state to false
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload; // Set error message
                state.loading = false; // Set loading state to false
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                if (action.payload && action.payload.user) {
                    // Update state if user is found
                    state.isLoggedIn = true;
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                }
            });
    },
});

// Selectors
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.loading;

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
