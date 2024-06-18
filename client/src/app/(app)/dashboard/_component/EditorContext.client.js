'use client'

import React, { createContext, useState, useContext } from 'react';

const EditorContext = createContext();

export const useEditorContext = () => useContext(EditorContext);

export const EditorProvider = ({ children, initialData }) => {
  const [editorText, setEditorText] = useState(initialData || '');

  return (
    <EditorContext.Provider value={{ editorText, setEditorText }}>
      {children}
    </EditorContext.Provider>
  );
};