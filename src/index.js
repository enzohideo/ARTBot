import http from "node:http";
import OpenAI from "openai";
import Chat from "./chat.js";

const HOST = process.env["HOST"];
const PORT = process.env["PORT"];

const chat = new Chat({
  client: new OpenAI({
    apiKey: process.env["API_KEY"],
    baseURL: process.env["API_URL"],
  }),
  model: process.env["MODEL"]
});

const send = ({ res, statusCode = 200, headers = {}, message = "" }) => {
  res.statusCode = 200;
  for (const header of Object.entries(headers)) {
    res.setHeader(...header);
  }
  res.end(message);
};

http
  .createServer((req, res) => {
    switch(req.url) {
      case "/api":
        switch(req.method) {
          case "POST":
            req.on("data", async (buffer) => {
              const request = JSON.parse(buffer.toString("utf-8"));

              if (!request || !request.content) {
                send({ res, statusCode: 400 });
                return;
              }

              chat.send({
                role: "user",
                content: request.content
              })
                .then(message => {
                  send({
                    res,
                    headers: {
                      "Content-Type": "application/json",
                    },
                    message: JSON.stringify(message),
                  });
                })
                .catch((e) => {
                  console.log(e);
                  send({ res, statusCode: 400 });
                })
            });
            return;
        }
    }
    send({ res, statusCode: 400 });
  })
  .listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
