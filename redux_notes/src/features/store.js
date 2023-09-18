import { configureStore } from '@reduxjs/toolkit';
import npssReducer from './NpssSlice'; // Replace with the correct path to your npssSlice.js

const store = configureStore({
  reducer: {
    npss: npssReducer
    // Add other reducers here if needed
  }
  // Add middleware and other store configuration as needed
});

export default store;