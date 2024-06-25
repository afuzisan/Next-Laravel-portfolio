"use client"

import { useState } from "react"

const InputChange = ({ info = { placeholder: '入力欄', initialValue: '', type: 'text', cName: '' } }) => {
    const { placeholder, initialValue, type, cName } = info;
    const [inputValue, setInputValue] = useState(initialValue);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <input
            placeholder={placeholder}
            type={type}
            onChange={handleInputChange}
            value={inputValue}
            className={cName}
        />
    );
};

export default InputChange;
