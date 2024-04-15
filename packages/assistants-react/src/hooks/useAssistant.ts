import { ConnectionState, Message } from "@twilio/conversations";
import { useEffect, useRef, useState } from "react";

import Assistant, { AssistantOptions } from "@twilio-alpha/assistants";

export type UseAssistantOptions = Partial<AssistantOptions> & {
  /**
   * The SID of your Twilio AI Assistant
   */
  assistantSid: string;

  /**
   * A conversation SID if you want to connect to an existing conversation
   */
  conversationSid?: string;

  /**
   * Handlers for any UI Tools you want the Twilio AI Assistant to be able to use.
   * This requires for the UI Tools to be properly configured.
   * - {@link https://www.twilio.com/docs/alpha/ai-assistants/code-samples/ui-tools | Learn more about UI tools}
   */
  toolHandlers?: {
    [key: string]: (data: any) => void;
  };
};

export type UseAssistantOutput = {
  /**
   * A list of all the messages in the conversation
   */
  messages: Message[];

  /**
   * Connection state to the conversation
   */
  state: ConnectionState;

  /**
   * Function to send a new message to the AI Assistant / Conversation
   *
   * @param message The new message to send
   * @returns success
   */
  sendMessage: (message: string) => Promise<boolean>;

  /**
   *
   */
  conversationSid?: string;

  /**
   * Indicates when the AI Assistant is generating a new response.
   * Only works in combination with the {@link https://www.twilio.com/docs/alpha/ai-assistants/code-samples/conversations | AI Assistants Conversations integration}
   */
  isTyping: boolean;

  /**
   * The Twilio Conversations identity of the user that's logged in
   */
  identity?: string;
};

export function useAssistant(
  /**
   * A valid JWT with a Twilio Conversations grant
   * - {@link https://www.twilio.com/docs/iam/access-tokens#create-an-access-token-for-conversations | Learn more}
   */
  token: string,
  options: UseAssistantOptions
): UseAssistantOutput {
  const assistantClient = useRef<Assistant>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setConnectionState] = useState<ConnectionState>("unknown");
  const [conversationSid, setConversationSid] = useState<string>();
  const [identity, setIdentity] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (typeof token !== "string" || token.length === 0) {
      return;
    }

    assistantClient.current = new Assistant(token, {});
    assistantClient.current.on("messagesChanged", (messages) => {
      setMessages(messages);
    });
    assistantClient.current.on("statusChanged", (state) => {
      setConnectionState(state);
    });
    assistantClient.current.on(
      "joinedConversation",
      ({ conversationSid, identity }) => {
        setConversationSid(conversationSid);
        setIdentity(identity);
      }
    );
    assistantClient.current.on("assistantTypingStarted", () => {
      setIsTyping(true);
    });
    assistantClient.current.on("assistantTypingEnded", () => {
      setIsTyping(false);
    });
    assistantClient.current.on("uiToolTriggered", (payload) => {
      if (
        options.toolHandlers &&
        typeof options.toolHandlers[payload.name] === "function"
      ) {
        options.toolHandlers[payload.name](payload.data);
      }
    });

    return () => {
      assistantClient.current?.removeAllListeners();
      assistantClient.current?.destroy();
      assistantClient.current = undefined;
    };
  }, [token, options.conversationSid]);

  useEffect(() => {
    if (
      state === "connected" &&
      options.assistantSid &&
      assistantClient.current &&
      !assistantClient.current.conversation
    ) {
      assistantClient.current.start(
        options.assistantSid,
        options.conversationSid
      );
    }
  }, [state, options.assistantSid]);

  async function sendMessage(message: string) {
    return assistantClient.current?.sendMessage(message) || false;
  }

  return { state, messages, sendMessage, conversationSid, isTyping, identity };
}

export default useAssistant;
