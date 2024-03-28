import { Context, Env } from "hono";
import { BlankInput } from "hono/types";
import { prepAzClient } from "../utils/deps";

const getAzClient = prepAzClient();

export const uploadRoute = async (c: Context<Env, "/upload", BlankInput>) => {
  const formdata = await c.req.formData();
  const doc = formdata.getAll("docs").length;
  console.log(doc);
  return c.json({ dev: "dev" });
};
