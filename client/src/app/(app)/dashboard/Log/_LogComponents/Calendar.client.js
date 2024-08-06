'use client'

import laravelAxios from '@/lib/laravelAxios';
import React, { useState, useEffect } from 'react'
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import createLinkPlugin from '@draft-js-plugins/anchor';
import '@draft-js-plugins/anchor/lib/plugin.css';
import NextLink from 'next/link';
import { CompositeDecorator } from 'draft-js';

const Link = (props) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    return (
        <NextLink href={url} className='text-blue-600 ' target="_blank">
            {props.children}
        </NextLink>
    );
};

function findLinkEntities(contentBlock, callback, contentState) {
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
}

const decorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link,
    },
]);

const linkPlugin = createLinkPlugin({
    linkComponent: (props) => (
        <NextLink href={props.href}>
            <a {...props}>{props.children}</a>
        </NextLink>
    ),
});

const plugins = [linkPlugin]; // 必要なプラグインを追加

const Calendar = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [date, setDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [eventsData, setEventsData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await laravelAxios.get(`${apiUrl}/api/log/getAll`, { cache: 'no-store' });
                console.log(res.data.logs);
                const formattedData = {};
                for (const event of res.data.logs) {
                    if (event.updated_at) {
                        const date = new Date(new Date(event.updated_at).getTime() - (9 * 60 * 60 * 1000))
                            .toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })
                            .replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-').replace(/-(\d)$/, '-0$1');
                        console.log(date);
                        if (!formattedData[date]) {
                            formattedData[date] = [];
                        }
                        formattedData[date].push({
                            memo: JSON.parse(event.memo),
                            memo_title: event.memo_title,
                            stock_id: event.stock ? event.stock.stock_code : null,
                            stock_name: event.stock ? event.stock.stock_name : null,
                            updated_at: new Date(new Date(event.updated_at).getTime() - (9 * 60 * 60 * 1000))
                                .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
                                .replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-').replace(/-(\d)$/, '-0$1')
                        });
                    }
                }
                console.log(formattedData);
                setEventsData(formattedData)
            } catch (err) {
                console.log(err);
            }

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

    const displayContent = (selectedDate) => {
        console.log(eventsData)
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const events = eventsData[formattedDate];
        if (events) {
            const eventContent = (
                <div className="border p-2">
                    {events.map((event, index) => {
                        if (event.stock_name && event.memo && event.memo_title) {
                            const localUpdatedAt = new Date(event.updated_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }).replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-').replace(/-(\d)$/, '-0$1'); // 月と日を2桁にする
                            let editorState;
                            try {
                                const contentState = convertFromRaw(event.memo);
                                console.log(contentState);
                                editorState = EditorState.createWithContent(contentState, decorator);
                            } catch (error) {
                                console.error('Invalid JSON in memo:', event.memo);
                                editorState = EditorState.createEmpty(decorator);
                            }
                            console.log(event);
                            return (
                                <div className={`flex justify-between ${index !== events.length - 1 ? 'border-b' : ''}`}>
                                    <img
                                        className={`flex w-[500px] h-[200px] my-auto object-cover rounded cursor-pointer p-4 `}
                                        src={`https://www.kabudragon.com/chart/s=${event.stock_id}/e=${formatDate(localUpdatedAt, '-', 2)}`}
                                    />
                                    <div key={index} className={`w-[50%] pl-2 pt-2 pb-2 grid grid-cols-[70px_2fr] gap-2 break-words overflow-hidden`}>
                                        <p><strong>銘柄名</strong></p>
                                        <p className="break-words">{event.stock_name}({event.stock_id})</p>
                                        <p><strong>タイトル:</strong></p>
                                        <p className="break-words">{event.memo_title}</p>
                                        <p><strong>メモ:</strong></p>
                                        <div className="break-words overflow-y-auto max-h-[300px] flex-1 w-[360px] scrollbar-radius">
                                            <Editor editorState={editorState} readOnly={true} />
                                        </div>
                                        <p><strong>作成日時:</strong></p>
                                        <p className="break-words">{localUpdatedAt}</p>
                                    </div>
                                </div>
                            );
                        }
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
                    const localUpdatedAt = new Date(event.updated_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false }).replace(/T\d{2}:\d{2}:\d{2}\.\d{6}Z$/, '').replace(/\//g, '-').replace(/-(\d)-/g, '-0$1-');
                    let editorState;
                    try {
                        const contentState = convertFromRaw(JSON.parse(event.memo));
                        editorState = EditorState.createWithContent(contentState, decorator);
                    } catch (error) {
                        console.error('Invalid JSON in memo:', event.memo);
                        editorState = EditorState.createEmpty(decorator);
                    }
                    return (
                        <div key={index} className={`p-2 grid grid-cols-[100px_500px] gap-2 break-words overflow-hidden ${index !== content.length - 1 ? 'border-b' : ''}`}>
                            <p><strong>タイトル:</strong></p>
                            <p className="break-words">{event.memo_title}</p>
                            <p><strong>メモ:</strong></p>
                            <div className="break-words"><Editor editorState={editorState} readOnly={true} /></div>
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
                    <div className="relative w-full h-full flex items-center justify-center">
                        <span className="absolute text-red-100 font-bold text-6xl bottom-0 opacity-20"
                            onMouseEnter={(e) => showTooltip(e, eventsData[formattedDate])}
                            onMouseLeave={hideTooltip}
                        >
                            ●
                        </span>
                    </div>
                );
            }
        }
        return null;
    };
    console.log(eventsData);
    return (
        <div className="flex justify-center h-[calc(100vh-100px)] w-full p-4">
            <div className="grid grid-cols-[200px_300px_1fr] gap-5 w-full ">
                <div className='overflow-hidden w-full h-[calc(100vh-100px)]'>
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
                <div className="overflow-auto w-full h-[calc(100vh-200px)]">
                    <div className="whitespace-pre-line">{content}</div>
                </div>
            </div>
        </div>
    )
}

export default Calendar