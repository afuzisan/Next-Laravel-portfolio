'use client'

import React, { useState } from 'react'

const Data = ({ result }) => {
  console.log(result);
  const [state, setState] = useState(result);

  // resultがオブジェクトであることを前提として、特定のプロパティを表示
  return (
    <div>
      {state && (
        <>
          {state[0].memo && <p>Title: {state[0].memo}</p>}
        </>
      )}
    </div>
  )
}

export default Data