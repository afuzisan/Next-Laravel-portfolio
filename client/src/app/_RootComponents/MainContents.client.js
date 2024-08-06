'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'

export default function MainContents() {
  const { user } = useAuth({ middleware: 'guest' })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-col items-center justify-center bg-primary p-8 text-primary-foreground md:w-1/2">
        <div className="flex flex-col items-center gap-4 text-[#4b4b4b]">
          <img src="/note.jpeg" alt="incoll vol.2" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">incoll vol.2</h1>
          <p className="max-w-md text-center ">
            投資アイデアを整理し、洞察を深める。
            <br />
            あなたの投資戦略を最適化するメモツール。
          </p>

          <div className="flex gap-2 justify-center">
            <div className="hidden  px-6 py-4 sm:block items-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="ml-4 text-sm text-gray-700 underline"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 underline"
                  >
                    ログイン
                  </Link>

                  <Link
                    href="/register"
                    className="ml-4 text-sm text-gray-700 underline"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </div>

            {/* <button className="bg-primary-foreground text-primary rounded-md px-4 py-2 border-2 border-primary-foreground text-[#4b4b4b] border-color-[#4b4b4b]">ログイン</button>
            <button className="bg-primary-foreground text-primary rounded-md px-4 py-2 border-2 border-primary-foreground text-[#4b4b4b] border-color-[#4b4b4b]">サインアップ</button> */}
          </div>
        </div>
      </div>
      <div className="relative md:w-1/2 overflow-hidden">
        <video
          src="/TopPageVideo.mp4"
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
    </div>
  )
}