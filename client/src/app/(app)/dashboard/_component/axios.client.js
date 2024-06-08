'use client'

import axios from "@/lib/axios";
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [responseContent, setResponseContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/reviews');
        console.log('response', response);
        console.log('response.data', response.data);
        setResponseContent(response.data[0].memo);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error;
          console.error(
            'APIリクエストでエラーが発生しました:',
            axiosError.response?.data || 'エラー情報が取得できません'
          );
        } else {
          console.error('その他エラーが発生しました:', error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {responseContent}
       {/* {responseContent ? JSON.stringify(responseContent, null, 2) : 'データがありません'} */}
    </div>
  );
}

export default Home;
