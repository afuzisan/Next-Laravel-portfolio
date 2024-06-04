import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
    return (
        <div className="grid justify-center bg-white items-center py-6" >
            <Link
                href="/mypage/linkedit"
                className="text-sm text-gray-700 underline py-2"
            >
                投資系サイトへのリンク編集
            </Link>
            <Link
                href="/mypage/stocks"
                className="text-sm text-gray-700 underline py-6"
            >
                １ページに表示する銘柄数の編集
            </Link>
            <Link
                href="/mypage/chatswitch"
                className="text-sm text-gray-700 underline py-6"
            >
                <div>チャート表示切り替え編集</div>
            </Link>
            <Link
                href="/mypage/"
                className="text-sm text-gray-700 underline py-6"
            >
                <div>パスワードリセットへのボタンリンク</div>
            </Link>
            <Link
                href="/mypage/accountdelete"
                className="text-sm text-gray-700 underline py-6"
            >
                <div>アカウント削除</div>
            </Link>
   
        </div>
    )
}

export default Sidebar