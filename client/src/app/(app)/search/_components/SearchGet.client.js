'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import laravelAxios from '@/lib/laravelAxios';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

const convertMemoToText = (memo) => {
    const contentState = convertFromRaw(JSON.parse(memo));
    const blocks = convertToRaw(contentState).blocks;
    return blocks.map(block => block.text).join(' ');
};

const SearchGet = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState([]) // stateを追加
    const [search, setSearch] = useState(searchParams.get('search') || '');

    useEffect(() => {
        setSearch(searchParams.get('search'));
        const searchType = searchParams.get('searchType');
        laravelAxios.get(`http://localhost:8080/api/search/memo`)
            .then(response => {
                console.log(search, searchType, response.data);
                setData(response.data); // stateにデータをセット
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [searchParams]);

    return (
        <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.filter(item => item.memo && convertMemoToText(item.memo).includes(search)).map((item, index) => (
                    <div key={index} className="border mb-4 p-4 rounded shadow grid grid-rows-[auto,auto,200px,1fr] gap-2 h-[600px]">
                        <div className="mb-2">
                            <span className="font-bold">{item.stock.stock_name}({item.stock.stock_code})</span>
                        </div>
                        <div className="mb-2">
                            <span className="">{item.memo_title}</span>
                        </div>
                        <img className="w-full h-auto mt-2" src={`https://www.kabudragon.com/chart/s=${item.stock.stock_code}`} alt="Stock Image" />
                        <div className="mb-2 flex-grow overflow-y-scroll">
                            <Editor
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(item.memo)))}
                                readOnly={true}
                            />
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default SearchGet