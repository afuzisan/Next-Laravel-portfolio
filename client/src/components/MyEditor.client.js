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
import NextLink from 'next/link'; // Next.jsのLinkコンポーネントをインポート

// Link コンポーネントをここに移動
const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <NextLink href={url} className='text-blue-600 ' target="_blank">
      {props.children}
    </NextLink>
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

  const [readonly, setReadOnly] = useState(true);

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
    <div className='break-words overflow-y-auto h-80'>
      <div className='border-b-4 pt-1 pr-1 pl-1 sticky top-0 bg-white'>
        {readonly ? (
          <button onClick={() => setReadOnly(false)} className=" text-black font-bold">
            編集
          </button>
        ) : (
          <button onClick={() => { saveContent(); setReadOnly(true) }} className="text-black font-bold">保存</button>
        )}
      </div>
      <div readonly className={readonly ? "p-1 bg-sky-500/50" : "p-1"}>
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
    </div>
  );
};

export default MyEditor;