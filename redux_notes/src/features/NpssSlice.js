import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getBeneficiaryList } from 'services/NpssServices';

// NpssSlice.js

const initialState = {
  beneficiaries: [],
  loading: false,
  error: null,
  selectedAccount: null, // Initial state for selected account
  bitzToken: '',
  beneficiaryList: [],
  accounts: []
};

export const GetBeneficiaryList = createAsyncThunk('npss/getBeneficiaryList', async () => {
  const response = await getBeneficiaryList();
  return response.data; // Assuming the API response contains the list of beneficiaries
});

const NpssSlice = createSlice({
  name: 'npss',
  initialState,
  reducers: {
    setSelectedAcc: (state, action) => {
      state.selectedAccount = action.payload;
    },
    setBitz: (state, action) => {
      state.bitzToken = action.payload;
    },
    setBeneficiariesList: (state, action) => {
      state.beneficiaryList = action.payload;
    },
    getAccounts: (state, action) => {
      state.accounts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetBeneficiaryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetBeneficiaryList.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries = action.payload;
      })
      .addCase(GetBeneficiaryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const selectedFundingAccount = (state) => state.npss.selectedAccount;
export const selectBitzToken = (state) => state.npss.bitzToken;
export const selectBeneficiariesList = (state) => state.npss.beneficiaryList;
export const selectGetAllAccounts = (state) => state.npss.accounts;

export const { setSelectedAcc, setBitz, setBeneficiariesList, getAccounts } = NpssSlice.actions;
export default NpssSlice.reducer;