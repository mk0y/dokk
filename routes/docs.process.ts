import * as R from "ramda";
import { prepAzClient } from "../utils/deps";
import { raise400 } from "../utils/errors";
import { maybe } from "../utils/fn";
import { RouteContext } from "./routes.types";

const getAzClient = prepAzClient();

const handler = async (c: RouteContext, azClient = getAzClient()) => {
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
};

export const docsProcessRoute = async (c: RouteContext) => {
  const result = await handler(c);
  return result;
};
