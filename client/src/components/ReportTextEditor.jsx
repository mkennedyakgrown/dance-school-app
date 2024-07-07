import { useEffect, useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useFormik } from "formik";
import * as yup from "yup";
import ToolbarPlugin from "./ToolbarPlugin";
import ExampleTheme from "./ExampleTheme";
import "../styles.css";
import TextEditorSaveButton from "./TextEditorSaveButton";

function ReportTextEditor() {
  const [editorState, setEditorState] = useState(null);

  const formSchema = yup.object().shape({
    content: yup.string().required("Body is required"),
  });

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  function onChange(editorState) {
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
  }

  function onError(error) {
    console.error(error);
  }

  const placeholder = "Enter some text...";

  const editorConfig = {
    namespace: "myEditor",
    theme: ExampleTheme,
    nodes: [],
    onError,
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin editorType={"report"} />
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
          <TextEditorSaveButton formik={formik} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default ReportTextEditor;
