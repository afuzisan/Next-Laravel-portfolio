import {
    EditorState,
    ContentState,
    CompositeDecorator,
    convertFromRaw
} from 'draft-js';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import { useEditorContext, useIndexSave } from '../_component/EditorContext.client';
import Link from 'next/link'; // Link component imported
import { useState } from 'react';

const MemoList = ({ title, id, setActiveId, activeId }) => {
    const [, setEditor] = useEditorContext()
    const [, setIndexSave] = useIndexSave()

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
    const LinkComponent = (props) => {
        const { url } = props.contentState.getEntity(props.entityKey).getData();
        return (
            <Link href={url} className='text-blue-600' target="_blank" passHref >
                {props.children}
            </Link>
        );
    };
    const decorator = new CompositeDecorator([
        {
            strategy: findLinkEntities,
            component: LinkComponent,
        },
        // 他のデコレータ設定があればここに追加
    ]);

    const fetchData = async () => {
        try {
            setIndexSave(id);
            const response = await fetch(`http://localhost:8080/api/dashboard/memo?id=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok or response is null');
            }
            const result = await response.json();
            if (typeof result.memo !== 'string' || result.memo === null) {
                throw new Error('Invalid memo format');
            }
            const contentState = convertFromRaw(JSON.parse(result.memo)); // JSONからContentStateを作成
            const newEditorState = EditorState.createWithContent(contentState, decorator); // EditorStateを作成

            // EditorStateからテキストを抽出
            newEditorState.getCurrentContent().getPlainText('\n');
            setEditor(newEditorState); // EditorStateを設定
            setActiveId(id);
        } catch (error) {
            console.error('Fetch error:', error);
            setActiveId(id);
            setEditor(EditorState.createEmpty(decorator)); // エラー時に空のEditorStateを設定
        }
    };

    return (
        <div
            className={`text-left break-words ${activeId === id ? 'text-red-600' : ''}`} // クリックしたメモだけ赤くする
            onClick={() => fetchData()}
        >
            {title}
        </div>
    );
};
export default MemoList
