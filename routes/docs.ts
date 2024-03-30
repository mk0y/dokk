import { DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { Hono } from "hono";
import * as R from "ramda";
import { analyzeSingleDoc } from "../utils/azure_fn";
import { prepAzClient } from "../utils/deps";
import { raise400 } from "../utils/errors";
import { getAnalyzerType, maybe } from "../utils/fn";
import { AzDocsClient } from "../utils/types";

const app = new Hono<{ Variables: AzDocsClient }>();
const getAzClient = prepAzClient(Bun.env.ENV !== "test");
app.use(async (c, next) => {
  c.set("azClient", getAzClient());
  await next();
});

app.post("/process", async (c) => {
  const b = await c.req.parseBody();
  const docs = maybe(() => b["docs[]"]) as File | File[];
  const doctype = b["doctype"] as string;
  const analyzerType = getAnalyzerType(doctype);
  if (!analyzerType) {
    throw raise400({ message: "Unknown analyzer type" });
  }
  if (!docs) {
    throw raise400({ message: "Missing docs[] form data" });
  }
  const azClient = c.get("azClient");
  const getData = R.curry(({ azClient, analyzerType }, docs) => {
    return analyzeSingleDoc({
      doc: docs,
      azClient,
      analyzerType,
    });
  })({ azClient, analyzerType });
  if (!Array.isArray(docs) && docs instanceof File) {
    const data = await getData(docs);
    return c.json({ docs: [data] });
  } else if (R.all((doc) => doc instanceof Blob, docs)) {
    const returndata = []
    for (let doc of docs) {
      const data = await getData(doc);
      returndata.push(data)
    }
    return c.json({ docs: returndata });
  } else {
    throw raise400({ message: "Unknown type" });
  }
});

export default app;
