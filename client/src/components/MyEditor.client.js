'use client'

import { useEffect, useMemo, useState } from 'react';
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
import Editor from '@draft-js-plugins/editor';
import createInlineToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/inline-toolbar';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
} from '@draft-js-plugins/buttons';
import createLinkPlugin from '@draft-js-plugins/anchor';
import '@draft-js-plugins/anchor/lib/plugin.css';
import createImagePlugin from '@draft-js-plugins/image';
import '@draft-js-plugins/image/lib/plugin.css';
import linkStyles from './linkStyles.module.css';

// Link コンポーネントをここに移動
const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url}>
      {props.children}
    </a>
  );
};

const MyEditor = () => {
  const [plugins, InlineToolbar, LinkButton, linkPlugin, decorator] = useMemo(() => {
    const linkPlugin = createLinkPlugin({
      theme: linkStyles,
      placeholder: 'http://...'
    });
    const imagePlugin = createImagePlugin();
    const inlineToolbarPlugin = createInlineToolbarPlugin({
      structure: [BoldButton, ItalicButton, UnderlineButton, linkPlugin.LinkButton],
    });
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
      // 他のデコレータ設定があればここに追加
    ]);
    return [
      [inlineToolbarPlugin, linkPlugin, imagePlugin],
      inlineToolbarPlugin.InlineToolbar,
      linkPlugin.LinkButton,
      linkPlugin,
      decorator,
    ];
  }, []);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [readonly, setReadOnly] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('test');
    if (raw) {
      const contentState = convertFromRaw(JSON.parse(raw));
      const newEditorState = EditorState.createWithContent(contentState, decorator);
      setEditorState(newEditorState);
    }
  }, [decorator]);

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    localStorage.setItem('test', JSON.stringify(raw, null, 2));
  };

  const onChange = (value) => {
    setEditorState(value);
  };

  const handleDroppedFiles = (selection, files) => {
    insertImage('logo192.png');
  };

  const insertImage = (url) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    onChange(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
    );
  };

  function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  }

  return (
    <div>
      <div>
        {!readonly && <button onClick={saveContent}>保存</button>}
        {readonly ? (
          <button onClick={() => setReadOnly(false)}>Edit</button>
        ) : (
          <button onClick={() => setReadOnly(true)}>ReadOnly</button>
        )}
      </div>
      <Editor
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
        readOnly={readonly}
        handleDroppedFiles={handleDroppedFiles}
        decorators={[decorator]}
      />
      <InlineToolbar>
        {(externalProps) => (
          <>
            <ItalicButton {...externalProps} />
            <BoldButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <Separator {...externalProps} />
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <HeadlineThreeButton {...externalProps} />
            <LinkButton {...externalProps} />
          </>
        )}
      </InlineToolbar>
    </div>
  );
};

export default MyEditor;