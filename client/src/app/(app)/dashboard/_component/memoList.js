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
import Loading from "@/app/(app)/Loading"; // Loading component imported

const MemoList = ({ title, id, setActiveId, activeId }) => {
    const [, setEditor] = useEditorContext()
    const [, setIndexSave] = useIndexSave()
    const [loading, setLoading] = useState(false); // Loading state managed

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

    const fetchData = async (title) => {
        setLoading(true); 
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

            newEditorState.getCurrentContent().getPlainText('\n');
            setEditor(newEditorState); 
            setActiveId(id);
        } catch (error) {
            console.error('Fetch error:', error);
            setActiveId(id);
            setEditor(EditorState.createEmpty(decorator)); 
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            {loading && <Loading />} 
            <div
                className={`text-left break-words cursor-pointer p-2 hover:bg-gray-100 ${activeId === id ? 'bg-gray-100' : ''}`} // クリック時に背景をグレーに設定
                onClick={() => fetchData(title)}
            >
                {title}
            </div>
        </>
    );
};
export default MemoList
