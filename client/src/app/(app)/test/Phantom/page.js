'use client'

import laravelAxios from '@/lib/laravelAxios';
import axios from 'axios';

import React from 'react'

const page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const handleClick = async () => {
        try {
            const response = await laravelAxios.post(`${apiUrl}/api/dashboard/PhantomJS`);
            console.log(response.data);
                console.log(response.data.result);
                console.log(response.data.result.content);
                console.log(response.data.result.content.data);
        } catch (error) {
            console.error('エラー:', error);
        }
    };


  return (
    <div>
        <button onClick={handleClick}>Click me</button>

    </div>
  )
}

export default page