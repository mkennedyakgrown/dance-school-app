import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

function TextEditorUpdatePlugin({ formik }) {
  console.log(formik.values);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      editor.setEditorState(formik.values.content_json);
    });
  }, [formik.values.selectedEmail]);

  return <></>;
}

export default TextEditorUpdatePlugin;
