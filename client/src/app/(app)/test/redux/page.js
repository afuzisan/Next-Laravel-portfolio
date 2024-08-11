'use client'

import { Provider, useDispatch, useSelector } from 'react-redux'
import store, { increment, increment2 } from './store'
import Test2 from '@/app/(app)/test/redux/Test2'
import Test from '@/app/(app)/test/redux/Test'

function ReduxTest() {
  const count = useSelector(state => state.counter.count)
  const count2 = useSelector(state => state.counter2.count)
  const dispatch = useDispatch()

  return (
    <div>
      <p>Count 1: {count}</p>
      <p>Count 2: {count2}</p>
      <button onClick={() => dispatch(increment())}>Increment 1</button>
      <button onClick={() => dispatch(increment2())}>Increment 2</button>
    </div>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <ReduxTest />
      <Test2 />
      <Test />
    </Provider>
  )
}
