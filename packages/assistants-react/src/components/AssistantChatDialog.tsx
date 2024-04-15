import { Theme } from "@twilio-paste/theme";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import {
  MinimizableDialog,
  MinimizableDialogButton,
  MinimizableDialogContainer,
  MinimizableDialogContent,
  MinimizableDialogHeader,
} from "@twilio-paste/minimizable-dialog";
import React, { useState } from "react";
import { Flex } from "@twilio-paste/flex";
import { StatusBadge, StatusBadgeVariants } from "@twilio-paste/status";
import { Box } from "@twilio-paste/box";
import { ConnectionState } from "@twilio/conversations";
import { match } from "ts-pattern";

import { ChatComposer, ChatComposerProps } from "@twilio-paste/chat-composer";
import { $getRoot, ClearEditorPlugin } from "@twilio-paste/lexical-library";
import { SendButtonPlugin } from "./chat-composer-plugins/SendButtonPlugin";
import { EnterKeySubmitPlugin } from "./chat-composer-plugins/EnterKeySubmitPlugin";
import {
  AssistantChatLogProps,
  AssistantChatLog,
} from "./AssistantChatLogProps";

export type AssistantChatDialogProps = {} & AssistantChatLogProps;

export function AssistantChatDialog(props: AssistantChatDialogProps) {
  const { sendMessage, state } = props;

  const [messageInput, setMessageInput] = useState("");

  const connectionString = match<ConnectionState, StatusBadgeVariants>(state)
    .with("connected", () => "ConnectivityAvailable")
    .with("disconnected", () => "ConnectivityOffline")
    .otherwise(() => "ConnectivityBusy");

  const isLoading = state === "connected" ? false : true;

  const handleComposerChange: ChatComposerProps["onChange"] = (editorState) => {
    editorState.read(() => {
      const text = $getRoot().getTextContent();
      setMessageInput(text);
    });
  };

  const submitMessage = (): void => {
    if (messageInput === "") return;
    sendMessage(messageInput);
  };

  return (
    <Theme.Provider theme="default">
      <MinimizableDialogContainer>
        <MinimizableDialogButton
          variant="primary"
          size="circle"
          loading={isLoading}
        >
          <ChatIcon decorative={false} title="Chat" />
        </MinimizableDialogButton>
        <MinimizableDialog aria-label="Live chat">
          <MinimizableDialogHeader>
            <Flex hAlignContent={"between"}>
              <span>Live chat</span>
              <StatusBadge as="span" variant={connectionString}>
                {state}
              </StatusBadge>
            </Flex>
          </MinimizableDialogHeader>
          <MinimizableDialogContent>
            <AssistantChatLog {...props} />
            <Box
              borderStyle="solid"
              borderWidth="borderWidth0"
              borderTopWidth="borderWidth10"
              borderColor="colorBorderWeak"
              display="flex"
              flexDirection="row"
              columnGap="space30"
              paddingX="space70"
              paddingY="space50"
            >
              <ChatComposer
                maxHeight="size10"
                config={{
                  namespace: "foo",
                  onError: (error) => {
                    throw error;
                  },
                }}
                ariaLabel="Message"
                placeholder="Type here..."
                onChange={handleComposerChange}
              >
                <ClearEditorPlugin />
                <SendButtonPlugin onClick={submitMessage} />
                <EnterKeySubmitPlugin onKeyDown={submitMessage} />
              </ChatComposer>
            </Box>
          </MinimizableDialogContent>
        </MinimizableDialog>
      </MinimizableDialogContainer>
    </Theme.Provider>
  );
}
