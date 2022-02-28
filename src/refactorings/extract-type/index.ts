
import { extractType } from "./extract-type";

import { Refactoring } from "../../types";
import { executeSafely } from "../../commands";
import { ErrorReason } from "../../editor/editor";
import { AttemptingEditor } from "../../editor/adapters/attempting-editor";
import { createVSCodeEditor } from "../../editor/adapters/create-vscode-editor";

const config: Refactoring = {
  command: {
    key: "extract",
    operation: extract
  }
};

export default config;

async function extract() {
  const vscodeEditor = createVSCodeEditor();
  if (!vscodeEditor) return;

  const attemptingEditor = new AttemptingEditor(
    vscodeEditor,
    ErrorReason.DidNotFindTypeToExtract
  );

  await executeSafely(async () => {
    await extractType(attemptingEditor);
  });
}