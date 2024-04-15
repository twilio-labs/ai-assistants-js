import React from "react";
import {
  ChatBubble,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  MessageVariants,
} from "@twilio-paste/chat-log";
import { Message } from "@twilio/conversations";
import Markdown from "react-markdown";
import { Box } from "@twilio-paste/box";
import { Anchor } from "@twilio-paste/anchor";
import { JsxRuntimeComponents } from "react-markdown/lib";

export interface ChatMessageProps {
  message: Message;
}

function markdownComponents(
  variant: "inbound" | "outbound"
): Partial<JsxRuntimeComponents> {
  return {
    a: ({ node, ...props }) => {
      return (
        // @ts-ignore
        <Anchor
          {...props}
          variant={variant === "inbound" ? undefined : "inverse"}
        />
      );
    },
    blockquote: ({ node, ...props }) => {
      return (
        // @ts-ignore
        <Box
          as="blockquote"
          {...props}
          borderLeftStyle={"solid"}
          borderLeftWidth={"borderWidth30"}
          borderLeftColor={"colorBorderWeak"}
          paddingX="space40"
          backgroundColor={
            variant === "inbound" ? "colorBackgroundStrong" : undefined
          }
        />
      );
    },
  };
}

/**
 * Renders both an incoming our outgoing message to be used in a Twilio Paste ChatLog
 * Message bodies get treated as markdown using {@link https://www.npmjs.com/package/react-markdown | react-markdown}
 * to enable formatting.
 *
 * @param {ChatMessageProps} props
 */
export function ChatMessageWrapper({ message }: ChatMessageProps) {
  const variant: MessageVariants =
    message.author === "system" ? "inbound" : "outbound";

  const timeString = message.dateUpdated
    ? new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(
        message.dateUpdated
      )
    : "";

  return (
    <ChatMessage variant={variant}>
      <ChatBubble>
        <Markdown components={markdownComponents(variant)}>
          {message.body}
        </Markdown>
      </ChatBubble>
      <ChatMessageMeta aria-label="TODO">
        <ChatMessageMetaItem>{timeString}</ChatMessageMetaItem>
      </ChatMessageMeta>
    </ChatMessage>
  );
}
