"use client";

import { siteName } from "@/app/metadata_common.js"
import laravelAxios from "@/lib/laravelAxios";
import MemoFetch from '@@/(app)/dashboard/_component/MemoFetch.client';
import { useReducer, useState, useEffect } from 'react';
import Danger from '@/components/Danger'
import '@/app/global.css'
import { useRouter } from 'next/navigation';
import { FaEdit } from "react-icons/fa";

const Dashboard = () => {

    const [inputValue, setInputValue] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージの状態を追加
    const [sortOrder, setSortOrder] = useState(() => {
        return localStorage.getItem('sortOrder') || 'dateDesc';
    });
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(localStorage.getItem('currentPage'), 10) || 0;
    });
    const [itemsPerPage, setItemsPerPage] = useState(() => {
        return parseInt(localStorage.getItem('itemsPerPage'), 10) || 100;
    });
    const [result, setResult] = useState(null);
    const [totalStockCount, setTotalStockCount] = useState(0);
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || 'stockList';
    });
    const [categoryList, setCategoryList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem('itemsPerPage', itemsPerPage);
    }, [itemsPerPage]);

    useEffect(() => {
        localStorage.setItem('sortOrder', sortOrder);
    }, [sortOrder]);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        laravelAxios.get('http://localhost:8080/api/Categories/getCategoryList')
            .then(response => {
                console.log(response.data)
                setCategoryList(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleRegisterClick = (inputValue) => {

        // ２バイト数字１バイト数字に変換
        const normalizedInput = inputValue.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
        const stockNumber = parseInt(normalizedInput, 10); // 入力値を整数に変換
        if (isNaN(stockNumber) || stockNumber < 1000 || stockNumber > 9999) { // 4桁の整数かどうか確認
            setErrorMessage("正しい証券コードを入力してください。");
            return;
        }

        laravelAxios.post('http://localhost:8080/api/dashboard/stockStore', { "stockNumber": stockNumber })
            .then(() => {
                setRefreshKey(prevKey => prevKey + 1);
                setInputValue('');
                setErrorMessage(''); // 成功時にエラーメッセージをクリア
            })
            .catch((error) => {
                console.error("Error:", error.response.data); // エラーメッセージをコンソールに表示
                setErrorMessage(error.response.data.message);
            });
    };

    const handleCategoryRegisterClick = (inputValue) => {
        const normalizedInput = inputValue.replace(/[Ａ-Ｚａ-ｚ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
        if (normalizedInput === '') {
            setErrorMessage('カテゴリ名を入力してください');
            return;
        }
        laravelAxios.post('http://localhost:8080/api/Categories/AddCategoryList', { "categoryName": normalizedInput })
            .then(() => {
                router.refresh({ keepCache: true });
                setInputValue('');
                setErrorMessage(''); // 成功時にエラーメッセージをクリア
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message);
            });
    };

    const handleSort = (order) => {
        setSortOrder(order);
    };

    const handleDeleteCategoryList = (category) => {
        if (category === '未分類') {
            setErrorMessage('未分類は削除できません');
            return;
        }
        if (window.confirm(`${category}を削除してもよろしいですか？`)) {
            laravelAxios.delete(`http://localhost:8080/api/Categories/deleteCategoryList/${category}`)
                .then(() => {
                    router.refresh({ keepCache: true });
                    setErrorMessage('');
                })
                .catch(() => {
                    setErrorMessage('エラーが発生しました');
                });
        }
    }

    const handleEditCategoryList = (category) => {
        const newCategory = prompt('新しいカテゴリ名を入力してください');
        if (newCategory === null || newCategory === '') {
            return;
        }
        if (category === '未分類') {
            setErrorMessage('未分類は編集できません');
            return;
        }
        laravelAxios.put(`http://localhost:8080/api/Categories/editCategoryList/${newCategory}/${category}`)
            .then(() => {
                setCategoryList(prevList => prevList.map(c => c === category ? newCategory : c));
                setRefreshKey(prevKey => prevKey + 1);
                setErrorMessage('');
            })
            .catch(() => {
                setErrorMessage('エラーが発生しました');
            });
    }

    return (
        <>
            <div className="py-6" key={refreshKey}>

                <div className="grid grid-cols-2 h-full gap-2">
                    <nav aria-label="Page navigation" className="col-span-2 flex justify-between pr-6">
                        <div className="flex items-center pl-6 relative">
                            <input
                                type="text"
                                className="w-[250px] px-3 py-2 leading-tight text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="証券コードまたはカテゴリ名を入力"
                                value={inputValue}
                                onChange={(e) => {
                                    const normalizedInput = e.target.value
                                        .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                                    setInputValue(normalizedInput);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleRegisterClick(inputValue);
                                    }
                                }}
                            />
                            <button
                                className="px-3 py-2 leading-tight text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                                onClick={() => handleRegisterClick(inputValue)}
                            >
                                銘柄登録
                            </button>
                            <button
                                className="px-3 py-2 leading-tight text-white bg-green-800 border border-green-800 hover:bg-green-900 hover:border-green-900"
                                onClick={() => handleCategoryRegisterClick(inputValue)}
                            >
                                カテゴリ登録
                            </button>
                            {errorMessage && (
                                <Danger errorMessage={errorMessage} setErrorMessage={setErrorMessage} className="absolute top-full left-6 mt-2 w-full text-white bg-red-400  border border-red-500 p-2 cursor-pointer text-center flex items-center z-50" />
                            )}
                        </div>
                        <div className="flex items-center">
                            <button
                                className={`px-3 py-2 leading-tight text-gray-500 border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${sortOrder === 'dateDesc' ? 'bg-gray-100' : 'bg-white'}`}
                                onClick={() => handleSort('dateDesc')}
                            >
                                登録日 (新しい)
                            </button>
                            <button
                                className={`px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${sortOrder === 'dateAsc' ? 'bg-gray-100' : 'bg-white'}`}
                                onClick={() => handleSort('dateAsc')}
                            >
                                登録日 (古い順)
                            </button>
                            <button
                                className={`px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${sortOrder === 'codeDesc' ? 'bg-gray-100' : 'bg-white'}`}
                                onClick={() => handleSort('codeDesc')}
                            >
                                証券コード (大きい順)
                            </button>
                            <button
                                className={`px-3 py-2 leading-tight text-gray-500 border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${sortOrder === 'codeAsc' ? 'bg-gray-100' : 'bg-white'}`}
                                onClick={() => handleSort('codeAsc')}
                            >
                                証券コード (小さい順)
                            </button>
                        </div>
                        <ul className="inline-flex -space-x-px items-center">
                            <li>
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => (prev > 0 ? prev - 1 : Math.ceil(totalStockCount / itemsPerPage) - 1));
                                    }}
                                    className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-red-100 hover:text-gray-700"
                                >
                                    ＜
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-red-100 hover:text-gray-700 ${currentPage + 1 === currentPage ? 'bg-gray-100' : 'bg-white'}`}
                                >
                                    {currentPage + 1}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => (prev < Math.ceil(totalStockCount / itemsPerPage) - 1 ? prev + 1 : 0));
                                    }}
                                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-red-100 hover:text-gray-700"
                                >
                                    ＞
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="flex mt-6 ">
                    <div className="flex-1 w-[280px] border-t border-l border-b border-r border-gray-200 overflow-y-auto h-[100%] max-h-[calc(100vh-200px)] sticky top-10 mr-4 rounded-lg scrollbar-radius">
                        <div className="flex bg-white border-b border-gray-200">
                            <button
                                className={`px-3 py-2 w-[50%]  ${activeTab === 'stockList' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                onClick={() => setActiveTab('stockList')}
                            >
                                銘柄リスト
                            </button>
                            <button
                                className={`px-3 py-2 w-[50%] ${activeTab === 'tab2' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                                onClick={() => setActiveTab('tab2')}
                            >
                                カテゴリ
                            </button>
                        </div>
                        <div>
                            {activeTab === 'stockList' && result && <div>{result.stocks.map((stock, index) => {
                                return (
                                    <li className={`list-none`}>
                                        <a href={`#${stock.stock_code}`} key={stock.stock_code} className="block w-full h-full px-3 py-2 border-b-2 border-dotted border-gray-200 hover:bg-gray-100">
                                            {stock.stock_name}({stock.stock_code})
                                        </a>
                                    </li>
                                )
                            })}</div>}
                            {activeTab === 'tab2' && result && (() => {
                                return categoryList.map((category, index) => {
                                    return (
                                        <div key={index}>
                                            <li className="list-none flex justify-between block w-full h-full px-3 py-2 border-b-2 border-dotted border-gray-200 hover:bg-gray-100">
                                                <a href={`dashboard/Category/${encodeURIComponent(category)}`} className="block w-full h-full">
                                                    {category}
                                                </a>
                                                {category !== '未分類' && (
                                                    <span className="flex items-center border border-gray-200 rounded-lg pr-1 pl-1 hover:bg-white">
                                                        <span className="mr-1 ml-1 flex items-center hover:text-gray-500 cursor-pointer">
                                                            <FaEdit className="text-gray-200 hover:text-black cursor-pointer " onClick={() => handleEditCategoryList(category)} />
                                                        </span >
                                                        <span className="text-gray-200 mr-1 ml-1 hover:text-black cursor-pointer" onClick={() => handleDeleteCategoryList(category)}>✕</span>
                                                    </span>
                                                )}
                                            </li>

                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                    <div className="flex-4 grid grid-cols-1 mr-6 bg-white border-b border-gray-100 w-[1280px]">
                        <MemoFetch
                            key={refreshKey}
                            refreshKey={() => setRefreshKey(prevKey => prevKey + 1)}
                            sortOrder={sortOrder}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onDataFetched={setResult}
                            onDataResult={result}
                            setItemsPerPage={setItemsPerPage}
                            setTotalStockCount={setTotalStockCount}
                            categoryList={categoryList}
                        />
                    </div>
                </div>
            </div >
        </>
    )
}



export default Dashboard