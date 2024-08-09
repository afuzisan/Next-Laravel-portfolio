import React from 'react'
import SearchGet from './_components/SearchGet.client'

export async function generateMetadata({ searchParams }) {
  const siteName = process.env.SITE_NAME || '';
  const query = searchParams.search || '';
  return {
      title: `${query ? `${query} - ` : ''}検索 | ${siteName}`,
  };
}

const Search = () => {


  return (
    <SearchGet />
  )
}

export default Search