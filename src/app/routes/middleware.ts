import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { Application, json, urlencoded } from "express";
import { limiter } from "../utils/middleware";

export default (app: Application): void => {


    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(limiter);

    if (process.env.NODE_ENV === "production") {
        app.use(cors());
        app.use(helmet());
        app.use(compression());
    }

    if (process.env.NODE_ENV === "development") {
        app.use((req, res, next) => {
            console.log(`${req.method} >> ${req.get("HOST")}${req.originalUrl}`);
            if (["POST", "PUT", "PATCH"].includes(req.method))
                console.log("========Request body==========\n", req.body);
            if (
                ["GET", "DELETE"].includes(req.method) &&
                Object.keys(req.params).length > 0
            )
                console.log("========Request params==========\n", req.params);

            if (req.method === "GET" && Object.keys(req.query).length > 0)
                console.log("========Request query string==========\n", req.query);
            console.log("====Auth token====\n", req.headers);

            next();
        });
    }
};
