"use client";

import { siteName } from "@/app/metadata_common.js"
import laravelAxios from "@/lib/laravelAxios";
import MemoFetch from '@@/(app)/dashboard/_component/MemoFetch.client';
import { useReducer, useState } from 'react';


const Dashboard = () => {

    const [inputValue, setInputValue] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージの状態を追加

    const handleRegisterClick = (inputValue) => {
        const stockNumber = parseInt(inputValue, 10); // 入力値を整数に変換
        if (isNaN(stockNumber) || stockNumber < 1000 || stockNumber > 9999) { // 4桁の整数かどうかを確認
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
                setErrorMessage("エラーが発生しました: " + error.response.data.message);
            });
    };



    return (
        <>
            <div className="py-6">
                <div className="grid grid-cols-2 h-full gap-2">
                    <nav aria-label="Page navigation" className="col-span-2 flex justify-between pr-6">
                        <div className="flex items-center pl-6 relative">
                            <input
                                type="text"
                                className="px-3 py-2 leading-tight text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="証券コードか銘柄名を入力"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                className="px-3 py-2 leading-tight text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                                onClick={() => handleRegisterClick(inputValue)}
                            >
                                銘柄を登録
                            </button>
                            {errorMessage && (
                                <div
                                    className="absolute top-full left-6 mt-2 w-full text-white bg-red-400 bg-opacity-75 border border-red-500 p-2 cursor-pointer text-center flex items-center"
                                    onClick={() => setErrorMessage('')}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-2-14h4v8h-4v-8zm0 9h4v4h-4V15z" clipRule="evenodd"></path>
                                    </svg>
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">日付 (新しい順)</button>
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">日付 (古い順)</button>
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">証券コード (大きい順)</button>
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">証券コード (小さい順)</button>
                        </div>
                        <ul className="inline-flex -space-x-px items-center">
                            <li>
                                <a href="#" className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">前</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">3</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">次</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="grid grid-cols-1 pt-6 pl-6 pr-6 bg-white border-b border-gray-200 ">
                    <MemoFetch key={refreshKey} refreshKey={() => setRefreshKey(prevKey => prevKey + 1)} />
                </div>
            </div >
        </>
    )
}



export default Dashboard

