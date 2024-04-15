# Twilio AI Assistants - JavaScript SDK

> [!NOTE]
> Twilio AI Assistants is a [Twilio Alpha](https://twilioalpha.com) project that is currently in Developer Preview. If you would like to try AI Assistants, [join the waitlist](https://twilioalpha.com/ai-assistants).

## Installation

```bash
npm install @twilio-alpha/assistants @twilio/conversations
```

## Usage

```js
import Assistant from "@twilio-alpha/assistants-react";

const assistant = new Assistant("<token>");
let messages = await assistant.start();
assistant.on("messagesChanged", (newMessages) => {
  messages = newMessages;
});
assistant.sendMessage("Ahoy");
```

## License

MIT
