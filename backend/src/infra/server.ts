import "dotenv/config";
import { onRequest, type HttpsFunction } from "firebase-functions/https";

import app from "./server/app.ts";

const main = (): HttpsFunction => {
    const api = onRequest(app);

    return api;
};

export default main;
