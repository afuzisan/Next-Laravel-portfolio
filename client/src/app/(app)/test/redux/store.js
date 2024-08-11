import { configureStore, createSlice } from '@reduxjs/toolkit'
import { counterSlice, counter2Slice } from './slice'

export const { increment } = counterSlice.actions
export const { increment2 } = counter2Slice.actions

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    counter2: counter2Slice.reducer,
  },
})

export default store
