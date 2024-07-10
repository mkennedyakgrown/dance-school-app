import { useEffect, useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import ToolbarPlugin from "./ToolbarPlugin";
import ExampleTheme from "./ExampleTheme";
import "../styles.css";
import TextEditorSaveButton from "./TextEditorSaveButton";
import { Popup } from "semantic-ui-react";

function EmailTextEditor({ formik, popupIsOpen, EmailBody }) {
  const [editorState, setEditorState] = useState(null);

  function onChange(editorState) {
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
    formik.setFieldValue("content_json", JSON.stringify(editorStateJSON));
  }

  function onError(error) {
    console.error(error);
  }

  const placeholder = "Enter some text...";

  const editorConfig = {
    namespace: "myEditor",
    theme: ExampleTheme,
    onError,
  };

  const emptyEditorState =
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        editorState: Object.keys(EmailBody).includes("root")
          ? emptyEditorState
          : EmailBody,
      }}
    >
      <div className="editor-container">
        <ToolbarPlugin editorType={"email"} />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <div className="editor-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChange} />

          <Popup
            open={popupIsOpen}
            trigger={<TextEditorSaveButton formik={formik} />}
            content="Saved!"
            position="right center"
          />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default EmailTextEditor;
