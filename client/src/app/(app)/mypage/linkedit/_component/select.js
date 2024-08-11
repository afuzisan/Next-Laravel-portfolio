import React from 'react'

const Select = () => {
  return (
    <select name="Links" size="1">
      <option selected="selected">追加するリンクをお選びください</option>
      <option value="Kabutan">株探</option>
      <option value="YahooFinance">Yahooファイナンス</option>
      <option value="BuffetCode">バフェット・コード</option>
      <option value="TradingView">TradingView</option>
      <option value="X">X</option>
    </select>
  )
}

export default Select
