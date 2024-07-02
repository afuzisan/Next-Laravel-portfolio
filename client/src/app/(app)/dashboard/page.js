"use client";

import { siteName } from "@/app/metadata_common.js"
import MemoFetch from '@@/(app)/dashboard/_component/MemoFetch.client';
import { useState } from 'react';


// export const metadata = {
//     title: `${siteName} - Dashboard`,
// }

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRegisterClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="py-6">
                <div className="grid grid-cols-2 h-full gap-2">
                    <nav aria-label="Page navigation" className="col-span-2 flex justify-between pr-6">
                        <div className="flex items-center pl-6">
                            <button 
                                className="px-3 py-2 leading-tight text-white bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-600 hover:border-blue-600"
                                onClick={handleRegisterClick}
                            >
                                銘柄を登録する
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
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
                    <MemoFetch />
                </div>
            </div >
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl mb-4">モーダルウインドウ</h2>
                        <button 
                            className="px-3 py-2 leading-tight text-white bg-red-500 border border-red-500 rounded-lg hover:bg-red-600 hover:border-red-600"
                            onClick={closeModal}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}



export default Dashboard
