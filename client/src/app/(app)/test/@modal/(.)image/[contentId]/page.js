import Link from 'next/link'
import React from 'react'
import Modal from './daialog'


const Page = ({ params }) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <Link href={`/test/image`}>
        <div>{params.contentId}</div>
      </Link>
    </div>
  )
}

export default Page


