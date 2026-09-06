import cors from "cors";
import express from "express";

import errorHandler from "../errors/handler.ts";
import routes from "../http/routes/index.ts";

const app = express();
const FILE_SIZE = 30;

app.use(cors());
app.use(express.json({ limit: `${FILE_SIZE}mb` }));
app.use(express.urlencoded({ limit: `${FILE_SIZE}mb` }));
app.use(routes);
app.use(errorHandler);

const host = process.env["APP_HOST"] || "0.0.0.0";
const port = Number(process.env["APP_PORT"]) || 3000;

app.listen(port, host, () =>
  console.log(`[SERVER]: Server is running at ${host}:${port}`),
);

export default app;
