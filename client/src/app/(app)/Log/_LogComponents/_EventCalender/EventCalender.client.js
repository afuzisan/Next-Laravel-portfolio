const EventCalender = ({ content }) => {
  return (
    <div>
      <h3>選択された日付のコンテンツ:</h3>
      <p style={{ whiteSpace: 'pre-line' }}>{content}</p> {/* 改行を反映 */}
    </div>
  )
}

export default EventCalender
