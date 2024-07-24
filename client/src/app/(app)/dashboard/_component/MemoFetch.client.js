'use client'

import React, { useEffect, useState, createContext, useContext } from 'react'
import Memos from '@@/(app)/dashboard/_component/memos.client';
import LinkComponent from '@@/(app)/dashboard/_component/LinkComponent';
import laravelAxios from '@/lib/laravelAxios';
import Modal from 'react-modal';
import { Editor, EditorState, convertFromRaw, CompositeDecorator } from 'draft-js';


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
    const [chartImage, setChartImage] = useState(`https://www.kabudragon.com/chart/s=[code]`);
    const [chartCount, setChartCount] = useState(0);
    const [chartImages, setChartImages] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

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

    const renderDraftContent = (rawContent) => {
        const contentState = convertFromRaw(JSON.parse(rawContent));
        const decorator = new CompositeDecorator([
            {
                strategy: (contentBlock, callback, contentState) => {
                    contentBlock.findEntityRanges(
                        (character) => {
                            const entityKey = character.getEntity();
                            return (
                                entityKey !== null &&
                                contentState.getEntity(entityKey).getType() === 'LINK'
                            );
                        },
                        callback
                    );
                },
                component: (props) => {
                    const { url } = props.contentState.getEntity(props.entityKey).getData();
                    return (
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                            {props.children}
                        </a>
                    );
                },
            },
        ]);
        const editorState = EditorState.createWithContent(contentState, decorator);
        return <Editor editorState={editorState} readOnly={true} />;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await initFetch(currentPage, itemsPerPage, setTotalStockCount, setItemsPerPage); // ページ番号を渡す
                setItemsPerPage(data.memo_display_number)
                // console.log(data.memo_display_number)

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
    // console.log(modalContent.memo_logs[0]);
    return (
        <EditableContext.Provider value={[isEditable, setIsEditable]}>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Stock Code Modal"
                ariaHideApp={false}
            >
                <div className="flex justify-between items-center">
                    <h2>Stock Code</h2>
                    <button onClick={closeModal} className="bg-none border-none text-2xl cursor-pointer">×</button>
                </div>
                <div>{modalContent.memo_logs && modalContent.memo_logs.map((log, index) => {
                    return (
                        <div key={index}>
                            <h3>{log.memo_title}</h3>
                            {renderDraftContent(log.memo)}
                        </div>
                    )
                })}</div>
            </Modal>
            {result && result.stocks && result.stocks.length > 0 ? (
                result.stocks.map((stock, index) => {
                    return (
                        <div key={stock.stock_code} id={stock.stock_code}>
                            <div className="grid grid-cols-6 border px-3 py-2">
                                <div className="col-span-4 flex items-center">
                                    <span className="grid-item px-6">
                                        {stock.memos.length > 0 ? formatDateToISO(new Date(stock.memos[0].created_at)) : 'N/A'}
                                    </span>
                                    <span className="grid-item px-6">{stock.stock_name}</span>
                                    <span className="grid-item px-6">{stock.stock_code}</span>
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