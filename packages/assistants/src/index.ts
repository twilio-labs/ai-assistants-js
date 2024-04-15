import { EventEmitter } from "events";
import {
  ConnectionState,
  Conversation,
  Client as ConversationClient,
  ConversationUpdateReason,
  JSONObject,
  Message,
  MessageUpdateReason,
} from "@twilio/conversations";
import { match } from "ts-pattern";
import z from "zod";

export type AssistantOptions = {};

export const UiToolData = z.object({
  name: z.string(),
  data: z.record(z.any()),
});

export type UiToolData = z.infer<typeof UiToolData>;

export type JoinedConversationEventData = {
  conversationSid: string;
  identity: string;
};

export declare interface Assistant extends EventEmitter {
  destroy(): void;
  emit(event: "messagesChanged", data: Message[]): any;
  on(event: "messagesChanged", handler: (state: Message[]) => void): this;
  emit(event: "statusChanged", data: ConnectionState): any;
  on(event: "statusChanged", handler: (state: ConnectionState) => void): this;
  emit(event: "joinedConversation", data: JoinedConversationEventData): any;
  on(
    event: "joinedConversation",
    handler: (data: JoinedConversationEventData) => void
  ): this;
  emit(event: "assistantTypingStarted"): any;
  on(event: "assistantTypingStarted", handler: () => void): this;
  emit(event: "assistantTypingEnded"): any;
  on(event: "assistantTypingEnded", handler: () => void): this;
  emit(event: "uiToolTriggered", data: UiToolData): any;
  on(event: "uiToolTriggered", handler: (data: UiToolData) => void): this;
  on(event: string, handler: Function): this;
}

export class Assistant extends EventEmitter {
  private conversationsClient: ConversationClient;
  conversation?: Conversation;
  private options: AssistantOptions;
  private messages: Message[] = [];

  constructor(token: string, options: AssistantOptions = {}) {
    super();
    this.options = options;
    this.conversationsClient = new ConversationClient(token);
    this.conversationsClient.on(
      "connectionStateChanged",
      this.handleConnectionStateChanged.bind(this)
    );
  }

  private handleConnectionStateChanged(state: ConnectionState) {
    this.emit("statusChanged", state);
    return this;
  }

  destroy() {
    this.conversation?.removeAllListeners();
    this.conversationsClient.shutdown();
  }

  updateToken(token: string) {
    this.conversationsClient.updateToken(token);
  }

  async start(
    assistantSid: string,
    conversationSid?: string
  ): Promise<Message[]> {
    this.conversation = await match(conversationSid)
      .with(undefined, () =>
        this.conversationsClient.createConversation({
          attributes: {
            assistantSid: assistantSid,
          },
          friendlyName: `Assistant Conversation ${
            this.conversationsClient.user.identity
          } - ${new Date().toISOString()}`,
        })
      )
      .otherwise((conversationSid) =>
        this.conversationsClient.getConversationBySid(conversationSid)
      );

    try {
      await this.conversation.join();
      this.emit("joinedConversation", {
        conversationSid: this.conversation.sid,
        identity: this.conversationsClient.user.identity,
      });
    } catch (err) {
      if (this.conversation.state?.current === "active") {
        this.emit("joinedConversation", {
          conversationSid: this.conversation.sid,
          identity: this.conversationsClient.user.identity,
        });
      }
    }
    this.conversation.addListener(
      "messageAdded",
      this.handleMessageAdded.bind(this)
    );
    this.conversation.addListener(
      "messageUpdated",
      this.handleMessageUpdated.bind(this)
    );
    this.conversation.addListener(
      "messageRemoved",
      this.handleMessageRemoved.bind(this)
    );
    this.conversation.addListener(
      "updated",
      this.handleConversationUpdate.bind(this)
    );
    const messages = await this.conversation.getMessages();
    this.messages = messages.items;
    this.emit("messagesChanged", this.messages);
    return this.messages;
  }

  async sendMessage(message: string) {
    if (this.conversation) {
      await this.conversation.sendMessage(message);
      return true;
    }
    return false;
  }

  private handleConversationUpdate(data: {
    conversation: Conversation;
    updateReasons: ConversationUpdateReason[];
  }) {
    if (data.updateReasons.includes("attributes")) {
      if (
        typeof data.conversation.attributes === "object" &&
        data.conversation.attributes !== null &&
        !Array.isArray(data.conversation.attributes) &&
        typeof data.conversation.attributes.assistantIsTyping === "boolean"
      ) {
        if (data.conversation.attributes.assistantIsTyping) {
          this.emit("assistantTypingStarted");
        } else {
          this.emit("assistantTypingEnded");
        }
      }
    }
  }

  private handleMessageAdded(message: Message) {
    if (
      typeof message.attributes === "object" &&
      message.attributes !== null &&
      !Array.isArray(message.attributes) &&
      message.attributes.assistantMessageType === "ui-tool"
    ) {
      if (message.body) {
        try {
          const toolData = UiToolData.parse(JSON.parse(message.body));
          this.emit("uiToolTriggered", toolData);
        } catch (err) {
          console.error(err);
        }
      }
      return;
    }
    this.messages = [...this.messages, message];
    this.emit("messagesChanged", this.messages);
  }

  private handleMessageUpdated(data: {
    message: Message;
    updateReasons: MessageUpdateReason[];
  }) {
    this.messages = this.messages.map((msg) =>
      msg.sid === data.message.sid ? data.message : msg
    );
    this.emit("messagesChanged", this.messages);
  }

  private handleMessageRemoved(message: Message) {
    this.messages = this.messages.filter((msg) => msg.sid !== message.sid);
  }
}

export default Assistant;
