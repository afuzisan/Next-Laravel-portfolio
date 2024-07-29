'use client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';

function ReduxTest() {
    const count = useSelector((state) => state.count);
    const dispatch = useDispatch();

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
        </div>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <ReduxTest />
        </Provider>
    );
}