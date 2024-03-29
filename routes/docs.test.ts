import { describe, expect, test } from "bun:test";
import app from "./docs";

app.use(async (c, next) => {
  c.set("azClient", () => 123);
  await next();
});

describe(`POST "/docs/process"`, () => {
  test("no body = 400", async () => {
    const res = await app.request("/process", { method: "POST" });
    const message = await res.text();
    expect(res.status).toBe(400);
    expect(message).toBe("Type should be docs[]");
  });

  test("single docs[]", async () => {
    const file = Bun.file(Bun.main);
    const formData = new FormData();
    formData.append("docs[]", file);
    const res = await app.request("/process", {
      method: "POST",
      body: formData,
    });
    const json = (await res.json()) as { message: string };
    expect(json.message).toBe("not array");
    expect(res.status).toBe(200);
  });

  test("two docs[]", async () => {
    const file = Bun.file(Bun.main);
    const formData = new FormData();
    formData.append("docs[]", file);
    formData.append("docs[]", file);
    const res = await app.request("/process", {
      method: "POST",
      body: formData,
    });
    const json = (await res.json()) as { message: string };
    expect(json.message).toBe("array");
    expect(res.status).toBe(200);
  });
});
