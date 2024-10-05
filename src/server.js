import Server from "./backend/http.js";
import Chat from "./backend/chat.js";
import parseStream from "./backend/parse.js";
import getFile, { MIME_TYPES } from "./backend/file.js";
import Ui, { escapeHtmlText } from "./frontend/htmx.js";

import path from "node:path";
import hljs from "highlight.js";

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

    response.writeHead(200, { "Content-Type": "text/html" });

    if (!data.model || !data.prompt || !MODELS.includes(data.model)) {
      response.end(
        Ui.message({
          role: "system",
          text: `Invalid model and/or prompt.<br><br>
            prompt: ${data.prompt}<br>
            model: ${data.model}
          `,
        }),
      );
      return;
    }

    const id = `sse-${Date.now()}`;

    response.end(`
      ${Ui.message({
        role: "user",
        text: data.prompt || data.content,
      })}
      ${Ui.message({
        role: "assistant",
        text: "",
        id: id,
      })}
    `);

    let codeId;

    return chat
      .send({
        role: "user",
        stream: true,
        ...data,
      })
      .then((stream) =>
        parseStream({
          stream,
          chunkParser: (chunk) => chunk.choices[0]?.delta?.content || "",
          handlers: [
            (text, transition, acc) => {
              if (!chat.sse) return;

              chat.sse(
                Ui.swap({
                  id,
                  text: escapeHtmlText(text)
                    .replace(/\n/g, "<br>")
                    .replace(/<br><br>/g, "<br>"),
                }),
              );

              codeId = `code-${id}-${Date.now()}`;

              if (transition)
                chat.sse(
                  Ui.swap({
                    id,
                    text: Ui.code({ id: codeId }),
                  }),
                );
            },
            (text, transition, acc) => {
              if (!chat.sse) return;

              if (transition) {
                const languageIndex = acc.search(/[^A-Za-z]/);

                chat.sse(Ui.iframe({ html: acc }));
                chat.sse(
                  Ui.swap({
                    swap: true,
                    id: codeId,
                    text: hljs.highlight(acc.slice(languageIndex + 1), {
                      language: acc.slice(0, languageIndex),
                    }).value,
                  }),
                );
              } else {
                chat.sse(
                  Ui.swap({
                    id: codeId,
                    text: hljs.highlight(text, { language: "html" }).value,
                  }),
                );
              }
            },
          ],
        }),
      );
  })
  .get("/sse", (request, response) => {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });

    console.log("New SSE connection.");

    chat.sse = (message) => {
      response.write(`data: ${message.replaceAll("\n", "\ndata: ")}\n\n`);
    };

    request.on("close", () => {
      chat.sse = null;
      console.log("Closed SSE connection.");
    });
  })
  .get("/api/model", (_, response) => {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(Ui.options({ opts: MODELS }));
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
  })
  .on("error", (err) => {
    console.log(err);
    server.close();
  });
