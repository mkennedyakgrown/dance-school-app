import { Button } from "semantic-ui-react";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function TextEditorSaveButton({ formik }) {
  const [editor] = useLexicalComposerContext();

  function handleExportToHtml() {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      formik
        .setFieldValue("content", htmlString)
        .then(() => formik.submitForm());
    });
  }
  return (
    <Button type="button" onClick={handleExportToHtml}>
      Save
    </Button>
  );
}

export default TextEditorSaveButton;
