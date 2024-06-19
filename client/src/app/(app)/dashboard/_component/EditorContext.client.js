'use client'

import React, { createContext, useState, useContext } from 'react';
import {
  EditorState,
} from 'draft-js';

const EditorContext = createContext();
const IndexSave = createContext();

export const useEditorContext = () => useContext(EditorContext);
export const useIndexSave = () => useContext(IndexSave);

export const EditorProvider = ({ children, initialData }) => {
  const [editor, setEditor] = useState(() =>
    EditorState.createEmpty()
  );

  const [indexSaveState, setIndexSave] = useState(0);

  return (
    <IndexSave.Provider value={[indexSaveState, setIndexSave]}>
      <EditorContext.Provider value={[editor, setEditor]}>
        {children}
      </EditorContext.Provider>
    </IndexSave.Provider>
  );
};