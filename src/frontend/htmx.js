// https://htmx.org/essays/web-security-basics-with-htmx/#always-use-an-auto-escaping-template-engine
export function escapeHtmlText(value) {
  const stringValue = value.toString();
  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&grave;",
    "=": "&#x3D;",
  };
  const regex = /[&<>"'`=/]/g;
  return stringValue.replace(regex, (match) => entityMap[match]);
}

export default {
  swap: ({ text, id, swap = "beforeend" }) => `
    <div hx-swap-oob="${swap}" id="${id}" >${text}</div>
  `,

  message: ({ role, text, swap = true, date = new Date(), id }) => `
  ${swap ? '<div id="chat" hx-swap-oob="beforeend">' : ""}
  <div class="border-b border-gray-600 flex items-start py-4 text-sm">
    <div class="relative w-10 h-10 mr-3 bg-gray-800 overflow-hidden rounded-full">
      <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
    </div>
    <div class="flex-1 space-y-1 w-10/12 mr-6">
      <div>
        <span class="font-bold text-blue-300">${role}</span>
        <span class="font-bold text-gray-400 text-xs">${date.getHours()}:${date.getMinutes()}</span>
      </div>
      <div class="text-white leading-normal">
        <div ${id ? `id="${id}"` : ""}>${text}</div>
      </div>
    </div>
  </div>
${swap ? "</div>" : ""}`,

  code: ({ id, language = "html" }) => `
    <div class="rounded-lg px-6 py-3 my-3 bg-gray-700 overflow-x-scroll w-full">
      <pre><code class="language-${language}"><div id="${id}"></div></code></pre>
    </div>`,

  options: ({ opts, classList = [] }) =>
    opts.reduce(
      (acc, opt) =>
        `${acc}<option class="${classList.join()}" value="${opt}">${opt}</option>`,
      "",
    ),

  iframe: ({ html }) => `
    <iframe
      sandbox="allow-scripts"
      class="w-full h-full"
      id="view"
      hx-swap-oob="true"
      allowtransparency="true"
      srcdoc='${escapeHtmlText(
        html
          .replace("html\n", "")
          .replace(
            "<html",
            `<html style='
              width: 100%;
              position: absolute; top: 50%; transform: translate(0, -50%);
              background: transparent;
            '`,
          )
          .replace("<canvas", "<canvas style='width: 100%;'"),
      )}'
    ></iframe>`,
};
