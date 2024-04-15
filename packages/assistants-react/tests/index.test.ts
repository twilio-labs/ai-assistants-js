import { expect, expectTypeOf, test } from "vitest";
import { FC } from "react";
import { useAssistant, AssistantChat, AssistantChatProps } from "../src/index";

// TODO: add more tests

test("exports right items", () => {
  expectTypeOf(useAssistant).toBeCallableWith("<token>", {
    assistantSid: "<assistant-sid>",
  });
  expectTypeOf(AssistantChat).toMatchTypeOf<FC<AssistantChatProps>>();
});
