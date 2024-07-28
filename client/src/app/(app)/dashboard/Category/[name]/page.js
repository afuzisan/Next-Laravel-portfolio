'use client'
import laravelAxios from '@/lib/laravelAxios';
import React, { useState, useEffect } from 'react';

const page = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        laravelAxios.get('http://localhost:8080/api/category/index')
            .then(response => response.data)
            .then(data => setCategory(data));
    }, []);

    return (
        <div>
            {category.map(cat => (
                <div key={cat.id}>
                    <h2>{cat.name}</h2>
                    <p>Order: {cat.order}</p>
                    <p>Stock ID: {cat.stock_id}</p>
                    <p>User ID: {cat.user_id}</p>
                    <p>Created At: {cat.created_at}</p>
                    <p>Updated At: {cat.updated_at}</p>
                </div>
            ))}
        </div>
    );
}

export default page;