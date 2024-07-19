'use client'

import React, { useState } from 'react'
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// ダミーデータ
const dummyData = {
    '2023-10-01': [
        { memo: 'あいうえおaaaaaaaaあああああaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaっっっっっっっっっっっっっｂ', memo_title: 'タイトル1', stock_id: '001', memo_at_create: '2023-10-01T10:00:00' },
        { memo: 'メモ5', memo_title: 'タイトル5', stock_id: '005', memo_at_create: '2023-10-01T15:00:00' }
    ],
    '2023-10-02': [
        { memo: 'メモ2', memo_title: 'タイトル2', stock_id: '002', memo_at_create: '2023-10-02T11:00:00' }
    ],
    '2023-10-03': [
        { memo: 'メモ3', memo_title: 'タイトル3', stock_id: '003', memo_at_create: '2023-10-03T12:00:00' }
    ],
};

const Calendar = () => {

    const [date, setDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    const handleDateClick = (value) => {
        const selectedDate = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
        console.log('Date clicked:', selectedDate);
        setDate(selectedDate);
        checkIfToday(selectedDate);
        displayContent(selectedDate);
        setActiveStartDate(new Date(Date.UTC(value.getFullYear(), value.getMonth(), 1))); // 追加
    };

    const handleActiveStartDateChange = ({ activeStartDate }) => {
        setActiveStartDate(activeStartDate);
    };

    const handleButtonClick = () => {
        handleDateClick(date);
    };

    const checkIfToday = (selectedDate) => {
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        console.log('Is today:', isToday);
    };

    const displayContent = (selectedDate) => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const events = dummyData[formattedDate];
        if (events) {
            const eventContent = (
                <div className="border p-2">
                    {events.map((event, index) => (
                        <div key={index} className={`p-2 grid grid-cols-[100px_2fr] gap-2 break-words overflow-hidden ${index !== events.length - 1 ? 'border-b' : ''}`}>
                            <p><strong>タイトル:</strong></p>
                            <p className="break-words">{event.memo_title}</p>
                            <p><strong>メモ:</strong></p>
                            <p className="break-words">{event.memo}</p>
                            <p><strong>ID:</strong></p>
                            <p className="break-words">{event.stock_id}</p>
                            <p><strong>作成日時:</strong></p>
                            <p className="break-words">{event.memo_at_create}</p>
                        </div>
                    ))}
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
                {content.map((event, index) => (
                    <div key={index} className={`p-2 grid grid-cols-[100px_500px] gap-2 break-words overflow-hidden ${index !== content.length - 1 ? 'border-b' : ''}`}>
                        <p><strong>タイトル:</strong></p>
                        <p className="break-words">{event.memo_title}</p>
                        <p><strong>メモ:</strong></p>
                        <p className="break-words">{event.memo}</p>
                        <p><strong>ID:</strong></p>
                        <p className="break-words">{event.stock_id}</p>
                        <p><strong>作成日時:</strong></p>
                        <p className="break-words">{event.memo_at_create}</p>
                    </div>
                ))}
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
            if (dummyData[formattedDate]) {
                return (
                    <span
                        className="text-red-500"
                        onMouseEnter={(e) => showTooltip(e, dummyData[formattedDate])}
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
                        {Array.from(new Set(Object.values(dummyData).flat().map(event => event.memo_at_create.split('T')[0]))).map((date, index) => (
                            <div 
                                key={index} 
                                className={`hover:bg-gray-100 cursor-pointer p-2 grid grid-cols-[100px_2fr] gap-2 break-words overflow-hidden ${index !== Object.values(dummyData).flat().length - 1 ? 'border-b' : ''}`}
                                onClick={() => handleDateClick(new Date(Date.UTC(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate())))}
                            >
                                <p className="break-words">{new Date(date).toLocaleDateString()}</p>
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