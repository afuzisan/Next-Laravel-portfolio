import { convertFromRaw, EditorState } from 'draft-js'

// 仮の rawContent
const rawContent = {
  entityMap: {
    0: {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: { url: 'http://example.com' },
    },
  },
  blocks: [
    {
      key: 'firstBlock',
      text: 'Example of a link',
      type: 'unstyled',
      entityRanges: [{ offset: 17, length: 4, key: 0 }],
    },
  ],
}

const contentState = convertFromRaw(rawContent)
const editorState = EditorState.createWithContent(contentState)
