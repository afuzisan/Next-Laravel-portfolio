import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
    return (
        <div className="grid p-6 justify-center bg-white justify-center" >
            <Link
                href="/mypage/linkedit"
                className="text-sm text-gray-700 underline"
            >
                投資系サイトへのリンク編集
            </Link>
            <div>投資系サイトへのリンク編集</div>
            <div>１ページに表示する銘柄数の編集</div>
            <div>パスワードリセットへのボタンリンク</div>
            <div>アカウント削除</div>
            <div>チャート表示切り替え編集aaa</div>
        </div>
    )
}

export default Sidebar