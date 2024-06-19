'use client'

import React, { createContext, useState, useContext } from 'react';
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  AtomicBlockUtils,
  ContentState,
  Modifier,
  Entity,
  CompositeDecorator,
} from 'draft-js';

const EditorContext = createContext();

export const useEditorContext = () => useContext(EditorContext);

export const EditorProvider = ({ children, initialData }) => {
  const [editor, setEditor] = useState(() =>
    EditorState.createEmpty()
  );
  console.log(editor)

  return (
    <EditorContext.Provider value={[editor, setEditor]}>
      {children}
    </EditorContext.Provider>
  );
};