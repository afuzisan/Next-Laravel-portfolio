'use client'

import laravelAxios from '@/lib/laravelAxios'
import { logError } from '@/lib/logError'
import { useEditorContext, useIndexSave } from '@Dashboard/EditorContext.client'
import createLinkPlugin from '@draft-js-plugins/anchor'
import '@draft-js-plugins/anchor/lib/plugin.css'
import {
  BoldButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  UnderlineButton,
} from '@draft-js-plugins/buttons'
import Editor from '@draft-js-plugins/editor'
import createImagePlugin from '@draft-js-plugins/image'
import '@draft-js-plugins/image/lib/plugin.css'
import createInlineToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/inline-toolbar'
import '@draft-js-plugins/inline-toolbar/lib/plugin.css'
import {
  AtomicBlockUtils,
  CompositeDecorator,
  EditorState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import NextLink from 'next/link' // Next.jsのLinkコンポーネントをインポート
import { useEffect, useMemo, useState } from 'react'
import linkStyles from './linkStyles.module.css'
import PropTypes from 'prop-types'

const Link = props => {
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  return (
    <NextLink href={url} className="text-blue-600 " target="_blank">
      {props.children}
    </NextLink>
  )
}

Link.propTypes = {
  contentState: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const MyEditor = ({
  initMemo,
  initId,
  stock,
  setMemoRefreshKey,
  activeOrder,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const [indexSaveState, setIndexSave] = useIndexSave()

  const [editor, setEditor] = useEditorContext()
  const [plugins, InlineToolbar, LinkButton, decorator] = useMemo(() => {
    const linkPlugin = createLinkPlugin({
      theme: linkStyles,
      placeholder: 'https://...',
    })
    const imagePlugin = createImagePlugin()
    const inlineToolbarPlugin = createInlineToolbarPlugin({
      structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        linkPlugin.LinkButton,
      ],
    })
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
      // 他のデコレータ設定があればここに追加
    ])
    return [
      [inlineToolbarPlugin, linkPlugin, imagePlugin],
      inlineToolbarPlugin.InlineToolbar,
      linkPlugin.LinkButton,
      decorator, // 修正: linkPluginを削除し、decoratorを返す
    ]
  }, [])

  const [readonly, setReadOnly] = useState(true)

  /**********************************************
   * TODO:データベースからデータを呼び出す処理を追加する
   * TODO:function:useEffect
   ***********************************************/
  useEffect(() => {
    let initialText = typeof initMemo === 'string' ? initMemo : ''
    let editorState

    try {
      editorState = initialText ? JSON.parse(initialText) : {}
    } catch (error) {
      logError(error)
      editorState = {}
    }

    if (Object.keys(editorState).length === 0) {
      return
    }

    const contentState = convertFromRaw(editorState)
    const newEditorState = EditorState.createWithContent(
      contentState,
      decorator,
    )
    setEditor(newEditorState)
  }, [decorator, initMemo])

  /**********************************************
   * TODO:データベースに保存する処理を追加する
   * TODO:function:saveContent
   ***********************************************/
  const saveContent = async () => {
    const contentState = editor.getCurrentContent()
    const raw = convertToRaw(contentState)
    const url = `${apiUrl}/api/dashboard/memoUpdate`

    try {
      await laravelAxios.post(
        url,
        JSON.stringify({
          memo: JSON.stringify(raw),
          memo_id: initId,
          order: indexSaveState,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )
    } catch (error) {
      logError(error)
    } finally {
      setMemoRefreshKey(prevKey => prevKey + 1)
    }
  }

  const onChange = value => {
    if (value.getCurrentContent().getPlainText() !== '') {
      setEditor(value)
    }
  }

  /***********************************
   * TODO:ファイルのパスを取得してくる
   * TODO:files
   *************************************/
  const handleDroppedFiles = () => {
    insertImage('logo192.png')
  }

  const insertImage = url => {
    const contentState = editor.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: url },
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editor, {
      currentContent: contentStateWithEntity,
    })
    onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '))
  }

  function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      )
    }, callback)
  }

  const deleteMemo = async () => {
    try {
      await laravelAxios.delete(`${apiUrl}/api/dashboard/memoDelete`, {
        data: {
          stockNumber: stock,
          memoNumber: initId,
        },
        withCredentials: true,
      })
      setMemoRefreshKey(prev => prev + 1)
    } catch (error) {
      logError(error)
    }
  }

  return (
    <div className="break-words overflow-y-auto h-80 ">
      <div className="border-b-2 pr-1 pl-1  top-0 bg-white flex justify-between">
        {readonly ? (
          <>
            <div>
              <button
                onClick={() => {
                  setReadOnly(false)
                  if (!indexSaveState) {
                    setIndexSave(activeOrder)
                  }
                }}
                className="text-black p-2">
                メモを編集
              </button>
              {/* <button onClick={() => replaceEditorContent("新しいエディタの内容")}>テンプレート</button> */}
            </div>

            <button
              onClick={async () => {
                if (!indexSaveState) {
                  setIndexSave(activeOrder)
                  await deleteMemo(initId)
                  return
                }
                await deleteMemo(indexSaveState)
              }}
              className="text-black p-2">
              削除
            </button>
          </>
        ) : (
          <>
            <div>
              <button
                onClick={() => {
                  saveContent()
                  setReadOnly(true)
                }}
                className="text-black p-2">
                保存
              </button>
            </div>
          </>
        )}
      </div>
      <div readOnly className={readonly ? 'p-2' : 'p-2 bg-orange-50'}>
        <Editor
          editorState={editor}
          onChange={onChange}
          plugins={plugins}
          readOnly={readonly}
          handleDroppedFiles={handleDroppedFiles}
          decorators={[decorator]}
        />
        <InlineToolbar>
          {externalProps => (
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
  )
}

MyEditor.propTypes = {
  initMemo: PropTypes.string.isRequired,
  initId: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  setMemoRefreshKey: PropTypes.func.isRequired,
  activeOrder: PropTypes.number.isRequired,
}

export default MyEditor
