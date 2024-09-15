import Server from "./src/backend/http.js";
import Chat from "./src/backend/chat.js";
import Ui from "./src/frontend/htmx.js";
import path from "node:path";
import getFile, { MIME_TYPES } from "./src/backend/file.js";

const HOST = process.env["HOST"];
const PORT = process.env["PORT"];
const FRONTEND_PATH = path.join(process.cwd(), "./src/frontend");

// FIXME: Maritalk API does not seem to support the 'list models' request yet
const MODELS = [
  "sabia-3",
  "sabia-2-medium",
  "sabia-2-small",
  // "sabia-2-medium-2024-03-13",
  // "sabia-2-small-2024-03-13",
];

const chat = new Chat({
  apiKey: process.env["API_KEY"],
  baseURL: process.env["API_URL"],
});

const server = new Server()
  .post("/api/prompt", (_, response, data) => {
    data = JSON.parse(data.toString("utf-8"));

    if (!data.model || !data.prompt || !MODELS.includes(data.model)) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(
        Ui.message(
          "system",
          `Invalid model and/or prompt.<br><br>
          prompt: ${data.prompt}<br>
          model: ${data.model}
        `,
        ),
      );
      return;
    }

    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(
      Ui.message(data.role || "user", data.content || data.prompt),
    );

    return chat
      .send({
        role: "user",
        ...data,
      })
      .then((message) => {
        const text = message.content.split("```");
        const code = text.splice(1, 1);

        if (code.length > 0) response.write(Ui.iframe(code[0]));

        response.end(
          Ui.message(message.role, text.join("<br><br>").replace(":", ".")),
        );
      });
  })
  .get("/api/model", (_, response) => {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(Ui.options(MODELS));
  })
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
