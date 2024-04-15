import React from "react";
import {
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
  useLexicalComposerContext,
} from "@twilio-paste/lexical-library";

/**
 * Plugin for the Twilio Paste ChatComposer component to handle "hit enter to send"
 * {@link https://paste.twilio.design/components/chat-composer#adding-interactivity-with-plugins | Twilio Paste Docs}
 */
export const EnterKeySubmitPlugin = ({
  onKeyDown,
}: {
  onKeyDown: () => void;
}): null => {
  const [editor] = useLexicalComposerContext();

  const handleEnterKey = React.useCallback(
    (event: KeyboardEvent) => {
      const { shiftKey, ctrlKey } = event;
      if (shiftKey || ctrlKey) return false;
      event.preventDefault();
      event.stopPropagation();
      onKeyDown();
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      return true;
    },
    [editor, onKeyDown]
  );

  React.useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      handleEnterKey,
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, handleEnterKey]);
  return null;
};
