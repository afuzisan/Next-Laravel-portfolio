'use client'

import laravelAxios from '@/lib/laravelAxios';
import React, { useState, useEffect } from 'react'
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// ダミーデータを追加
const dummyData = {
    "2023-10-01": [
        {
            memo: "サンプルメモ1",
            memo_title: "サンプルタイトル1",
            stock_id: "1",
            updated_at: "2023-10-01 10:00:00"
        }
    ],
    "2023-10-02": [
        {
            memo: "サンプルメモ2",
            memo_title: "サンプルタイトル2",
            stock_id: "2",
            updated_at: "2023-10-02 11:00:00"
        }
    ]
};

const Calendar = () => {

    const [date, setDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [eventsData, setEventsData] = useState({}); // ダミーデータを使用
    const [eventsData2, setEventsData2] = useState({}); // 新しいステートを追加

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await laravelAxios.get('http://localhost:8080/api/log/getAll', { cache: 'no-store' });
                console.log(res.data);
                const formattedData = res.data.reduce((acc, event) => {
                    if (event.updated_at) {
                        const date = new Date(new Date(event.updated_at).getTime() - (9 * 60 * 60 * 1000)).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }).replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-').replace(/-(\d)$/, '-0$1');

                        if (!acc[date]) {
                            acc[date] = [];
                        }
                        acc[date].push({
                            memo: JSON.parse(event.memo).blocks[0].text,
                            memo_title: event.memo_title,
                            stock_id: event.stock_id,

                            updated_at: new Date(new Date(event.updated_at).getTime() - (9 * 60 * 60 * 1000)).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }).replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-').replace(/-(\d)$/, '-0$1')
                        });
                        console.log(acc);
                    }
                    return acc;
                }, {});
                console.log(formattedData);
                // setEventsData2(formattedData);
                setEventsData(formattedData)
            } catch (err) {
                console.log(err);
            }
            console.log(eventsData2);
            console.log(eventsData)
        };
        fetchData();
    }, []);
    const handleDateClick = (value) => {
        const selectedDate = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
        console.log('Date clicked:', selectedDate);
        setDate(selectedDate);
        checkIfToday(selectedDate);
        displayContent(selectedDate);
        setActiveStartDate(new Date(Date.UTC(value.getFullYear(), value.getMonth(), 1))); 
    };

    const handleActiveStartDateChange = ({ activeStartDate }) => {
        setActiveStartDate(activeStartDate);
    };

    const checkIfToday = (selectedDate) => {
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        console.log('Is today:', isToday);
    };

    const displayContent = (selectedDate) => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const events = eventsData[formattedDate];
        if (events) {
            const eventContent = (
                <div className="border p-2">
                    {events.map((event, index) => {
                        const localUpdatedAt = new Date(event.updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false }).replace(/T\d{2}:\d{2}:\d{2}\.\d{6}Z$/, '').replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-'); // 月と日を2桁にする
                        return (
                            <div key={index} className={`p-2 grid grid-cols-[100px_2fr] gap-2 break-words overflow-hidden ${index !== events.length - 1 ? 'border-b' : ''}`}>
                                <p><strong>タイトル:</strong></p>
                                <p className="break-words">{event.memo_title}</p>
                                <p><strong>メモ:</strong></p>
                                <p className="break-words">{event.memo}</p>
                                <p><strong>ID:</strong></p>
                                <p className="break-words">{event.stock_id}</p>
                                <p><strong>作成日時:</strong></p>
                                <p className="break-words">{localUpdatedAt}</p>
                            </div>
                        );
                    })}
                </div>
            );
            setContent(eventContent);
        } else {
            setContent('イベントなし');
        }
    };

    const showTooltip = (event, content) => {
        const tooltipContent = (
            <div className="border p-2">
                {content.map((event, index) => {
                    const localUpdatedAt = new Date(event.updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false }).replace(/T\d{2}:\d{2}:\d{2}\.\d{6}Z$/, '').replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-'); // 月と日を2桁にする
                    return (
                        <div key={index} className={`p-2 grid grid-cols-[100px_500px] gap-2 break-words overflow-hidden ${index !== content.length - 1 ? 'border-b' : ''}`}>
                            <p><strong>タイトル:</strong></p>
                            <p className="break-words">{event.memo_title}</p>
                            <p><strong>メモ:</strong></p>
                            <p className="break-words">{event.memo}</p>
                            <p><strong>ID:</strong></p>
                            <p className="break-words">{event.stock_id}</p>
                            <p><strong>作成日時:</strong></p>
                            <p className="break-words">{localUpdatedAt}</p>
                        </div>
                    );
                })}
            </div>
        );
        setTooltip({
            visible: true,
            content: tooltipContent,
            x: event.clientX,
            y: event.clientY,
        });
    };

    const hideTooltip = () => {
        setTooltip({ visible: false, content: '', x: 0, y: 0 });
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
            if (eventsData[formattedDate]) {
                return (
                    <span
                        className="text-red-500"
                        onMouseEnter={(e) => showTooltip(e, eventsData[formattedDate])}
                        onMouseLeave={hideTooltip}
                    >
                        ●
                    </span>
                );
            }
        }
        return null;
    };

    return (
        <div className="flex justify-center h-screen w-full p-4">
            <div className="grid grid-cols-[200px_300px_1fr] gap-5 w-full h-4/5">
                <div className='overflow-auto w-full'>
                    <div className='w-full h-full'>
                        {Array.from(new Set(Object.keys(eventsData))).map((date, index) => (
                            <div
                                key={index}
                                className={`hover:bg-gray-100 cursor-pointer p-2 grid grid-cols-[100px_2fr] gap-2 break-words overflow-hidden ${index !== Object.keys(eventsData).length - 1 ? 'border-b' : ''}`}
                                onClick={() => handleDateClick(new Date(Date.UTC(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate())))}
                            >
                                <p className="break-words">{new Date(date).toLocaleDateString().replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-')}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="overflow-auto w-full">
                    <CalendarComponent
                        onChange={(value) => handleDateClick(new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())))} // 日付クリック時にイベントを発生させる
                        value={date}
                        formatDay={(locale, date) => date.getDate().toString()} // 日付を1, 2の形にする
                        tileContent={tileContent} // イベントがある日にマークを付ける
                        activeStartDate={activeStartDate} // 追加
                        onActiveStartDateChange={handleActiveStartDateChange} // 追加
                    />
                    {
                        tooltip.visible && (
                            <div
                                className="absolute bg-white border border-black p-2 z-50"
                                style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
                            >
                                {tooltip.content}
                            </div>
                        )
                    }
                </div>
                <div className="overflow-auto">
                    <div className="whitespace-pre-line">{content}</div>
                </div>
            </div>
        </div>
    )
}

export default Calendar