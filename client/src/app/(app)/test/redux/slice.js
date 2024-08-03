import { configureStore, createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        count: 0
    },
    reducers: {
        increment: (state) => {
            state.count += 1;
        }
    }
});

export const counter2Slice = createSlice({
    name: 'counter2',
    initialState: {
        count: 1
    },
    reducers: {
        increment2: (state) => {
            state.count += 2
        }
    }
});