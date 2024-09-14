export default class Chat {
  messages = [];

  constructor({ client, model }) {
    this.client = client;
  }

  send({ role, content, model, ...rest }) {
    this.messages.push({ role, content });
    if (!model) throw new Error("You must provide a model");
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
