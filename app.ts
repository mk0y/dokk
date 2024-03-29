import { Hono } from "hono";
import { docsProcessRoute } from "./routes/docs.process";

const app = new Hono();

app.post("/docs/process", docsProcessRoute);

export default app;
