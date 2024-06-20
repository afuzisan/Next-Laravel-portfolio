'use client'

import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import { ItalicButton, BoldButton, UnderlineButton } from '@draft-js-plugins/buttons';
import { stateToHTML } from 'draft-js-export-html';

function editorStateToHtml(editorState) {
  return stateToHTML(editorState.getCurrentContent());
}

const linkPlugin = createLinkPlugin({

  placeholder: 'http://…',
});
const inlineToolbarPlugin = createInlineToolbarPlugin({

});
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin, linkPlugin];
const text = 'Try selecting a part of this text and click on the link button in the toolbar that appears …';

export default class ThemedInlineToolbarEditor extends Component {
  state = {
    editorState: createEditorStateWithText(text),
  };

  onChange = (editorState) => {
    this.setState({ editorState });
  }

  focus = () => this.editor.focus();

  render() {
    return (
      <div onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange.bind(this)}
          plugins={plugins}
          ref={(element) => {
            this.editor = element;
          }}
        />
        <InlineToolbar>
          {(externalProps) => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
            </div>
          )}
        </InlineToolbar>
      </div>
    );
  }
}
