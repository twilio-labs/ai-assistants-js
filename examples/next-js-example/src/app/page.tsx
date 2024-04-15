"use client";

import { ExampleForm, ExampleFormData } from "@/components/ExampleForm";
import { AssistantChat } from "@twilio-alpha/assistants-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [conversationSid, setConversationSid] = useState<string>();
  const [formData, setFormData] = useState<ExampleFormData>({
    firstName: "",
    lastName: "",
    email: "",
    interest: "",
    company: "",
  });

  useEffect(() => {
    setConversationSid(localStorage.getItem("CONVERSATIONS_SID") || undefined);
    fetch("/token")
      .then((resp) => resp.json())
      .then(({ token }) => {
        setToken(token);
      });
  }, []);

  function saveConversationSid(sid: string) {
    localStorage.setItem("CONVERSATIONS_SID", sid);
  }

  function fillForm(data: ExampleFormData) {
    console.log("new data", data);
    setFormData(data);
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-slate-600 font-bold">Assistants Demo</h1>
      <div className="mt-10">
        <AssistantChat
          token={token}
          conversationSid={conversationSid}
          onConversationSetup={saveConversationSid}
          assistantSid={process.env.NEXT_PUBLIC_ASSISTANT_SID || "AI..."}
          toolHandlers={{ fillForm }}
        />
      </div>
      <ExampleForm data={formData} />
    </div>
  );
}
