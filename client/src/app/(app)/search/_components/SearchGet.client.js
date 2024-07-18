'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import laravelAxios from '@/lib/laravelAxios';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const SearchGet = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState([]) // stateを追加

    useEffect(() => {
        const search = searchParams.get('search')
        const searchType = searchParams.get('searchType')
        laravelAxios.get(`http://localhost:8080/api/search/memo`)
            .then(response => {
                console.log(search, searchType, response.data)
                setData(response.data) // stateにデータをセット
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, [searchParams])

    return (
        <div>
            <h1>SearchGet</h1>
            <ul>
                {data.map((item, index) => (
                    <>
                        <li key={index}>{item.memo_title}</li>
                        <li key={index}>
                            <Editor
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(item.memo)))}
                                readOnly={true}
                            />
                        </li>
                    </>
                ))}
            </ul>
        </div>
    )
}

export default SearchGet