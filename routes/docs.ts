import { DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { Hono } from "hono";
import * as R from "ramda";
import { prepAzClient } from "../utils/deps";
import { raise400 } from "../utils/errors";
import { maybe } from "../utils/fn";

type Variables = {
  azClient: DocumentAnalysisClient | Function;
};

const app = new Hono<{ Variables: Variables }>();
const getAzClient = prepAzClient();
app.use(async (c, next) => {
  c.set("azClient", getAzClient());
  await next();
});

app.post("/process", async (c) => {
  const b = await c.req.parseBody();
  const docs = maybe(() => b["docs[]"]);
  if (!docs) {
    throw raise400({ message: "Type should be docs[]" });
  }
  if (!Array.isArray(docs) && docs instanceof Blob) {
    return c.json({ message: "not array" });
  } else if (R.all((doc) => doc instanceof Blob, docs)) {
    return c.json({ message: "array" });
  } else {
    throw raise400({ message: "Unknown type" });
  }
});

export default app;
