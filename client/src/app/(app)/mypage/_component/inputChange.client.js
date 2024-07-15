"use client"

import { useState, useEffect } from "react"
import laravelAxios from "@/lib/laravelAxios";

const InputChange = ({ info = { placeholder: '入力欄', initialValue: '', type: 'text'} }) => {
    const { placeholder, initialValue, type} = info;
    const [inputValue, setInputValue] = useState(initialValue);

    useEffect(() => {
        console.log('info:', info);
        console.log('initialValue:', initialValue);
    }, [info, initialValue]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            console.log('inputValue:', inputValue);
            // await laravelAxios.post('/api/update', { value: inputValue });
        } catch (error) {
            console.error('Error updating value:', error);
        }
    };

    return (
        <div>
            <input
                placeholder={placeholder}
                type={type}
                onChange={handleInputChange}
                value={inputValue}
                className="w-full"
            />
            <button 
                onClick={handleSubmit} 
                className="bg-blue-500 text-white px-4 py-2 cursor-pointer border-color-blue-500 w-full mt-2"
            >
                変更
            </button>
        </div>
    );
};

export default InputChange;