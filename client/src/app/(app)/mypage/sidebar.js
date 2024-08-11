import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
  ;<div className="grid justify-center bg-white items-center py-6 " />
  return (
    <div className="bg-background text-foreground rounded-lg overflow-hidden">
      <div className="p-6 max-h-[500px] overflow-auto">
        <div className="grid">
          <Link
            href="/mypage/linkedit"
            className="flex items-center gap-4 hover:bg-gray-100 transition duration-300 p-2 rounded-lg"
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <LinkIcon className="h-6 w-6" />
            </div>
            <div>
              <div>リンクの設定</div>
            </div>
          </Link>
          <Link
            href="/mypage/stocks"
            className="flex items-center gap-4 hover:bg-gray-100 transition duration-300 p-2 rounded-lg"
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <div>表示銘柄数の変更</div>
            </div>
          </Link>
          <Link
            href="/mypage/passwordreset"
            className="flex items-center gap-4 hover:bg-gray-100 transition duration-300 p-2 rounded-lg"
          >
            <div className="bg-green-500 text-green-50 rounded-full p-3">
              <LockIcon className="h-6 w-6" />
            </div>
            <div>
              <div>パスワードリセット</div>
              <p className="text-muted-foreground text-sm" />
            </div>
          </Link>
          <Link
            href="/mypage/accountdelete"
            className="flex items-center gap-4 hover:bg-gray-100 transition duration-300 p-2 rounded-lg"
          >
            <div className="bg-red-500 text-red-50 rounded-full p-3">
              <TrashIcon className="h-6 w-6" />
            </div>
            <div>
              <div>アカウント削除</div>
              <p className="text-muted-foreground text-sm" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

function LinkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default Sidebar
