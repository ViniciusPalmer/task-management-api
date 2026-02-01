import { parse } from "csv-parse";

import { Database } from "../database.js";
import { completeTask, createTask, updateTask } from "../models/task.js";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body ?? {};

      if (!title || !description) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            message: "title and description are required",
          }),
        );
        return;
      }

      const task = createTask(title, description);
      database.insert("tasks", task);

      res.writeHead(201);
      res.end(JSON.stringify(task));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks/import"),
    handler: async (req, res) => {
      const contentType = req.headers["content-type"] ?? "";
      if (!contentType.includes("text/csv")) {
        res.writeHead(415);
        res.end(
          JSON.stringify({
            message: "Content-Type must be text/csv",
          }),
        );
        return;
      }

      const records = [];
      let invalidRows = 0;
      const parser = parse({
        delimiter: ";",
        columns: ["title", "description"],
        trim: true,
        skip_empty_lines: true,
        relax_column_count: true,
        relax_quotes: true,
      });

      try {
        for await (const record of req.pipe(parser)) {
          const { title, description } = record ?? {};

          if (title === "title" && description === "description") {
            continue;
          }

          records.push({ title, description });
        }
      } catch (error) {
        console.log("Error parsing CSV:", error);
        res.writeHead(400);
        res.end(
          JSON.stringify({
            message: "Invalid CSV content",
          }),
        );
        return;
      }

      if (records.length === 0) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            message: "CSV has no valid rows to import",
          }),
        );
        return;
      }

      for (const { title, description } of records) {
        const task = createTask(title, description);
        database.insert("tasks", task);
      }

      res.writeHead(201);
      res.end(
        JSON.stringify({
          imported: records.length,
        }),
      );
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query ?? {};
      const tasks =
        database.select(
          "tasks",
          search
            ? {
                title: search,
                description: search,
              }
            : null,
        ) ?? [];

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description, completed } = req.body ?? {};

      // * Get task by id
      const [task] = database.select("tasks", null, id);
      const tasks = updateTask(task, title, description, completed);

      database.update("tasks", id, tasks);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      // * Get task by id
      const [task] = database.select("tasks", null, id);
      const tasks = completeTask(task);

      database.update("tasks", id, tasks);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
