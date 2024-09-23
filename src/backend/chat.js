import OpenAI from "openai";

export default class Chat {
  messages = [];
  #models;

  constructor(...args) {
    this.client = new OpenAI(...args);
  }

  models() {
    if (this.#models) return this.#models;
    return this.client.models.list().then((m) => {
      this.#models = m;
      return m;
    });
  }

  send({ role = "user", content, prompt, model, context, ...rest }) {
    if (!model || (!content && !prompt))
      throw new Error("Missing prompt or model");

    this.messages.push({ role, content: content || prompt });

    return this.client.chat.completions.create({
      messages: this.messages.slice(context < 0 ? 0 : -context - 1),
      model: model,
      ...rest,
    });
  }
}
