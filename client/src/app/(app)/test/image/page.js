import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className="flex justify-center min-h-screen h-[800px] w-full">
      <div class="parent grid grid-cols-[200px_200px_200px_200px_200px_200px] grid-rows-[60px_100px_100px_120px_100px_100px] gap-0">
        <div class="div1 col-start-2 col-end-7 row-start-1 row-end-2 bg-blue-500 border border-black">aaaaaaa</div>
        <div class="div2 col-start-2 col-end-7 row-start-2 row-end-4 bg-blue-500 border border-black"> bbbbbbbb</div>
        <div class="div3 col-start-2 col-end-7 row-start-4 row-end-7 border border-black">ccccccccc </div>
        <div class="div4 col-start-1 col-end-2 row-start-1 row-end-7 border border-black"> ddddddddd</div>
      </div>
    </div>
  )
}

export default Page