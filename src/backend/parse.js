export const State = {
  TEXT: 0,
  CODE: 1,
};

export default async ({ stream, chunkParser, separator = "```", handlers }) => {
  let state = State.TEXT;
  let prevText = "";
  let accText = "";
  let accCode = "";

  const parse = (currText) => {
    const mergedText = `${prevText}${currText}`;

    const codeIndex = mergedText.indexOf(separator);
    const foundSeparator = codeIndex >= 0;

    if (foundSeparator) {
      prevText = mergedText.slice(0, codeIndex);
      currText = mergedText.slice(codeIndex + 3);
    }

    const handle = handlers[state];
    const acc =
      state == State.TEXT ? (accText += prevText) : (accCode += prevText);

    handle(prevText, foundSeparator, acc);

    prevText = currText;
    if (foundSeparator) state = state == State.TEXT ? State.CODE : State.TEXT;
  };

  for await (const chunk of stream) {
    parse(chunkParser(chunk));
  }

  parse("");
};
