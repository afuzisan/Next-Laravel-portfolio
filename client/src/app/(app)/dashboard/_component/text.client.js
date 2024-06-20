'use client'
import React, { useEffect, useState } from 'react';

const Text = ({url}) => {

    const [data, setData] = useState(null);

    const fetchData = async () => {
        console.log(url)
        const response = await fetch(url);
        console.log(response)
        const result = await response.json();
        setData(result);
    };


    return (
        <div>
            <button onClick={() => fetchData()}>あああ</button>
            {data && <p>{data.name}</p>}
        </div>
    );
};

export default Text