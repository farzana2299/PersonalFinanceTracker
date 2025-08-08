import { createSlice } from "@reduxjs/toolkit";

const financeOverviewSlice = createSlice({
  name: "bargraph",
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBargraph: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

export const { setBargraph, setLoading } = financeOverviewSlice.actions;
export default financeOverviewSlice.reducer;
