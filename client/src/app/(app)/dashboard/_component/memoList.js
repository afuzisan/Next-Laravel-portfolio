import {
    EditorState,
    ContentState,
    CompositeDecorator,
} from 'draft-js';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import { useEditorContext, useIndexSave } from '../_component/EditorContext.client';

const MemoList = ({ title, id }) => {
    const [, setEditor] = useEditorContext()
    const [, setIndexSave] = useIndexSave()

    const fetchData = async () => {
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
        const Link = (props) => {
            const { url } = props.contentState.getEntity(props.entityKey).getData();
            return (
                <NextLink href={url} className='text-blue-600 ' target="_blank">
                    {props.children}
                </NextLink>
            );
        };

        try {
            console.log(id)
            setIndexSave(id)
            const response = await fetch(`http://localhost:8080/api/dashboard/memo?id=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result.memo)
            const contentState = ContentState.createFromText(result.memo);
            const decorator = new CompositeDecorator([
                {
                    strategy: findLinkEntities,
                    component: Link,
                },
                // 他のデコレータ設定があればここに追加
            ]);

            const newEditorState = EditorState.createWithContent(contentState, decorator);
            setEditor(newEditorState);

        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <ul>
            <li>
                <button onClick={() => fetchData()}>{title}</button>
            </li>
        </ul>
    );
};
export default MemoList

