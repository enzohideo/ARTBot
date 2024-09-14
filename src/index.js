import http from "node:http";
import OpenAI from "openai";

const MODEL = process.env["MODEL"];
const HOST = process.env["HOST"];
const PORT = process.env["PORT"];

const messages = [];

const client = new OpenAI({
  apiKey: process.env["API_KEY"],
  baseURL: process.env["API_URL"],
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
    // TODO: better routing
    if (req.method !== "POST" || req.url !== "/api") {
      send({ res, statusCode: 400 });
      return;
    }

    req.on("data", async (buffer) => {
      const request = JSON.parse(buffer.toString("utf-8"));

      if (!request || !request.content) {
        send({ res, statusCode: 400 });
        return;
      }

      messages.push({
        role: "user",
        content: request.content,
      });

      const response = await client.chat.completions.create({
        messages: messages,
        model: MODEL,
      });

      if (!response.choices || !response.choices.length) {
        send({ res, statusCode: 400 });
        return;
      }

      const message = response.choices[0].message;

      messages.push(message);

      send({
        res,
        headers: {
          "Content-Type": "application/json",
        },
        message: JSON.stringify(message),
      });
    });
  })
  .listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
