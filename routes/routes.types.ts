import { Context, Env } from "hono";
import { BlankInput } from "hono/types";

export type RouteContext = Context<Env, "/upload", BlankInput>;
