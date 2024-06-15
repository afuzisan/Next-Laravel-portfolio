'use client'

import React, { useState } from 'react'

const Data = ({ result }) => {
  console.log(result,result.memos[0].memo);
  const [state, setState] = useState(result);

  // resultがオブジェクトであることを前提として、特定のプロパティを表示
  return (
    <div>
      {state && (
        <>

        </>
      )}
    </div>
  )
}

export default Data