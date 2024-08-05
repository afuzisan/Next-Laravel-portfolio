'use client'
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import laravelAxios from "@/lib/laravelAxios";
import { Editor, EditorState, convertFromRaw, CompositeDecorator } from 'draft-js';
import { FaExpand } from 'react-icons/fa';

const LogModal = ({ modalIsOpen, closeModal, modalContent, resultStocks }) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [content, setContent] = useState(null);
  const [chartCount, setChartCount] = useState(0);
  const [chartImages, setChartImages] = useState({});
  const [chartLabels, setChartLabels] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenLog, setFullScreenLog] = useState(null);

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
    initStockLog(apiUrl);
  }, []);

  const initStockLog = async (apiUrl) => {
    try {
      console.log(modalContent)
      console.log(modalContent.StockCode)
      const response = await laravelAxios.get(`${apiUrl}/api/log/getStockLog?stockCode=${modalContent.StockCode}`);
      const log = response.data.memo_logs;
      console.log(log)
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

    if (newCount === 0) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/e=${newDate}.png`;
      newChartLabel = '日足';
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

  const handleFormattedDate = (formattedDate, stockCode, imageFormattedDate, memoTitle) => {
    console.log(formattedDate)
    const key = `${stockCode}-${imageFormattedDate}-${memoTitle}`;
    const currentCount = chartCount[key] || 0;
    setSelectedDates(prevDates => ({ ...prevDates, [key]: formattedDate }));
    handleImageClick(stockCode, imageFormattedDate, 0, memoTitle, false, formattedDate.replace(/-/g, '').slice(2), currentCount);
  }

  const handleCardClick = (log) => {
    setFullScreenLog(log);
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
    setFullScreenLog(null);
  };

  const getStockInfo = () => {
    if (modalContent?.memo_logs?.length > 0 && resultStocks) {
      let stock = resultStocks.find(stock => Number(stock.id) === Number(modalContent.memo_logs[0].stock_id));
      if (!stock) {
        stock = resultStocks[0];
      }
      return stock ? { stock_name: stock.stock_name, stock_code: stock.stock_code } : null;
    }
    return null;
  }


  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Stock Code Modal"
      ariaHideApp={false}
    >
      <div className="flex justify-end items-center">
        <button onClick={closeModal} className="bg-none border-none text-2xl cursor-pointer">×</button>
      </div>
      <div className="flex flex-wrap justify-start mt-6">
        {modalContent.memo_logs && modalContent.memo_logs.map((log, index) => {
          const formattedDate = formatDate(log.updated_at, '-');
          const imageFormattedDate = formatDate(log.updated_at, '', 2);
          const calendarFormattedDate = formatDate(log.updated_at, '', 0);
          return (
            <div
              key={index}
              className={`border mb-4 p-4 w-[400px] rounded shadow grid grid-rows-[200px,50px,50px,auto] gap-2 h-[600px] mx-2 flex-grow-0 flex-shrink-0 basis-[calc(100%-1rem)] sm:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1rem)] ${isFullScreen && fullScreenLog === log ? 'fixed top-0 left-0 w-full h-full bg-white z-50 grid-rows-[300px,50px,50px,auto] justify-center p-6' : ''}`}
            >
              <div className="relative">
                <img
                  className={`w-full h-[200px] mt-8 object-cover rounded cursor-pointer ${isFullScreen && fullScreenLog === log ? 'w-[800px] h-[300px] mt-8 object-cover rounded cursor-pointer object-contain' : ''}`}
                  src={chartImages[`${getStockInfo().stock_code}-${imageFormattedDate}-${log.memo_title}`] || `https://www.kabudragon.com/chart/s=${getStockInfo().stock_code}/e=${selectedDates[`${getStockInfo().stock_code}-${imageFormattedDate}-${log.memo_title}`]?.replace(/-/g, '').slice(2) || imageFormattedDate}.png`}
                  alt="Stock Image"
                  onClick={(e) => { e.stopPropagation(); handleImageClick(getStockInfo().stock_code, imageFormattedDate, 1, log.memo_title, false, selectedDates[`${getStockInfo().stock_code}-${imageFormattedDate}-${log.memo_title}`]?.replace(/-/g, '').slice(2) || calendarFormattedDate); }}
                />
                <span className="border absolute top-[-3px] left-0 text-black bg-white p-1 rounded truncate max-w-[200px]">{getStockInfo().stock_name}({getStockInfo().stock_code})</span>
                <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-black bg-white p-1 rounded ">
                  {chartLabels[`${getStockInfo().stock_code}-${imageFormattedDate}-${log.memo_title}`] || '日足'}
                </span>
                <button
                  className={`absolute top-1 right-1 bg-none border-none text-gray-500 cursor-pointer ${isFullScreen && fullScreenLog === log ? 'hidden' : ''}`}
                  onClick={() => handleCardClick(log)}
                >
                  <FaExpand />
                </button>
              </div>
              <div className={`flex justify-between items-center mt-10 ${isFullScreen && fullScreenLog === log ? 'w-[800px] mt-12' : ''}`}>
                <div className="flex items-center">
                  <span className="text-lg">編集日：</span>
                  <button className="text-lg hover:bg-gray-100 p-1 rounded" onClick={() => handleFormattedDate(formattedDate, getStockInfo().stock_code, imageFormattedDate, log.memo_title)}>{formattedDate}</button>
                </div>
                <input
                  type="date"
                  id="start"
                  name="trip-start"
                  value={selectedDates[`${getStockInfo().stock_code}-${imageFormattedDate}-${log.memo_title}`] || formattedDate}
                  min="2018-01-01"
                  onChange={(e) => handleDateChange(e, getStockInfo().stock_code, calendarFormattedDate, log.memo_title, imageFormattedDate, getStockInfo().stock_code)}
                  className="border rounded p-1"
                />
              </div>
              <div className={`mt-2 mb-2 break-words overflow-hidden flex items-center ${isFullScreen && fullScreenLog === log ? 'w-[800px] mt-6' : ''}`} >
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
      {isFullScreen && (
        <button onClick={handleCloseFullScreen} className="fixed top-4 right-4 bg-none border-none text-2xl cursor-pointer z-50">×</button>
      )}
    </Modal>
  )
}

export default LogModal