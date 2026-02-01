import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js/task-management-routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const contentType = req.headers["content-type"] ?? "";
  const isJson = contentType.includes("application/json");

  res.setHeader("Content-type", "application/json");

  if (isJson) {
    await json(req, res);
  }

  const route = routes.find((route) => {
    return route.method === req.method && route.path.test(req.url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups ?? {};

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
