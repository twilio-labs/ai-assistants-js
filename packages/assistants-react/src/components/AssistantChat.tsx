import React, { useEffect } from "react";
import { AssistantChatDialog } from "./AssistantChatDialog";
import useAssistant, { UseAssistantOptions } from "../hooks/useAssistant";

export interface AssistantChatProps {
  /**
   * A valid JWT with a Twilio Conversations grant
   * - {@link https://www.twilio.com/docs/iam/access-tokens#create-an-access-token-for-conversations | Learn more}
   */
  token: string;

  /**
   * The SID of your Twilio AI Assistant
   */
  assistantSid: string;

  /**
   * A conversation SID if you want to connect to an existing conversation
   */
  conversationSid?: string;

  /**
   * Callback for when the client has connected to a conversation.
   * This can be used in conjunction with the `conversationSid` property if
   * you want to save & reconnect to a conversation between page reloads
   *
   * @param conversationSid
   * @returns
   */
  onConversationSetup?: (conversationSid: string) => void;

  /**
   * Handlers for any UI Tools you want the Twilio AI Assistant to be able to use.
   * This requires for the UI Tools to be properly configured.
   * - {@link https://www.twilio.com/docs/alpha/ai-assistants/code-samples/ui-tools | Learn more about UI tools}
   */
  toolHandlers?: UseAssistantOptions["toolHandlers"];
}

/**
 * Renders a full popup chat for you AI Assistant, incl. both a button and
 * the chat dialog when the button gets pressed.
 *
 * @example
 * <AssistantChat token={"..."} assistantSid="AI..." />
 *
 * @param {AssistantChatProps} props
 * @returns
 */
export function AssistantChat({
  token,
  assistantSid,
  toolHandlers,
  conversationSid,
  onConversationSetup,
}: AssistantChatProps) {
  if (!token || !assistantSid) {
    return <></>;
  }

  const assistant = useAssistant(token, {
    assistantSid,
    toolHandlers,
    conversationSid,
  });

  useEffect(() => {
    if (
      conversationSid !== assistant.conversationSid &&
      typeof assistant.conversationSid === "string" &&
      typeof onConversationSetup === "function"
    ) {
      onConversationSetup(assistant.conversationSid);
    }
  }, [conversationSid, assistant.conversationSid]);

  return <AssistantChatDialog {...assistant} />;
}
