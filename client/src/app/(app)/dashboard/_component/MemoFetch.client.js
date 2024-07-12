'use client'

import React, { useEffect, useState, createContext, useContext } from 'react'
import Memos from '@@/(app)/dashboard/_component/memos.client';
import LinkComponent from '@@/(app)/dashboard/_component/LinkComponent';
import laravelAxios from '@/lib/laravelAxios';

function formatDateToISO(date) {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());

    return `${year}-${month}-${day}`;
}

// 編集可能か判定するコンテキストを作成
export const EditableContext = createContext();

const MemoFetch = ({ refreshKey, sortOrder, currentPage, itemsPerPage, setItemsPerPage, onDataFetched, param, setTotalStockCount }) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [MemoRefreshKey, setMemoRefreshKey] = useState(0);
    const [isEditable, setIsEditable] = useState(true);

    const handleDelete = (stockCode) => {
        if (window.confirm(`${stockCode}を本当に削除しますか？`)) {
            laravelAxios.post('http://localhost:8080/api/dashboard/stockDelete', {
                stockNumber: stockCode
            })
                .then(() => {
                    refreshKey();
                })
                .catch(error => {
                    console.error('Error deleting stock:', error);
                });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await initFetch(currentPage, itemsPerPage, setTotalStockCount); // ページ番号を渡す
                console.log(data);

                // ソート処理を追加
                if (sortOrder === 'dateDesc') {
                    data.stocks.sort((a, b) => new Date(b.memos[0].created_at) - new Date(a.memos[0].created_at));
                } else if (sortOrder === 'dateAsc') {
                    data.stocks.sort((a, b) => new Date(a.memos[0].created_at) - new Date(b.memos[0].created_at));
                } else if (sortOrder === 'codeDesc') {
                    data.stocks.sort((a, b) => b.stock_code.localeCompare(a.stock_code));
                } else if (sortOrder === 'codeAsc') {
                    data.stocks.sort((a, b) => a.stock_code.localeCompare(b.stock_code));
                }

                setResult(data);
                onDataFetched(data); // 親コンポーネントにデータを渡す

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            }

        };
        fetchData();
    }, [MemoRefreshKey, sortOrder, currentPage, param]); // paramを依存に追加

    if (error) {
        return <div>Error loading data</div>;
    }

    if (!result) {
        return <div>Loading...</div>;
    }

    return (
        <EditableContext.Provider value={[isEditable, setIsEditable]}>
            {result && result.stocks && result.stocks.length > 0 ? (
                result.stocks.map((stock, index) => (
                    <React.Fragment key={stock.stock_code}>
                        <div className="grid grid-cols-6 border px-3 py-2">
                            <div className="col-span-5 flex items-center">
                                <span className="grid-item px-6">
                                    {stock.memos.length > 0 ? formatDateToISO(new Date(stock.memos[0].created_at)) : 'N/A'}
                                </span>
                                <span className="grid-item px-6">{stock.stock_name}</span>
                                <span className="grid-item px-6">{stock.stock_code}</span>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button className="bg-red-500 text-white px-4 py-2 hover:bg-red-700" onClick={() => handleDelete(stock.stock_code)}>{stock.stock_code}を削除</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-[1fr_3fr_3fr] h-[320px]">
                            <div className="grid-item p-2 overflow-y-auto h-80 whitespace-break-spaces border-l">
                                <LinkComponent links={result.links} stock={stock.stock_code} />
                            </div>
                            <Memos key={`${stock.stock_code}-${MemoRefreshKey}`} memos={stock.memos} stock={stock.stock_code} name={stock.stock_name} setMemoRefreshKey={setMemoRefreshKey} />
                            <div className="grid-item pl-2">
                                <img src={`https://www.kabudragon.com/chart/s=${stock.stock_code}`} className="h-full w-full object-scale-down border-r" />
                            </div>
                        </div >
                    </React.Fragment>
                ))
            ) : (
                <div>No data available</div>
            )}
        </EditableContext.Provider>
    )
}
const initFetch = async (param, itemsPerPage,setTotalStockCount) => {
    try {
        const result = await laravelAxios.get(`http://localhost:8080/api/dashboard/reviews?param=${param}&page=${itemsPerPage}`, { cache: 'no-cache' });
        setTotalStockCount(result.data.totalStockCount)
        return result.data.user;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // エラーを再スローして呼び出し元で処理
    }
}
export default MemoFetch