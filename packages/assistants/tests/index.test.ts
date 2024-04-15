import { expect, expectTypeOf, test } from "vitest";
import Assistants from "../src/index";

// TODO: add more tests

test("exports Assistants as a class", () => {
  expectTypeOf(Assistants).toBeConstructibleWith("<token>", {
    assistantSid: "<assistant-sid>",
  });
});
