import { inlineFunction } from "./inline-function";

import { executeSafely } from "../../commands";
import { ErrorReason } from "../../editor/editor";
import { AttemptingEditor } from "../../editor/adapters/attempting-editor";
import { Refactoring } from "../../types";
import { createVSCodeEditor } from "../../editor/adapters/create-vscode-editor";

const config: Refactoring = {
  command: {
    key: "inline",
    operation: inline
  }
};

export default config;

async function inline() {
  const vscodeEditor = createVSCodeEditor();
  if (!vscodeEditor) return;

  const attemptingEditor = new AttemptingEditor(
    vscodeEditor,
    ErrorReason.DidNotFindInlinableCode
  );

  await executeSafely(async () => {

    if (!attemptingEditor.attemptSucceeded) {
      await inlineFunction(vscodeEditor);
    }
  });
}