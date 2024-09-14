import OpenAI from "openai";
import Server from "./server.js";
import Chat from "./chat.js";

const HOST = process.env["HOST"];
const PORT = process.env["PORT"];

const chat = new Chat({
  client: new OpenAI({
    apiKey: process.env["API_KEY"],
    baseURL: process.env["API_URL"],
  }),
  model: process.env["MODEL"],
});

const server = new Server()
  .post("/api", (req, res, data) => {
    const request = JSON.parse(data.toString("utf-8"));

    if (!request || !request.prompt) {
      throw new Error(
        `Request has no prompt.\n${JSON.stringify(request, null, 2)}`,
      );
    }

    return chat
      .send({
        role: "user",
        content: request.prompt,
      })
      .then((message) => ({
        response: res,
        headers: {
          "Content-Type": "application/json",
        },
        message: JSON.stringify(message),
      }));
  })
  .listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
