import Image from 'next/image' // 追加: next/imageからImageをインポート
import Link from 'next/link' // Next.jsのLinkをインポート

const replace = (links, stock) => {
  if (!links) return [] // 追加: linksがundefinedの場合の処理
  const result = links.map(link => {
    return {
      ...link,
      url: link.url.replace('[code]', stock),
    }
  })
  return result
}

const LinkComponent = ({ links, stock }) => {
  const result = replace(links, stock)
  return (
    <ul>
      {result.map(link => (
        <Link
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          key={link.id}>
          <li className="p-2 transition hover:bg-red-100 flex items-center rounded-lg">
            <Image
              src={`http://www.google.com/s2/favicons?domain=${link.url}`}
              alt={link.site_name}
              width={16} // 適切な幅を指定
              height={16} // 適切な高さを指定
              className="mr-2 flex-shrink-0"
            />
            <span className="break-words flex-1 overflow-hidden">
              {link.site_name}
            </span>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default LinkComponent
