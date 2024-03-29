import { expect, mock, test } from "bun:test";
import app from "../app";
import { docsProcessRoute } from "./docs.process";

const docsProcessRouteMock = mock(docsProcessRoute);

test("Sent no body", async () => {
  const res = await app.request("/docs/process", { method: "POST" });
  const message = await res.text();
  expect(res.status).toBe(400);
  expect(message).toBe("Type should be docs[]");
});

test("Sent one docs[]", async () => {
  const file = Bun.file(Bun.main);
  const formData = new FormData();
  formData.append("docs[]", file);
  const res = await app.request("/docs/process", {
    method: "POST",
    body: formData,
  });
  const json = (await res.json()) as { message: string };
  expect(json.message).toBe("not array");
  expect(res.status).toBe(200);
});

test("Sent two docs[]", async () => {
  const file = Bun.file(Bun.main);
  const formData = new FormData();
  formData.append("docs[]", file);
  formData.append("docs[]", file);
  const res = await app.request("/docs/process", {
    method: "POST",
    body: formData,
  });
  const json = (await res.json()) as { message: string };
  expect(json.message).toBe("array");
  expect(res.status).toBe(200);
});
