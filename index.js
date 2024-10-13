import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors";

import * as utils from "./utils.js";
import routes from "./routes.js"
import * as strs from "./strings.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    if (
        Object.values(routes).includes(req.url) ||
        req.url == "/"
    ) {
        let message = req.url == "/" ?
            `Website request received ! Serving website in '${req.url}' .` :
            `Received ${req.method} request in '${req.url}' !`;
        utils.log(message, "ok");
    } else {
        utils.log(`The route '${req.url}' does not exist.`, "error");
        res.status(404).send("Route does not exist !");
    };
    next();
});


app.use(express.static(
    path.join(path.dirname(
        fileURLToPath(import.meta.url)
    ), 'public')
));

app.get(routes.start, (req, res) => {
    res.status(200).send({ text: strs.startString });
});

app.get(routes.ping, (req, res) => {
    res.status(200).send("Pong!");
});

app.post(routes.command, async (req, res) => {
    const command = req.body.command;
    utils.log(`Command Requested: ${command}`, "info");
    await utils.run(command).then((result) => {
        //utils.log(`Command Result: ${result.stdout}`, "info");
        res.send(result)
    });
});

app.listen(port, () => {
    utils.log(`Server listening on ${port} !`)
});