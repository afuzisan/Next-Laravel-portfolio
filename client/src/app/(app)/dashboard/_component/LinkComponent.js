import React from 'react';
import Link from 'next/link'; // Next.jsのLinkをインポート


const replace = (links, stock) => {
    const result = links.map((link) => {
        return {
            ...link,
            url: link.url.replace('[code]', stock)
        };
    });
    return result;
}

const LinkComponent = ({ links, stock }) => {
    const result =  replace(links,stock)
    console.log(result)
    return (
        <ul>
            {result.map((link, index) => (
                <li key={index}>
                    <Link href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.site_name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default LinkComponent;
