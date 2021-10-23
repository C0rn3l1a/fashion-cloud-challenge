import express from "express";
import body_parser from "body-parser";
import dotenv from "dotenv";
import { router } from "./routes";
import { errorHandler } from "./utils/error";

// initialize configuration
dotenv.config();

const app = express();

const port = process.env.SERVER_PORT ?? 8080;

app.use(body_parser.urlencoded());
app.use(body_parser.json());

// Register all routes
app.use(router);

app.use(errorHandler)

app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server listening at \x1b[33mhttp://localhost:${ port }\x1b[0m`);
} );