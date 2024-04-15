import { SendIcon } from "@twilio-paste/icons/esm/SendIcon";
import React from "react";
import { Box } from "@twilio-paste/box";
import {
  CLEAR_EDITOR_COMMAND,
  useLexicalComposerContext,
} from "@twilio-paste/lexical-library";
import { Button } from "@twilio-paste/button";

/**
 * Component rendering a send button for the Twilio Paste ChatComposer component
 * {@link https://paste.twilio.design/components/chat-composer#adding-interactivity-with-plugins | Twilio Paste Docs}
 */
export const SendButtonPlugin = ({
  onClick,
}: {
  onClick: () => void;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();

  const handleSend = (): void => {
    onClick();
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  };

  return (
    <Box position="absolute" top="space30" right="space30">
      <Button variant="primary_icon" size="reset" onClick={handleSend}>
        <SendIcon decorative={false} title="Send message" />
      </Button>
    </Box>
  );
};
