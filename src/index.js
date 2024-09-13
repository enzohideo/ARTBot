import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["MARITALK_API_KEY"],
  baseURL: "https://chat.maritaca.ai/api",
});

async function main() {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: "Gere um código javascript usando html5 canvas para desenhar um sistema solar" }],
    model: "sabia-3",
  });
  console.log(JSON.stringify(chatCompletion));
}

main();
