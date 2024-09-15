# Codelab Chatbot

## Usage

Start the server

```sh
npm i --frozen-lockfile
npm start
```

Open the web page

```sh
firefox localhost:8080
```

## Development

Update Tailwind style and run the server

```sh
npm run dev
```

Testing the inner API with cURL

```sh
curl -X "POST" -d '{"prompt": "Hello! Tell me a joke", "model": "sabia-3"}' localhost:8080/api/prompt
curl -X "GET" localhost:8080/api/models
```

## Nix/NixOS

### Development shell

```sh
nix develop
```
