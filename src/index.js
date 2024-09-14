import Server from "./server.js";
import Chat from "./chat.js";

const HOST = process.env["HOST"];
const PORT = process.env["PORT"];

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
      .then((message) =>
        server.send({
          response,
          headers: {
            "Content-Type": "application/json",
          },
          message: JSON.stringify(message),
        }),
      ),
  )
  .listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
