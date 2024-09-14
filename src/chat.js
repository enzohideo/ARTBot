export default class Chat {
  messages = [];

  constructor({ client, model }) {
    this.client = client;
    this.model = model;
  }

  send(message) {
    this.messages.push(message);
    return this.client.chat.completions
      .create({
        messages: this.messages,
        model: this.model,
      })
      .then((response) => {
        if (
          !response.choices ||
          !response.choices.length ||
          !response.choices[0].message
        )
          throw new Error(
            `[Chat]: Invalid response \n${JSON.stringify(response, null, 2)}`,
          );
        return response.choices[0].message;
      })
      .then((message) => {
        this.messages.push(message);
        return message;
      });
  }
}
