'use client'

import React, { useEffect, useState, createContext } from 'react'
import Memos from '@Dashboard/memos.client'
import LinkComponent from '@Dashboard/LinkComponent'
import laravelAxios from '@/lib/laravelAxios'

import LogModal from '@Dashboard/_MemoFetchComponents/LogModal.client'

function formatDateToISO(date) {
  const pad = num => String(num).padStart(2, '0')
  const year = date.getUTCFullYear()
  const month = pad(date.getUTCMonth() + 1)
  const day = pad(date.getUTCDate())

  return `${year}-${month}-${day}`
}

// 編集可能か判定するコンテキストを作成
export const EditableContext = createContext()

const MemoFetch = ({
  refreshKey,
  sortOrder,
  currentPage,
  itemsPerPage,
  setItemsPerPage,
  onDataFetched,
  param,
  setTotalStockCount,
  onDataResult,
  categoryList,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [MemoRefreshKey, setMemoRefreshKey] = useState(0)
  const [isEditable, setIsEditable] = useState(true)
  const [formattedDate, setFormattedDate] = useState('')
  const [InitialChartImage, setInitialChartImage] = useState('')
  const [chartCount, setChartCount] = useState(0)
  const [chartImages, setChartImages] = useState({})
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [selectedCategories, setSelectedCategories] = useState({})
  const [chartLabels, setChartLabels] = useState({})
  const [selectedDates, setSelectedDates] = useState({})

  useEffect(() => {
    if (result && onDataResult) {
      const initialCategories = result.stocks.reduce((acc, stock, index) => {
        acc[stock.stock_code] =
          stock.categories && stock.categories[0]
            ? stock.categories[0].name
            : '未分類'
        return acc
      }, {})
      setSelectedCategories(initialCategories)
    }
  }, [result, onDataResult])

  const handleImageClick = (stockCode, DateChange, newDate) => {
    const key = `${stockCode}-handleDateChange`
    const selectedDate = formatDate(newDate, '', 2)

    const newCount = DateChange ? chartCount : (chartCount + 1) % 3

    let newChartImage
    let newChartLabel

    if (newCount === 0) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/e=${selectedDate}.png`
      newChartLabel = '日足'
    } else if (newCount === 1) {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=1/e=${selectedDate}.png`
      newChartLabel = '週足'
    } else {
      newChartImage = `https://www.kabudragon.com/chart/s=${stockCode}/a=2/e=${selectedDate}.png`
      newChartLabel = '月足'
    }

    setChartImages(prevImages => ({
      ...prevImages,
      [stockCode]: newChartImage,
    }))
    setChartLabels(prevLabels => ({
      ...prevLabels,
      [stockCode]: newChartLabel,
    }))

    if (!DateChange) {
      setChartCount(newCount)
    }
  }

  const handleDelete = stockCode => {
    if (window.confirm(`${stockCode}を本当に削除しますか？`)) {
      laravelAxios
        .post(`${apiUrl}/api/dashboard/stockDelete`, {
          stockNumber: stockCode,
        })
        .then(() => {
          refreshKey()
        })
        .catch(error => {
          process.env.NODE_ENV === 'development'
            ? console.error('Error fetching data:', error)
            : ''
        })
    }
  }
  const handleLog = async stockCode => {
    try {
      const response = await laravelAxios.get(
        `http://localhost:8080/api/log/getStockLog?stockCode=${stockCode}`,
      )
      const log = response.data
      setModalContent(log)
    } catch (error) {
      process.env.NODE_ENV === 'development'
        ? console.error('Error fetching data:', error)
        : ''
    }
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const handleCategoryChange = (stockCode, value) => {
    setSelectedCategories(prev => ({ ...prev, [stockCode]: value }))
    laravelAxios.post(`${apiUrl}/api/Categories/update`, {
      stockCode: stockCode,
      category: value,
    })
  }

  const handleDateChange = (e, stockCode) => {
    const newDate = e.target.value
    const key = `${stockCode}-handleDateChange`
    let DateChange = true
    setSelectedDates(prevDates => ({ ...prevDates, [key]: newDate }))
    handleImageClick(stockCode, DateChange, newDate)
  }

  const formatDate = (dateString, type, sliceNumber) => {
    const date = new Date(dateString)
    const year = date.getFullYear().toString().slice(sliceNumber)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    if (type !== '') {
      return `${year}${type}${month}${type}${day}`
    }
    return `${year}${month}${day}`
  }
  useEffect(() => {
    // const newDate = new Date();
    const formattedCalender = formatDate(new Date(), '-', 2)
    const formattedURL = formatDate(new Date(), '', 2)
    setFormattedDate(formattedCalender)
    setInitialChartImage(
      `https://www.kabudragon.com/chart/s=[code]/e=${formattedURL}.png`,
    )
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await initFetch(
          currentPage,
          itemsPerPage,
          setTotalStockCount,
          setItemsPerPage,
          apiUrl,
        )
        if (data && data.memo_display_number) {
          setItemsPerPage(data.memo_display_number)
        }

        // ソート処理を追加
        if (sortOrder === 'dateDesc') {
          data.stocks.sort(
            (a, b) =>
              new Date(b.memos[0].created_at) - new Date(a.memos[0].created_at),
          )
        } else if (sortOrder === 'dateAsc') {
          data.stocks.sort(
            (a, b) =>
              new Date(a.memos[0].created_at) - new Date(b.memos[0].created_at),
          )
        } else if (sortOrder === 'codeDesc') {
          data.stocks.sort((a, b) => b.stock_code.localeCompare(a.stock_code))
        } else if (sortOrder === 'codeAsc') {
          data.stocks.sort((a, b) => a.stock_code.localeCompare(b.stock_code))
        }

        setResult(data)
        onDataFetched(data) // 親コンポーネントにデータを渡す
      } catch (error) {
        process.env.NODE_ENV === 'development'
          ? console.error('Error fetching data:', error)
          : ''
        setError(error)
      }
    }
    fetchData()
  }, [MemoRefreshKey, sortOrder, currentPage, param]) // paramを依存に追加

  if (error) {
    if (error.response && error.response.status === 409) {
      return <div>メール認証を完了してください</div>
    }
    return <div>新しく銘柄を登録してください</div>
  }

  if (!result) {
    return <div>Loading...</div>
  }

  return (
    <EditableContext.Provider value={[isEditable, setIsEditable]}>
      <LogModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        modalContent={modalContent}
        resultStocks={result.stocks}
      />

      {result && result.stocks && result.stocks.length > 0 ? (
        result.stocks.map((stock, index) => {
          return (
            <div key={stock.stock_code} id={stock.stock_code}>
              <div className="grid grid-cols-6 border px-3 py-2">
                <div className="col-span-3 flex items-center">
                  <span className="grid-item px-6">
                    {stock.memos.length > 0
                      ? formatDateToISO(new Date(stock.memos[0].created_at))
                      : 'N/A'}
                  </span>
                  <span className="grid-item px-6">{stock.stock_name}</span>
                  <span className="grid-item px-6">{stock.stock_code}</span>
                </div>
                <div className="col-span-3 flex justify-end ">
                  <select
                    id="mySelect"
                    className="max-w-60 mr-4 border border-gray-300 rounded-md"
                    value={selectedCategories[stock.stock_code] || '未分類'}
                    onChange={e =>
                      handleCategoryChange(stock.stock_code, e.target.value)
                    }
                  >
                    {categoryList &&
                      categoryList.map((category, index) => (
                        <option
                          className="bg-white text-gray-700"
                          value={category}
                          key={index}
                        >
                          {category}{' '}
                        </option>
                      ))}
                  </select>
                  <button
                    className="pr-4 pl-4 hover:bg-red-100 bg-gray-100"
                    onClick={() => handleLog(stock.stock_code)}
                  >
                    編集履歴
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 hover:bg-red-700"
                    onClick={() => handleDelete(stock.stock_code)}
                  >
                    {stock.stock_code}を削除
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_3fr_3fr] h-[320px]">
                <div className="grid-item p-2 overflow-y-auto h-80 whitespace-break-spaces border-l">
                  <LinkComponent
                    links={result.links}
                    stock={stock.stock_code}
                  />
                </div>
                <Memos
                  key={`${stock.stock_code}-${MemoRefreshKey}`}
                  memos={stock.memos}
                  stock={stock.stock_code}
                  name={stock.stock_name}
                  setMemoRefreshKey={setMemoRefreshKey}
                />
                <div className="grid-item pl-2 relative">
                  <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-black bg-white p-1 rounded ">
                    {chartLabels[stock.stock_code] || '日足'}
                  </span>
                  <img
                    src={
                      chartImages[stock.stock_code] ||
                      InitialChartImage.replace('[code]', stock.stock_code)
                    }
                    className="h-full w-full object-scale-down border-r cursor-pointer"
                    onClick={() => handleImageClick(stock.stock_code, false)}
                  />
                  <input
                    type="date"
                    id="start"
                    name="trip-start"
                    value={`${selectedDates[`${stock.stock_code}-handleDateChange`] || formatDate(new Date(), '-', 0)}`}
                    min="2018-01-01"
                    onChange={e => handleDateChange(e, stock.stock_code)}
                    className="border rounded p-1 absolute top-2 right-2 text-black bg-white p-1"
                  />
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div>No data available</div>
      )}
    </EditableContext.Provider>
  )
}
const initFetch = async (
  param,
  itemsPerPage,
  setTotalStockCount,
  setItemsPerPage,
  apiUrl,
) => {
  try {
    const result = await laravelAxios.get(
      `${apiUrl}/api/dashboard/reviews?param=${param}&page=${itemsPerPage}`,
      { cache: 'no-cache' },
    )
    setTotalStockCount(result.data.totalStockCount)
    return result.data.user
  } catch (error) {
    process.env.NODE_ENV === 'development'
      ? console.error('Error fetching data:', error)
      : ''
    throw error
  }
}

export default MemoFetch
