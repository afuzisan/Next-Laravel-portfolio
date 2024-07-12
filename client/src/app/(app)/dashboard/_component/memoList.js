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
import { useState, useEffect } from 'react';
import React from 'react';
import Loading from "@/app/(app)/Loading"; // Loading component imported
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const MemoList = ({ title, id, setActiveOrder, activeOrder, index, minOrder, order, setMemoRefreshKey}) => {
    const [, setEditor] = useEditorContext()
    const [, setIndexSave] = useIndexSave()
    const [loading, setLoading] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
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
            setIndexSave(order); 
            const response = await fetch(`http://localhost:8080/api/dashboard/memo?id=${id}`, {
                cache: 'no-store'
            });
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
            setActiveOrder(order); 
        } catch (error) {
            console.error('Fetch error:', error);
            setActiveOrder(order); 
            setEditor(EditorState.createEmpty(decorator));
        } finally {
            
            setLoading(false);
        }
    };
    useEffect(() => {
        setIndexSave(minOrder);
        setActiveOrder(minOrder);
    }, [minOrder]); // minIdが変わった時だけ実行

    return (
        <>

            {loading && <Loading />}
            <li className={`flex items-center hover:bg-gray-100  ${activeOrder === order  ? 'bg-gray-100' : ''}`}>
                <div className='w-full flex items-center justify-center' >
                    <div ref={setNodeRef} style={{ ...style, cursor: 'grab' }} {...attributes} {...listeners} className="flex items-center w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="w-6 h-6"
                        >
                            <rect width="48" height="48" fill="none" />
                            <line x1="10" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="2" />
                            <line x1="10" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="2" />
                            <line x1="10" y1="36" x2="38" y2="36" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <div
                            {...attributes}
                            {...listeners}
                            onPointerDown={(e) => e.stopPropagation()}
                            className={`flex-1 text-left break-words cursor-pointer p-2`}
                            onClick={() => {
                                fetchData(title);
                            }}
                        >
                            {title}
                        </div>
                    </div>
                </div>
            </li>
        </>
    );
};
export default MemoList