import React, { useEffect, useRef, useState } from "react";
import { Box, BoxProps } from "@twilio-paste/box";
import { ChatBookend, ChatBookendItem, ChatLog } from "@twilio-paste/chat-log";
import { UseAssistantOutput } from "../hooks/useAssistant";
import { ChatMessageWrapper } from "./ChatMessageWrapper";
import { TypingIndicator } from "./TypingIndicator";

export type AssistantChatLogProps = {
  /**
   * Enables additional debug output in the Chat UI such as the
   * Conversations SID and the identity of the user
   */
  _debug?: boolean;
} & UseAssistantOutput &
  BoxProps;

/**
 * Renders a full chat log (without input) based on the output of `useAssistant`.
 * To modify the container behavior you can use {@link https://paste.twilio.design/primitives/box | Twilio Paste's Box properties}
 *
 * @example <caption>Regular use</caption>
 * const assistant = useAssistant(...)
 * return <AssistantChatLog {...assistant} />
 *
 * @example <caption>Custom styling: Removing max height</caption>
 * return <AssistantChatLog {...assistant} maxHeight="unset" />
 *
 * @param {AssistantChatLogProps} props
 */
export function AssistantChatLog({
  _debug,
  conversationSid,
  identity,
  isTyping,
  messages,
  ...props
}: AssistantChatLogProps) {
  const scrollerRef = useRef<HTMLElement>(null);
  const loggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !loggerRef.current) return;
    scrollerRef.current?.scrollTo({
      top: loggerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, mounted]);

  return (
    <Box
      ref={scrollerRef}
      overflowX="hidden"
      overflowY="auto"
      maxHeight="size50"
      minHeight="size50"
      tabIndex={0}
      {...props}
    >
      <ChatLog ref={loggerRef}>
        {_debug && (
          <ChatBookend>
            <ChatBookendItem>SID: {conversationSid}</ChatBookendItem>
            <ChatBookendItem>Identity: {identity}</ChatBookendItem>
          </ChatBookend>
        )}
        {messages.map((message) => {
          return <ChatMessageWrapper message={message} key={message.sid} />;
        })}
        {isTyping ? <TypingIndicator /> : null}
      </ChatLog>
    </Box>
  );
}
