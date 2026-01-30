import { Hono } from "hono";
import { logger } from "hono/logger";
import tributesApp from "./features/tributes";

const app = new Hono();

app.use("*", logger());

app.route("/tributes", tributesApp);

export default app;
