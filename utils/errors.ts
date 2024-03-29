import { HTTPException } from "hono/http-exception";

export const raise400 = ({ message }: { message: string }) =>
  new HTTPException(400, { message });
