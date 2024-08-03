'use client'

import React from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store, { increment, increment2 } from './store'

const Test = () => {
  const count = useSelector((state) => state.counter2.count)

  return (
    <div>
      {count}
    </div>
  )
}

export default Test