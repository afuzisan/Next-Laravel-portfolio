import {
    EditorState,
    CompositeDecorator,
    convertFromRaw
} from 'draft-js';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import { useEditorContext } from '../_component/EditorContext.client';
import Link from 'next/link'; // Link component imported
import { useState, useEffect } from 'react';
import React from 'react';
import Loading from "@/app/(app)/Loading"; // Loading component imported
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import laravelAxios from '@/lib/laravelAxios';

const MemoList = ({ title, id, setActiveOrder, activeOrder, minOrder, order }) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [, setEditor] = useEditorContext()
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
    const fetchData = async () => {
        setLoading(true);
        try {
            setActiveOrder(order);
            setEditor(EditorState.createEmpty(decorator));
            const URL = `${apiUrl}/api/dashboard/memo`;
            const response = await laravelAxios.post(URL, {
                id: id,
                cache: 'no-store'
            });
            const contentState = convertFromRaw(JSON.parse(response.data.memo));
            const newEditorState = EditorState.createWithContent(contentState, decorator);

            newEditorState.getCurrentContent().getPlainText('\n');

            setEditor(newEditorState);
            setActiveOrder(order);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setActiveOrder(minOrder);
    }, [minOrder]);

    return (
        <>

            {loading && <Loading />}
            <li className={`flex items-center hover:bg-red-100  ${activeOrder === order ? 'bg-gray-100' : ''}`}>
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
                                fetchData();
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