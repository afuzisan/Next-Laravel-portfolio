'use client'
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import laravelAxios from "@/lib/laravelAxios";
import { Editor, EditorState, convertFromRaw, CompositeDecorator } from 'draft-js';

const LogModal = ({ modalIsOpen, closeModal, modalContent }) => {

  const [content, setContent] = useState(null);
  const [chartCount, setChartCount] = useState(0);
  const [chartImages, setChartImages] = useState({});
  const [chartLabels, setChartLabels] = useState({});
  const [selectedDates, setSelectedDates] = useState({});

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
  }


  useEffect(() => {
    initStockLog();
  }, []);

  const initStockLog = async () => {
    try {
      const response = await laravelAxios.get(`http://localhost:8080/api/log/getStockLog?stockCode=${modalContent.StockCode}`);
      const log = response.data.memo_logs;
      setContent(log);
    } catch (error) {
      console.error('Error fetching log:', error);
    }
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

  const handleImageClick = (stockCode, imageFormattedDate, count, memoTitle, resetCount = false, newDate, currentCount) => {
    const key = `${stockCode}-${imageFormattedDate}-${memoTitle}`;
    const newCount = resetCount ? count : (currentCount !== undefined ? currentCount : (chartCount[key] || 0)) + count;
    let newChartImage;
    let newChartLabel;
    setChartCount(prevCount => ({ ...prevCount, [key]: newCount }));
    console.log(newCount);
    console.log(currentCount);

    if (newCount === 0) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/e=${newDate}.png`;
      newChartLabel = '日足';
      console.log('日足 0');
    } else if (newCount === 1) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=1/e=${newDate}.png`;
      newChartLabel = '週足';
    } else if (newCount === 2) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=2/e=${newDate}.png`;
      newChartLabel = '月足';
    } else {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/e=${newDate}.png`;
      newChartLabel = '日足';
      setChartCount(prevCount => ({ ...prevCount, [key]: 0 }));
    }

    setChartImages(prevImages => ({ ...prevImages, [key]: newChartImage }));
    setChartLabels(prevLabels => ({ ...prevLabels, [key]: newChartLabel }));
  };

  const handleDateChange = (e, stockId, calendarFormattedDate, memoTitle, imageFormattedDate, stockCode) => {
    const newDate = e.target.value;
    const key = `${stockCode}-${imageFormattedDate}-${memoTitle}`;
    const currentCount = chartCount[key] || 0; // 現在のカウントを取得
    setSelectedDates(prevDates => ({ ...prevDates, [key]: newDate }));
    handleImageClick(stockId, imageFormattedDate, 0, memoTitle, false, newDate.replace(/-/g, '').slice(2), currentCount);
  };

  console.log(modalContent.memo_logs)
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Stock Code Modal"
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center">
        <h2></h2>
        <button onClick={closeModal} className="bg-none border-none text-2xl cursor-pointer">×</button>
      </div>
      <div className="flex flex-wrap -mx-2">
        {modalContent.memo_logs && modalContent.memo_logs.map((log, index) => {
          const formattedDate = formatDate(log.updated_at, '-');
          const imageFormattedDate = formatDate(log.updated_at, '', 2);
          const calendarFormattedDate = formatDate(log.updated_at, '', 0);
          console.log(formattedDate, imageFormattedDate, calendarFormattedDate)
          return (
            <div key={index} className="border mb-4 p-4 w-[400px] rounded shadow grid grid-rows-[200px,50px,50px,auto] gap-2 h-[600px] mx-2">
              <div className="relative">
                <img
                  className="w-full h-[200px] mt-8 object-cover rounded"
                  src={chartImages[`${log.stock_id}-${imageFormattedDate}-${log.memo_title}`] || `https://www.kabudragon.com/chart/s=${log.stock_id}/e=${selectedDates[`${log.stock_id}-${imageFormattedDate}-${log.memo_title}`]?.replace(/-/g, '').slice(2) || imageFormattedDate}.png`}
                  alt="Stock Image"
                  onClick={() => handleImageClick(log.stock_id, imageFormattedDate, 1, log.memo_title, false, selectedDates[`${log.stock_id}-${imageFormattedDate}-${log.memo_title}`]?.replace(/-/g, '').slice(2) || calendarFormattedDate)}
                />
                <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-black bg-white p-1 rounded">
                  {chartLabels[`${log.stock_id}-${imageFormattedDate}-${log.memo_title}`] || '日足'}
                </span>
              </div>
              <div className='flex justify-between items-center mt-8'>
                <span className="text-gray-500 text-lg">{formattedDate}</span>
                <input
                  type="date"
                  id="start"
                  name="trip-start"
                  value={selectedDates[`${log.stock_id}-${imageFormattedDate}-${log.memo_title}`] || formattedDate}
                  min="2018-01-01"
                  onChange={(e) => handleDateChange(e, log.stock_id, calendarFormattedDate, log.memo_title, imageFormattedDate, log.stock_id)}
                  className="border rounded p-1"
                />
              </div>
              <div className="mb-2 break-words overflow-hidden flex items-center" >
                <span className="font-bold text-lg">{log.memo_title}</span>
              </div>
              <div className="mb-2 flex-grow overflow-y-scroll">
                <h3>{log.memo_title}</h3>
                {renderDraftContent(log.memo)}
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default LogModal