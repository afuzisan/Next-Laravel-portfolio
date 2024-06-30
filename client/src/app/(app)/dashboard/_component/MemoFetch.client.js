'use client'

import React, { useEffect, useState } from 'react'
import Memos from '@@/(app)/dashboard/_component/memos.client';
import LinkComponent from '@@/(app)/dashboard/_component/LinkComponent';
import laravelAxios from '@/lib/laravelAxios';

const MemoFetch = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await initFetch();
                console.log(data)
                setResult(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError(error);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <div>Error loading data</div>;
    }

    if (!result) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {result.stocks.slice(0, 8).map((stock, index) => (
                <>
                    <div className="grid grid-cols-6 border ">
                        <div className="col-span-5 ">
                            <span className="grid-item px-6">{stock.stock_at_edit}</span>
                            <span className="grid-item px-6">{stock.stock_name}</span>
                            <span className="grid-item px-6">{stock.stock_code}</span>
                        </div>
                        <div className="col-span-1 "> {/* 空のグリッドセル */}</div>
                    </div>
                    <div className="grid grid-cols-[1fr_3fr_1fr_3fr] h-full">
                        <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                            <LinkComponent links={result.links} stock={stock.stock_code} />
                        </div>
                        <div className="grid-item p-4">
                            <img src={`https://www.kabudragon.com/chart/s=${stock.stock_code}`} className="h-full w-full object-scale-down" />
                        </div>
                        <Memos memos={stock.memos}/>

                    </div >
                </>
            ))}
        </>
    )
}
const initFetch = async () => {
    const result = await laravelAxios.get('http://localhost:8080/api/dashboard/reviews', { cache: 'no-cache' });
    return result.data
}
export default MemoFetch