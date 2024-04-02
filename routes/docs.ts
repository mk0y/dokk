import { Hono } from "hono";
import * as R from "ramda";
import { analyzeSingleDoc } from "../utils/azure_fn";
import { prepAzClient } from "../utils/deps";
import { raise400 } from "../utils/errors";
import { getAnalyzerType, maybe } from "../utils/fn";
import { AzDocsClient } from "../utils/types";
import { writeToVectorStore } from "../utils/vector_fn";

const app = new Hono<{ Variables: { azClient: AzDocsClient } }>();
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
  const resultdata = [];
  if (!Array.isArray(docs) && docs instanceof File) {
    const data = await getData(docs);
    resultdata.push(data);
  } else if (R.all((doc) => doc instanceof File, docs)) {
    for (let doc of docs) {
      const docdata = await getData(doc);
      resultdata.push(docdata);
    }
  }
  if (resultdata.length < 1) throw raise400({ message: "Unknown error" });
  await writeToVectorStore(resultdata)
  return c.json({ docs: resultdata });
});

export default app;
