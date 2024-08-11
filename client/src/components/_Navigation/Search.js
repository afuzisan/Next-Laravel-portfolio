'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const Search = () => {
  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState('title')
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)

  const searchSubmit = async () => {
    if (search.trim() === '') return
    setIsSearching(true)
    await router.push(`/search?search=${search}&searchType=${searchType}`)
    setIsSearching(false)
  }

  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center w-full max-w-4xl px-6">
        <div className="relative flex-grow">
          <input
            type="text"
            className="w-full px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg"
            placeholder="検索..."
            onKeyDown={e => {
              if (e.key === 'Enter') searchSubmit()
            }}
            onChange={e => setSearch(e.target.value)}
            value={search}
            disabled={isSearching}
          />
          {search && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
              onClick={() => setSearch('')}
            >
              ✕
            </button>
          )}
          {isSearching && (
            <span className="absolute right-10 top-1/2 transform -translate-y-1/2">
              検索中...
            </span>
          )}
        </div>
        <select
          className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300"
          onChange={e => setSearchType(e.target.value)}
        >
          <option value="memo">メモ</option>
          <option value="stock">証券コード</option>
        </select>
        <button
          className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
          onClick={searchSubmit}
        >
          検索
        </button>
      </div>
    </div>
  )
}

export default Search
