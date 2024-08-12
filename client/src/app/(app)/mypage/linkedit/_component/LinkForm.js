import laravelAxios from '@/lib/laravelAxios'
import { logError } from '@/lib/logError'
import { Button } from '@@/(app)/mypage/linkedit/_component/Button'
import { Input } from '@@/(app)/mypage/linkedit/_component/Input'
import { Label } from '@@/(app)/mypage/linkedit/_component/Label'
import { useState } from 'react'

const LinkForm = ({ onRefetch }) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [url, setUrl] = useState('')
  const [site_name, setName] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await laravelAxios.post(
        `${apiUrl}/api/mypage/externallinks/create`,
        {
          url,
          site_name,
        },
        {
          withCredentials: true,
        },
      )
      onRefetch()
      setUrl('')
      setName('')
    } catch (error) {
      logError(error)
    }
  }

  return (
    <form className="space-y-4 col-span-1 mr-3.5" onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="url" className="">
            <span className="flex justify-between items-end">
              <span className="">URL</span>

              <span>
                <span className="font-bold text-red-600">[code]</span>
                <span>は証券コードに置換されます。</span>
              </span>
            </span>
          </Label>

          <Input
            id="url"
            type="url"
            placeholder="(例) https://kabutan.jp/stock/finance?code=[code]"
            className="w-full placeholder-gray-200"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="(例) 株探"
            className="w-full placeholder-gray-200"
            value={site_name}
            onChange={e => setName(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        リンクを追加
      </Button>
    </form>
  )
}

export default LinkForm
