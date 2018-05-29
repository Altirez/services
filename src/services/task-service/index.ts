import * as express from "express";
import { TaskService } from "./TaskService";
import * as BodyParser from "body-parser";

let app = express();

app.use(BodyParser.json());

app.get("/task", (req, res) => {
    let { query } = req;
    if (!query.filter) {
        res.json({});
    }

    let filter = JSON.parse(query.filter);
    let result = TaskService.getTaskBy(filter);

    res.json(result);
});

app.get("/task/:id", (req, res) => {
    let { params } = req;
    let result = TaskService.getTaskById(params.id);

    res.json(result);
});

app.post("/task", async (req, res) => {

    await TaskService.addTask(req.body);
    res.json({});

});

app.listen(3000);
