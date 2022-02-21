import Express from "express";
import Routes from "./app/routes";
import Middleware from "./app/routes/middleware";
import StartDb from './app/utils/db';


const app = Express();

Middleware(app);
Routes(app);


(async () => {
    await StartDb();
    app.listen(process.env.PORT, () => {
        console.log(`App connected on port ${process.env.PORT}`)
        app.emit("appStarted");
    })
})();

export default app;