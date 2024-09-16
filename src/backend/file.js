import path from "node:path";
import fs from "node:fs";

export const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const toBool = [() => true, () => false];

export default async (base, url) => {
  const paths = [base, url.endsWith("/") ? "/pages/main/index.html" : url];

  const filePath = path.join(...paths);

  const pathTraversal = !filePath.startsWith(base);
  const found =
    !pathTraversal &&
    (await fs.promises.access(filePath).then(
      () => true,
      () => false,
    ));

  const streamPath = found ? filePath : base + "/pages/404/index.html";

  return {
    ok: found,
    ext: path.extname(streamPath).substring(1).toLowerCase(),
    stream: fs.createReadStream(streamPath),
  };
};
