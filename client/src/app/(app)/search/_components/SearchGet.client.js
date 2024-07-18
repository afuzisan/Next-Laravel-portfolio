'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SearchGet = () => {
    const searchParams = useSearchParams()

    useEffect(() => {
        const search = searchParams.get('search')
        const searchType = searchParams.get('searchType')
        // if (searchType === 'memo') {
        //     LaravelAxios.get(`http://localhost:8080/api/search/${search}`)
        // } else if (searchType === 'stock') {
        //     LaravelAxios.get(`http://localhost:8080/api/search/${search}`)
        // }
        console.log(search, searchType)
    }, [searchParams])



    return (
        <div>SearchGet</div>
    )
}

export default SearchGet