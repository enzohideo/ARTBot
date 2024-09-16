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
  message: ({ role, text, swap = true, date = new Date() }) =>
    !text
      ? ""
      : `
${swap ? '<div id="chat" hx-swap-oob="beforeend">' : ""}
  <div class="border-b border-gray-600 flex items-start py-4 text-sm">
    <div class="relative w-10 h-10 mr-3 bg-gray-800 overflow-hidden rounded-full">
      <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
    </div>
    <div class="flex-1 space-y-1">
      <div>
        <span class="font-bold text-blue-300">${role}</span>
        <span class="font-bold text-gray-400 text-xs">${date.getHours()}:${date.getMinutes()}</span>
      </div>
      <p class="text-white leading-normal">${text}</p>
    </div>
  </div>
${swap ? "</div>" : ""}
`,

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
