'use client'

import React, { useEffect, useState, createContext, useContext } from 'react'
import Memos from '@@/(app)/dashboard/_component/memos.client';
import LinkComponent from '@@/(app)/dashboard/_component/LinkComponent';
import laravelAxios from '@/lib/laravelAxios';


import LogModal from '@@/(app)/dashboard/_component/_MemoFetchComponents/LogModal.client';


function formatDateToISO(date) {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());

    return `${year}-${month}-${day}`;
}

// 編集可能か判定するコンテキストを作成
export const EditableContext = createContext();

const MemoFetch = ({ refreshKey, sortOrder, currentPage, itemsPerPage, setItemsPerPage, onDataFetched, param, setTotalStockCount, onDataResult, categoryList }) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [MemoRefreshKey, setMemoRefreshKey] = useState(0);
    const [isEditable, setIsEditable] = useState(true);
    const [chartImage, setChartImage] = useState(`https://www.kabudragon.com/chart/s=[code]`);
    const [chartCount, setChartCount] = useState(0);
    const [chartImages, setChartImages] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedCategories, setSelectedCategories] = useState({});


    useEffect(() => {
        if (result && onDataResult) {
            console.log(result)
            console.log(onDataResult)
            const initialCategories = result.stocks.reduce((acc, stock, index) => {
                acc[stock.stock_code] = stock.categories && stock.categories[0] ? stock.categories[0].name : '未分類';
                return acc;
            }, {});
            console.log(initialCategories)
            setSelectedCategories(initialCategories);
        }
    }, [result, onDataResult]);


    const handleImageClick = (stockCode) => {
        setChartCount(chartCount + 1);
        let newChartImage;
        if (chartCount === 0) {
            newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/volb=1.png`;
        } else if (chartCount === 1) {
            newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/volb=1/a=1.png`;
        } else {
            newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/volb=1/a=2.png`;
            setChartCount(0);
        }
        setChartImages(prevImages => ({ ...prevImages, [stockCode]: newChartImage }));
    };

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
    const handleLog = async (stockCode) => {
        try {
            const response = await laravelAxios.get(`http://localhost:8080/api/log/getStockLog?stockCode=${stockCode}`);
            const log = response.data; // ここでレスポンスデータを取得
            console.log(log);
            setModalContent(log); // モーダルにログを表示
        } catch (error) {
            console.error('Error fetching log:', error);
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleCategoryChange = (stockCode, value) => {
        setSelectedCategories(prev => ({ ...prev, [stockCode]: value }));
        console.log(selectedCategories, stockCode, value)
        laravelAxios.post('http://localhost:8080/api/Categories/update', {
            "stockCode": stockCode,
            "category": value
        })
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await initFetch(currentPage, itemsPerPage, setTotalStockCount, setItemsPerPage);
                if (data && data.memo_display_number) {
                    setItemsPerPage(data.memo_display_number)
                }
                console.log(data)

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
        return <div>新しく銘柄を登録してください</div>;
    }

    if (!result) {
        return <div>Loading...</div>;
    }

    return (
        <EditableContext.Provider value={[isEditable, setIsEditable]}>
            <LogModal modalIsOpen={modalIsOpen} closeModal={closeModal} modalContent={modalContent} resultStocks={result.stocks} />

            {result && result.stocks && result.stocks.length > 0 ? (
                result.stocks.map((stock, index) => {
                    return (
                        <div key={stock.stock_code} id={stock.stock_code}>
                            <div className="grid grid-cols-6 border px-3 py-2">
                                <div className="col-span-3 flex items-center">
                                    <span className="grid-item px-6">
                                        {stock.memos.length > 0 ? formatDateToISO(new Date(stock.memos[0].created_at)) : 'N/A'}
                                    </span>
                                    <span className="grid-item px-6">{stock.stock_name}</span>
                                    <span className="grid-item px-6">{stock.stock_code}</span>
                                </div>
                                <div className='col-span-1 flex justify-end'>
                                    <div className="relative inline-block">
                                        <select id="mySelect" className="" value={selectedCategories[stock.stock_code] || '未分類'} onChange={(e) => handleCategoryChange(stock.stock_code, e.target.value)}>
                                            {categoryList && categoryList.map((category, index) => (
                                                <option className='bg-white text-gray-700' value={category} key={index}>{category} </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button className="pr-4 pl-4 hover:bg-red-100 bg-gray-100" onClick={() => handleLog(stock.stock_code)}>編集履歴</button>
                                    <button className="bg-red-500 text-white px-4 py-2 hover:bg-red-700" onClick={() => handleDelete(stock.stock_code)}>{stock.stock_code}を削除</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-[1fr_3fr_3fr] h-[320px]">
                                <div className="grid-item p-2 overflow-y-auto h-80 whitespace-break-spaces border-l">
                                    <LinkComponent links={result.links} stock={stock.stock_code} />
                                </div>
                                <Memos key={`${stock.stock_code}-${MemoRefreshKey}`} memos={stock.memos} stock={stock.stock_code} name={stock.stock_name} setMemoRefreshKey={setMemoRefreshKey} />
                                <div className="grid-item pl-2">
                                    <img
                                        src={chartImages[stock.stock_code] || chartImage.replace('[code]', stock.stock_code)}
                                        className="h-full w-full object-scale-down border-r cursor-pointer"
                                        onClick={() => handleImageClick(stock.stock_code)}
                                    />
                                </div>
                            </div >
                        </div>
                    );
                })
            ) : (
                <div>No data available</div>
            )}
        </EditableContext.Provider>
    )
}
const initFetch = async (param, itemsPerPage, setTotalStockCount, setItemsPerPage) => {
    try {
        const result = await laravelAxios.get(`http://localhost:8080/api/dashboard/reviews?param=${param}&page=${itemsPerPage}`, { cache: 'no-cache' });
        setTotalStockCount(result.data.totalStockCount)
        // setItemsPerPage(result.data.memo_display_number)
        return result.data.user;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // エラーを再スローして呼び出し元で処理
    }
}


export default MemoFetch