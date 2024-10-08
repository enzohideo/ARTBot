# ART Bot

![image](https://github.com/user-attachments/assets/cbdebfe0-79b7-4cbb-b435-825dca45a6a2)

## Requirements

NodeJS>=v20.6.0

## Usage

Install required dependencies

```sh
npm i --frozen-lockfile --omit=dev
```

Save these environment variables in a .env file

```sh
API_URL=        # API url
API_KEY=        # API key (if any)
HOST=localhost  # web interface host
PORT=8080       # web interface port
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
# Formats the code using prettier
npm run format

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

## API Compatibility

This project should work with any API compatible with OpenAI's.

- Llama-cpp
```sh
# Set API_URL to 127.0.0.1:8888 and leave API_KEY empty
llama-server -m your_model.gguf --port 8888 --chat-template openchat
```

## Nix/NixOS

### Development shell

```sh
nix develop
```
