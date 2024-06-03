import React from 'react';
import Link from 'next/link'; // Next.jsのLinkをインポート

const LinkComponent = ({ links }) => {
    return (
        <ul>
            {links.map((link, index) => (
                <li key={index}>
                    <Link href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default LinkComponent;
