import React from "react";
import {
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
} from "@twilio-paste/chat-log";
import { SkeletonLoader } from "@twilio-paste/skeleton-loader";
import { Stack } from "@twilio-paste/stack";

/**
 * Typing indicator to be used in conjunction with a Twilio Paste ChatLog component
 */
export function TypingIndicator() {
  return (
    <ChatMessage variant="inbound">
      <Stack orientation={"vertical"} spacing="space20">
        <SkeletonLoader width="100px" />
        <SkeletonLoader width="150px" />
        <SkeletonLoader width="80px" />
        <ChatMessageMeta aria-label="TODO">
          <ChatMessageMetaItem>
            <i>Typing...</i>
          </ChatMessageMetaItem>
        </ChatMessageMeta>
      </Stack>
    </ChatMessage>
  );
}
