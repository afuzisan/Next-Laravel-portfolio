import { createSlice } from '@reduxjs/toolkit';

const memoSlice = createSlice({
  name: 'memo',
  initialState: {
    memoList: []
  },
  reducers: {
    setMemoList: (state, action) => {
      state.memoList = action.payload;
    }
  }
});

export const { setMemoList } = memoSlice.actions;
export default memoSlice.reducer;