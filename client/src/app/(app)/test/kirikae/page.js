'use client'

import React, { useState } from 'react'
import Layout1 from './Layout1'
import Layout2 from './Layout2'

const Page = () => {
  const [layout, setLayout] = useState('layout1')

  const toggleLayout = () => {
    setLayout(prevLayout => (prevLayout === 'layout1' ? 'layout2' : 'layout1'))
  }

  return (
    <div>
      {layout === 'layout1' ? <Layout1 /> : <Layout2 />}
      <button onClick={toggleLayout}>Toggle Layout</button>
    </div>
  )
}

export default Page
