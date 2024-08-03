'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MainContents = () => {
    const [showNewContent, setShowNewContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowNewContent(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {!showNewContent ? (
                <>
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl font-bold mb-6 text-gray-800"
                    >
                        incoll
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-2xl mb-8 text-gray-600"
                    >
                        効率的な銘柄管理で、賢明な投資判断をサポート
                    </motion.p>
                    <motion.ul
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="text-left mb-8 space-y-4"
                    >
                        {['迅速な銘柄登録・管理', 'スマートなカテゴリ分類', '柔軟なソート機能', '直感的な操作性'].map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
                                className="text-lg text-gray-700"
                            >
                                ✓ {item}
                            </motion.li>
                        ))}
                    </motion.ul>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <iframe width="1120" height="630" src="https://www.youtube.com/embed/MCbWqLZnssE?si=NKrIlUB_qREf1XxL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </motion.div>
            )}
        </>
    )
}

export default MainContents