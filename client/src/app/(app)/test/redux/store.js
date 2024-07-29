import { createStore } from 'redux';

// 初期状態
const initialState = {
    count: 0
};

// リデューサー
function counterReducer(state = initialState, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        default:
            return state;
    }
}

// ストア作成
const store = createStore(counterReducer);

export default store;
