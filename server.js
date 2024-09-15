import Server from "./src/backend/http.js";
import Chat from "./src/backend/chat.js";
import path from "node:path";
import getFile, { MIME_TYPES } from "./src/backend/file.js";

const HOST = process.env["HOST"];
const PORT = process.env["PORT"];
const FRONTEND_PATH = path.join(process.cwd(), "./src/frontend");

const chat = new Chat({
  apiKey: process.env["API_KEY"],
  baseURL: process.env["API_URL"],
});

const server = new Server();

server
  .get("/", (_, response) => {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(`<html><body>Hello World</body></html>`);
  })
  .post("/api", (_, response, data) =>
    chat
      .send({
        role: "user",
        ...JSON.parse(data.toString("utf-8")),
      })
      .then((message) => {
        response.writeHead(200, {
          "Content-Type": "application/json",
        });
        response.end(JSON.stringify(message));
      }),
  )
  .get("/*", (request, response) =>
    getFile(FRONTEND_PATH, request.url).then((file) => {
      response.writeHead(file.ok ? 200 : 404, {
        "Content-Type": MIME_TYPES[file.ext] || MIME_TYPES.default,
      });
      file.stream.pipe(response);
    }),
  )
  .listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
