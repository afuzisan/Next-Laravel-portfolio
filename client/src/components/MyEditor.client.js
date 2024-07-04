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
import { useEditorContext, useIndexSave } from '../app/(app)/dashboard/_component/EditorContext.client';
import laravelAxios from '@/lib/laravelAxios';




const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <NextLink href={url} className='text-blue-600 ' target="_blank">
      {props.children}
    </NextLink>
  );
};

const MyEditor = ({ initMemo, initId }) => {



  const [indexSaveState, setIndexSave] = useIndexSave()
  const [editor, setEditor] = useEditorContext()
  const [plugins, InlineToolbar, LinkButton, linkPlugin, decorator] = useMemo(() => {
    const linkPlugin = createLinkPlugin({
      theme: linkStyles,
      placeholder: 'https://...'
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


  const [readonly, setReadOnly] = useState(true);

  /********************************************** 
   * TODO:データベースからデータを呼び出す処理を追加する
   * TODO:function:useEffect
  ***********************************************/
  useEffect(() => {
    let initialText = typeof initMemo === 'string' ? initMemo : '';
    let editorState;

    try {
      editorState = initialText ? JSON.parse(initialText) : {};
    } catch (error) {
      console.error('Failed to parse initialText:', error);
      editorState = {};
    }

    if (Object.keys(editorState).length === 0) {
      return;
    }

    const contentState = convertFromRaw(editorState);
    const newEditorState = EditorState.createWithContent(contentState, decorator);
    setIndexSave(initId);
    setEditor(newEditorState);
  }, [decorator, initMemo]);
  /********************************************** 
   * TODO:データベースに保存する処理を追加する
   * TODO:function:saveContent
  ***********************************************/
  const saveContent = async () => {
    const contentState = editor.getCurrentContent();
    const raw = convertToRaw(contentState);
    const url = 'http://localhost:8080/api/dashboard/memoUpdate';

    try {
      const response = await laravelAxios.post(url, JSON.stringify({
        memo: JSON.stringify(raw),
        memo_id: indexSaveState
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });

      const responseData = response.data;
      console.log('Saved successfully:', responseData);
    } catch (error) {
      console.error('Failed to save content:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
      }
    }
  };

  const onChange = (value) => {
    // エディタの状態が空でない場合のみ更新
    if (value.getCurrentContent().getPlainText() !== '' && editor !== value) {
        setEditor(value);
    }
  };

  const replaceEditorContent = (newText) => {
    const contentState = ContentState.createFromText(newText);
    const newEditorState = EditorState.createWithContent(contentState, decorator);
    setEditor(newEditorState);
  };

  /***********************************
   * TODO:ファイルのパスを取得してくる
   * TODO:files
   *************************************/
  const handleDroppedFiles = (selection, files) => {
    insertImage('logo192.png');
  };

  const insertImage = (url) => {
    const contentState = editor.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editor, {
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
    <div className='break-words overflow-y-auto h-80 border-l border-r'>
      <div className='border-b-2 pr-1 pl-1  top-0 bg-white flex justify-between'>
        {readonly ? (
          <>
            <div>
              <button onClick={() => setReadOnly(false)} className="text-black p-2">
                メモを編集
              </button>
              {/* <button onClick={() => replaceEditorContent("新しいエディタの内容")}>テンプレート</button> */}
            </div>
            <button onClick={() => setReadOnly(false)} className="text-black p-2">
              メモを削除
            </button>
          </>
        ) : (
          <>
            <div>
              <button onClick={() => { saveContent(); setReadOnly(true) }} className="text-black p-2">保存</button>
            </div>
          </>
        )}
      </div>
      <div readOnly className={readonly ? "p-2" : "p-2 bg-orange-50"}>
        <Editor
          editorState={editor}
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