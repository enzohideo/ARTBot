export default {
  message: (role, text, date = new Date()) =>
    !text
      ? ""
      : `
<div id="chat" hx-swap-oob="beforeend">
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
</div>`,

  options: (opts, classList = []) =>
    opts.reduce(
      (acc, opt) =>
        `${acc}<option class="${classList.join()}" value="${opt}">${opt}</option>`,
      "",
    ),

  iframe: (
    code,
  ) => `<iframe class="w-full h-full" id="view" hx-swap-oob="true" allowtransparency="true" srcdoc='${code
    .replace("html\n", "")
    .replace(
      "<html",
      `<html style='
        width: 100%;
        position: absolute; top: 50%; transform: translate(0, -50%);
        background: transparent;
      '`,
    )
    .replace("<canvas", "<canvas style='width: 100%;'")
    .replace(/"/g, "&#34;")
    .replace(/'/g, "&#39;")}'>
  </iframe>`,
};
