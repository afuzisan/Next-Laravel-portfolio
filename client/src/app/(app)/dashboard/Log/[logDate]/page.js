import React from 'react'
// import { useRouter } from 'next/router'

const Page = ({ params }) => {
    console.log('aaaaa')
    console.log(params.logDate)
    return (
        <div>page: {params.logDate}</div>
    );
}

export default Page