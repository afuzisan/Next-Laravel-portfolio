'use client'
import React, { useEffect, useState } from 'react';
import laravelAxios from "@/lib/laravelAxios";
import { Editor, EditorState, convertFromRaw, CompositeDecorator } from 'draft-js';
// import Calendar from '@/app/(app)/stocks/[stock]/_LogComponent/Calendar.client';

const page = ({ params }) => {

    const [content, setContent] = useState(null);
    const [chartCount, setChartCount] = useState(0);
    const [chartImages, setChartImages] = useState({});
    const [chartLabels, setChartLabels] = useState({});
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        initStockLog();
    }, []);

    useEffect(() => {
        if (content && content.length > 0) {
            const initialDate = formatDate(content[0].created_at, '-');
            setSelectedDate(initialDate);
        }
    }, [content]);

    const initStockLog = async () => {
        try {
            const response = await laravelAxios.get(`http://localhost:8080/api/log/getStockLog?stockCode=${params.StockCode}`);
            const log = response.data.memo_logs;
            setContent(log);
        } catch (error) {
            console.error('Error fetching log:', error);
        }
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

    const formatDate = (dateString, type, sliceNumber) => {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(sliceNumber);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        if (type === '-') {
            return `${year}-${month}-${day}`;
        } else {
            return `${year}${month}${day}`;
        }

    };

    const handleImageClick = (stockCode, imageFormattedDate, count, memoTitle, resetCount = false) => {
        const newCount = resetCount ? count : chartCount + count;
        setChartCount(newCount);
        let newChartImage;
        let newChartLabel;
        console.log(newCount)
        if (newCount === 0) {
            newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/e=${imageFormattedDate}.png`;
            newChartLabel = '日足';
        } else if (newCount === 1) {
            newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=1/e=${imageFormattedDate}.png`;
            newChartLabel = '週足';
        } else {
            newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=2/e=${imageFormattedDate}.png`;
            newChartLabel = '月足';
            setChartCount(-1);
        }
        const key = `${stockCode}-${imageFormattedDate}-${memoTitle}`;
        setChartImages(prevImages => ({ ...prevImages, [key]: newChartImage }));
        setChartLabels(prevLabels => ({ ...prevLabels, [key]: newChartLabel }));
    };

    const handleDateChange = (e, stockId, calendarFormattedDate, memoTitle) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        handleImageClick(stockId, newDate.replace(/-/g, ''), chartCount, memoTitle, false);
    };

    return (
        <>
            <div className="">
                {params.StockCode}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 overflow-hidden">
                {content && content.map((item, index) => {
                    const formattedDate = formatDate(item.created_at, '-');
                    const imageFormattedDate = formatDate(item.created_at, '', 2);
                    const calendarFormattedDate = formatDate(item.created_at, '', 0);
                    return (
                        <div key={index} className="border mb-4 p-4 rounded shadow grid grid-rows-[auto,50px,auto,auto] gap-2 h-[600px]">
                            <div className="relative">
                                <img
                                    className="w-full h-auto mt-8"
                                    src={chartImages[`${item.stock_id}-${selectedDate.replace(/-/g, '')}-${item.memo_title}`] || `https://www.kabudragon.com/chart/s=${item.stock_id}/e=${imageFormattedDate}.png`}
                                    alt="Stock Image"
                                    onClick={() => handleImageClick(item.stock_id, selectedDate.replace(/-/g, ''), 1, item.memo_title, false)}
                                />
                                <span className="absolute top-[0px] left-[39%] text-black bg-white p-1 rounded">
                                    {chartLabels[`${item.stock_id}-${selectedDate.replace(/-/g, '')}-${item.memo_title}`] || '日足'}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <div className="flex items-center">
                                    <span className="text-gray-500 text-lg">{formattedDate}</span>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        type="date"
                                        id="start"
                                        name="trip-start"
                                        value={selectedDate || calendarFormattedDate}
                                        min="2018-01-01"
                                        onChange={(e) => handleDateChange(e, item.stock_id, calendarFormattedDate, item.memo_title)}
                                    />
                                </div>
                            </div>
                            <div className="mb-2 break-words overflow-hidden" >
                                <span className="font-bold text-lg break-words overflow-hidden">{item.memo_title}</span>
                            </div>
                            <div className="mb-2 flex-grow overflow-y-scroll">
                                {renderDraftContent(item.memo)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default page