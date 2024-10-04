# ART Bot

![image](https://github.com/user-attachments/assets/cbdebfe0-79b7-4cbb-b435-825dca45a6a2)

## Usage

Install required dependencies

```sh
npm i --frozen-lockfile --omit=dev
```

Start the server

```sh
npm start
```

Open the web page

```sh
firefox localhost:8080
```

## Development

Install all dependencies

```
npm i --frozen-lockfile
```

Update Tailwind style and run the server

```sh
# Lints the code using prettier
npm run lint

# Generates style.css using tailwind
npm run style

# Runs the server
npm run dev

# Runs npm style && npm run dev
npm start
```

Testing the inner API with cURL

```sh
curl -X "POST" -d '{"prompt": "Hello! Tell me a joke", "model": "sabia-3", "context": "0"}' localhost:8080/api/prompt
curl -X "GET" localhost:8080/api/models
```

## Nix/NixOS

### Development shell

```sh
nix develop
```
