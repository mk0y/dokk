import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { Hono } from "hono";
import { uploadRoute } from "./routes/upload";
const endpoint = process.env.AZURE_DOCS_ENDPOINT as string;
const azureKey = process.env.AZURE_KEY_CREDENTIAL as string;
const azClient = new DocumentAnalysisClient(
  endpoint,
  new AzureKeyCredential(azureKey)
);

const app = new Hono();

app.post("/upload", uploadRoute);

export default app;
