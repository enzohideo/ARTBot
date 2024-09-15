import http from "node:http";

export default class Server {
  router = {};

  constructor() {
    this.server = http.createServer((req, res) => {
      let layer = this.router[req.url];

      if (!layer) {
        let routerKey;

        for (const key of Object.keys(this.router)) {
          const regex = new RegExp(key);
          if (!regex.test(req.url)) continue;
          routerKey = key;
          break;
        }

        if (!routerKey) {
          console.log("Route not found:", req.url, req.method);
          this.send({ response: res, statusCode: 400 });
          return;
        }

        layer = this.router[routerKey];
      }

      layer = layer[req.method];

      if (!layer) {
        console.log("Method not mapped:", req.url, req.method);
        this.send({ response: res, statusCode: 400 });
        return;
      }

      layer(req, res).catch((e) => {
        console.log(e);
        this.send({ response: res, statusCode: 400 });
      });
    });
  }

  route(path, method, action) {
    if (!(path in this.router)) this.router[path] = {};
    this.router[path][method.toUpperCase()] = action;
    return this;
  }

  post(path, action) {
    return this.route(path, "POST", (req, res) =>
      new Promise((resolve, reject) => {
        let waiting = true;

        const timeout = setTimeout(() => {
          reject("No data received from request");
          waiting = false;
        }, 3000);

        req.on("data", (buffer) => {
          if (!waiting) return;
          waiting = false;
          clearTimeout(timeout);
          resolve(buffer);
        });
      }).then((buffer) => action(req, res, buffer)),
    );
  }

  get(path, action) {
    return this.route(path, "GET", async (...args) => action(...args));
  }

  send({ response, statusCode = 200, headers = {}, message = "" }) {
    response.writeHead(statusCode, headers);
    response.end(message);
    return this;
  }

  listen(...args) {
    this.server.listen(...args);
    return this;
  }
}
