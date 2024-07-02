'use client'

import React, { useEffect, useState } from 'react'
import Memos from '@@/(app)/dashboard/_component/memos.client';
import LinkComponent from '@@/(app)/dashboard/_component/LinkComponent';
import laravelAxios from '@/lib/laravelAxios';

const MemoFetch = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleDelete = (stockCode) => {
        // 削除ロジックをここに追加
        console.log(`削除: ${stockCode}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await initFetch();
                setResult(data);
            } catch (error) {
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
            {result.stocks.slice(0, 6).map((stock, index) => (
                <React.Fragment key={stock.stock_code}>
                    <div className="grid grid-cols-6 border px-3 py-2">
                        <div className="col-span-5 flex items-center">
                            <span className="grid-item px-6">{stock.stock_at_edit}</span>
                            <span className="grid-item px-6">{stock.stock_name}</span>
                            <span className="grid-item px-6">{stock.stock_code}</span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <button className="bg-red-500 text-white px-4 py-2" onClick={() => handleDelete(stock.stock_code)}>{stock.stock_code}を削除</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr_3fr_3fr] h-full">
                        <div className="grid-item p-2 overflow-y-auto h-80 whitespace-break-spaces border-l">
                            <LinkComponent links={result.links} stock={stock.stock_code} />
                        </div>
                        <Memos memos={stock.memos}/>
                        <div className="grid-item pl-2">
                            <img src={`https://www.kabudragon.com/chart/s=${stock.stock_code}`} className="h-full w-full object-scale-down border-r" />
                        </div>
                    </div >
                </React.Fragment>
            ))}
        </>
    )
}
const initFetch = async () => {
    const result = await laravelAxios.get('http://localhost:8080/api/dashboard/reviews', { cache: 'no-cache' });
    return result.data
}
export default MemoFetch