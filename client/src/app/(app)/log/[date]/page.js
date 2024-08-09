import React from 'react'
import { useRouter } from 'next/router'

const Page = ({ params }) => {
    return (
        <div>page: {params.date}</div>
    )
}

export default Page