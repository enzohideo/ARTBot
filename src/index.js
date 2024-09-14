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

http
  .createServer((req, res) => {
    req.on("data", async (buffer) => {
      const request = JSON.parse(buffer.toString("utf-8"));

      if (!request || !request.content) {
        res.statusCode = 400;
        res.end();
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

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    });
  })
  .listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
