'use client'
import React, { useEffect, useState } from 'react'
import laravelAxios from '@/lib/laravelAxios'
import {
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js'
// import Calendar from '@/app/(app)/stocks/[stock]/_LogComponent/Calendar.client';

const page = ({ params }) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [content, setContent] = useState(null)
  const [chartCount, setChartCount] = useState(0)
  const [chartImages, setChartImages] = useState({})
  const [chartLabels, setChartLabels] = useState({})
  const [selectedDates, setSelectedDates] = useState({})

  useEffect(() => {
    initStockLog()
  }, [])

  const initStockLog = async () => {
    try {
      const response = await laravelAxios.get(
        `${apiUrl}/api/log/getStockLog?stockCode=${params.StockCode}`,
      )
      const log = response.data.memo_logs
      setContent(log)
    } catch (error) {
      process.env.NODE_ENV === 'development'
        ? console.error('Error fetching data:', error)
        : ''
    }
  }

  const renderDraftContent = rawContent => {
    const contentState = convertFromRaw(JSON.parse(rawContent))
    const decorator = new CompositeDecorator([
      {
        strategy: (contentBlock, callback, contentState) => {
          contentBlock.findEntityRanges(character => {
            const entityKey = character.getEntity()
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'LINK'
            )
          }, callback)
        },
        component: props => {
          const { url } = props.contentState
            .getEntity(props.entityKey)
            .getData()
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue' }}
            >
              {props.children}
            </a>
          )
        },
      },
    ])
    const editorState = EditorState.createWithContent(contentState, decorator)
    return <Editor editorState={editorState} readOnly={true} />
  }

  const formatDate = (dateString, type, sliceNumber) => {
    const date = new Date(dateString)
    const year = date.getFullYear().toString().slice(sliceNumber)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    if (type === '-') {
      return `${year}-${month}-${day}`
    } else {
      return `${year}${month}${day}`
    }
  }

  const handleImageClick = (
    stockCode,
    imageFormattedDate,
    count,
    memoTitle,
    resetCount = false,
    newDate,
    currentCount,
  ) => {
    const key = `${stockCode}-${imageFormattedDate}-${memoTitle}`
    const newCount = resetCount
      ? count
      : (currentCount !== undefined ? currentCount : chartCount[key] || 0) +
        count
    let newChartImage
    let newChartLabel
    setChartCount(prevCount => ({ ...prevCount, [key]: newCount }))

    if (newCount === 0) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/e=${newDate}.png`
      newChartLabel = '日足'
    } else if (newCount === 1) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=1/e=${newDate}.png`
      newChartLabel = '週足'
    } else if (newCount === 2) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=2/e=${newDate}.png`
      newChartLabel = '月足'
    } else {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/e=${newDate}.png`
      newChartLabel = '日足'
      setChartCount(prevCount => ({ ...prevCount, [key]: 0 }))
    }

    setChartImages(prevImages => ({ ...prevImages, [key]: newChartImage }))
    setChartLabels(prevLabels => ({ ...prevLabels, [key]: newChartLabel }))
  }

  const handleDateChange = (
    e,
    stockId,
    calendarFormattedDate,
    memoTitle,
    imageFormattedDate,
    stockCode,
  ) => {
    const newDate = e.target.value
    const key = `${stockCode}-${imageFormattedDate}-${memoTitle}`
    const currentCount = chartCount[key] || 0 // 現在のカウントを取得
    setSelectedDates(prevDates => ({ ...prevDates, [key]: newDate }))
    handleImageClick(
      stockId,
      imageFormattedDate,
      0,
      memoTitle,
      false,
      newDate.replace(/-/g, '').slice(2),
      currentCount,
    )
  }
  return (
    <>
      <div className="">{params.StockCode}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 overflow-hidden">
        {content &&
          content.map((item, index) => {
            const formattedDate = formatDate(item.updated_at, '-')
            const imageFormattedDate = formatDate(item.updated_at, '', 2)
            const calendarFormattedDate = formatDate(item.updated_at, '', 0)

            return (
              <div
                key={index}
                className="border mb-4 p-4 rounded shadow grid grid-rows-[auto,50px,auto,auto] gap-2 h-[600px]"
              >
                <div className="relative">
                  <img
                    className="w-full h-auto mt-8"
                    src={
                      chartImages[
                        `${item.stock_id}-${imageFormattedDate}-${item.memo_title}`
                      ] ||
                      `https://www.kabudragon.com/chart/s=${item.stock_id}/e=${selectedDates[`${item.stock_id}-${imageFormattedDate}-${item.memo_title}`]?.replace(/-/g, '').slice(2) || imageFormattedDate}.png`
                    }
                    alt="Stock Image"
                    onClick={() =>
                      handleImageClick(
                        item.stock_id,
                        imageFormattedDate,
                        1,
                        item.memo_title,
                        false,
                        selectedDates[
                          `${item.stock_id}-${imageFormattedDate}-${item.memo_title}`
                        ]
                          ?.replace(/-/g, '')
                          .slice(2) || calendarFormattedDate,
                      )
                    }
                  />
                  <span className="absolute top-[0px] left-[39%] text-black bg-white p-1 rounded">
                    {chartLabels[
                      `${item.stock_id}-${imageFormattedDate}-${item.memo_title}`
                    ] || '日足'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-500 text-lg">
                      {formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="date"
                      id="start"
                      name="trip-start"
                      value={
                        selectedDates[
                          `${item.stock_id}-${imageFormattedDate}-${item.memo_title}`
                        ] || formattedDate
                      }
                      min="2018-01-01"
                      onChange={e =>
                        handleDateChange(
                          e,
                          item.stock_id,
                          calendarFormattedDate,
                          item.memo_title,
                          imageFormattedDate,
                          params.StockCode,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="mb-2 break-words overflow-hidden">
                  <span className="font-bold text-lg break-words overflow-hidden">
                    {item.memo_title}
                  </span>
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
