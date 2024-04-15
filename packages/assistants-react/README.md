# Twilio AI Assistants - React SDK

> [!NOTE]
> Twilio AI Assistants is a [Twilio Alpha](https://twilioalpha.com) project that is currently in Developer Preview. If you would like to try AI Assistants, [join the waitlist](https://twilioalpha.com/ai-assistants).

## Installation

> [!NOTE]
> Requires `react` & `react-dom` to be installed

```bash
npm install @twilio-alpha/assistants-react @twilio/conversations
```

## Usage

### Basic usage

```jsx
import { AssistantChat } from "@twilio-alpha/assistants-react";

export function App() {
  return <AssistantChat token={"..."} assistantSid="AI..." />;
}
```

### Using with your own UI

If you want to reuse your own UI you can use the `useAssistant` hook instead.

```jsx
import { useAssistant } from "@twilio-alpha/assistants-react";

export function App() {
  const { messages, sendMessage } = useAssistant("<token>", {
    assistantSid: "<assistantSid>",
  });

  function send(evt) {
    evt.preventDefault();
    sendMessage(evt.target.message.value);
  }

  return (
    <>
      <ul>
        {messages.map((message) => {
          return (
            <li key={message.sid}>
              {message.author}: {message.body}
            </li>
          );
        })}
      </ul>
      <form onSubmit={send}>
        <input type="text" name="message" />
        <input type="submit" value="Send message" />
      </form>
    </>
  );
}
```

### Reusing existing session

By default every time the `AssistantChat` component gets rendered it will create a new Twilio Conversation (aka a session). If you want to re-use the existing one between page refreshes you can use the `conversationSid` property and the `onConversationSetup` handler to persist the session. This gives you full control on how you want to manage the session. If there is no `conversationSid`, the component will automatically create one.

Example code:

```jsx
import { useEffect, useState } from "react";

export function App() {
  const [conversationSid, setConversationSid] = useState();

  useEffect(() => {
    // fetches an existing conversation SID from the local storage if it exists
    setConversationSid(localStorage.getItem("CONVERSATIONS_SID") || undefined);
  }, []);

  function saveConversationSid(sid: string) {
    localStorage.setItem("CONVERSATIONS_SID", sid);
  }

  return (
    <AssistantChat
      token={"..."}
      conversationSid={conversationSid}
      onConversationSetup={saveConversationSid}
      assistantSid="AI..."
      toolHandlers={{ fillForm }}
    />
  );
}
```

## License

MIT
