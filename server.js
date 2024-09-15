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

const server = new Server()
  .post("/api/prompt", (_, response, data) =>
    chat
      .send({
        role: "user",
        ...JSON.parse(data.toString("utf-8")),
      })
      .then((message) => {
        response.writeHead(200, {
          "Content-Type": "text/html",
        });

        const text = message.content.split("```");
        const code = text.splice(1, 1);

        if (code.length > 0) {
          response.write(`
            <iframe id="view" hx-swap-oob="true" srcdoc='${code[0]
              .replace("html\n", "")
              .replace(/"/g, "&#34;")
              .replace(/'/g, "&#39;")}'></iframe>
          `);
        }

        response.end(`
          <div id="chat" hx-swap-oob="true">
            ${text.join("<br>")}
          </div>
        `);
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
