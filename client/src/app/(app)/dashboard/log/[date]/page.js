import React from 'react'
import { useRouter } from 'next/router'

const Page = ({ params }) => {
    console.log('aaaaa')
    console.log(params)
    return (
        <div>page: {params.date}</div>
    )
}

export default Page