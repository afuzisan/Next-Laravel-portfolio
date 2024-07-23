import Link from 'next/link'
import React from 'react'

const Page = ({ params }) => {
  return (
    <Link href={`/test/image`}>
      <div>params.contentId</div>
      <div>{params.contentId}</div>
    </Link>
  )
}

export default Page