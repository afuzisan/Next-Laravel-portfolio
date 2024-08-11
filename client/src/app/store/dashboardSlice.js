import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  inputValue: '',
  refreshKey: 0,
  errorMessage: '',
  sortOrder: 'dateDesc',
  currentPage: 0,
  itemsPerPage: 10,
  result: null,
  totalStockCount: 0,
  activeTab: 'stockList',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setInputValue: (state, action) => {
      state.inputValue = action.payload
    },
    setRefreshKey: (state, action) => {
      state.refreshKey = action.payload
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload
    },
    setResult: (state, action) => {
      state.result = action.payload
    },
    setTotalStockCount: (state, action) => {
      state.totalStockCount = action.payload
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
  },
})

export const {
  setInputValue,
  setRefreshKey,
  setErrorMessage,
  setSortOrder,
  setCurrentPage,
  setItemsPerPage,
  setResult,
  setTotalStockCount,
  setActiveTab,
} = dashboardSlice.actions

export default dashboardSlice.reducer
