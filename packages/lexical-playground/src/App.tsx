/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import * as React from 'react';

import {isDevPlayground} from './appSettings';
import {FlashMessageContext} from './context/FlashMessageContext';
import {SettingsContext, useSettings} from './context/SettingsContext';
import {SharedAutocompleteContext} from './context/SharedAutocompleteContext';
import {SharedHistoryContext} from './context/SharedHistoryContext';
import Editor from './Editor';
import logo from './images/logo.svg';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PasteLogPlugin from './plugins/PasteLogPlugin';
import {TableContext} from './plugins/TablePlugin';
import TestRecorderPlugin from './plugins/TestRecorderPlugin';
import TypingPerfPlugin from './plugins/TypingPerfPlugin';
import Settings from './Settings';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

console.warn(
  'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.',
);

function $prepopulatedRichText() {
  const root = $getRoot();
  const paragraph = $createParagraphNode();
  paragraph.append($createTextNode('Welcome to the Lexical Editor!'));
  root.append(paragraph);
}

function App(): JSX.Element {
  const {
    settings: {isCollab, emptyEditor, measureTypingPerf},
  } = useSettings();

  const initialConfig = {
    editorState: isCollab
      ? null
      : emptyEditor
      ? undefined
      : $prepopulatedRichText,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            <header>
              <a href="https://lexical.dev" target="_blank" rel="noreferrer">
                <img src={logo} alt="Lexical Logo" />
              </a>
            </header>
            <div className="editor-shell">
              <Editor />
            </div>
            <Settings />
            {isDevPlayground ? <PasteLogPlugin /> : null}
            {isDevPlayground ? <TestRecorderPlugin /> : null}

            {measureTypingPerf ? <TypingPerfPlugin /> : null}
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <SettingsContext>
      <FlashMessageContext>
        <App />
      </FlashMessageContext>
    </SettingsContext>
  );
}