import OpenAI from "openai";

export default class Chat {
  messages = [];
  #models = [];

  constructor(args) {
    this.client = new OpenAI(args);

    // FIXME: Maritalk API doesn't support the '/v1/models' request yet
    // curl ${API_URL}/models -H "Authorization: Bearer $API_KEY"
    // https://platform.openai.com/docs/api-reference/models/list
    if (args?.baseURL?.includes("maritaca"))
      this.#models = [
        "sabia-3",
        "sabia-2-medium",
        "sabia-2-small",
        // "sabia-2-medium-2024-03-13",
        // "sabia-2-small-2024-03-13",
      ];
  }

  async models() {
    if (!this.#models)
      await this.client.models
        .list()
        .then((m) => (this.#models = m))
        .catch(() => {
          this.#models = [];
          console.log("/models is not supported by host");
        });
    return this.#models;
  }

  send({ role = "user", content, prompt, model, context, ...rest }) {
    if (!content && !prompt) throw new Error("Missing prompt");

    this.messages.push({ role, content: content || prompt });

    return this.models().then((models) =>
      this.client.chat.completions.create({
        messages: this.messages.slice(context < 0 ? 0 : -context - 1),
        model: models.includes(model) ? model : this.#models[-1],
        stop: [
          `${role}:`,
          `${role.charAt(0).toUpperCase() + role.slice(1)}:`,
          'GPT4 Incorrect',
          'GTP4 Correct'
        ],
        ...rest,
      }),
    );
  }
}
