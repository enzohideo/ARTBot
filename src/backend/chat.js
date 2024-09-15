import OpenAI from "openai";

export default class Chat {
  messages = [];

  constructor(...args) {
    this.client = new OpenAI(...args);
  }

  send({ role = "user", content, prompt, model, ...rest }) {
    if (!model || (!content && !prompt))
      throw new Error("Missing prompt or model");

    this.messages.push({ role, content: content || prompt });

    return this.client.chat.completions
      .create({
        messages: this.messages,
        model: model,
        ...rest,
      })
      .then((response) => {
        if (
          !response.choices ||
          !response.choices.length ||
          !response.choices[0].message
        )
          throw new Error(
            `Invalid response \n${JSON.stringify(response, null, 2)}`,
          );
        return response.choices[0].message;
      })
      .then((message) => {
        this.messages.push(message);
        return message;
      });
  }
}
