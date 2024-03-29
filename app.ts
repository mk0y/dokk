import { Hono } from "hono";
import docs from "./routes/docs";

const app = new Hono();
app.route("/docs", docs);

export default app;
