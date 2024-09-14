# Codelab Chatbot

## Usage

### Server

```sh
npm i --frozen-lockfile
npm start
```

### CURL Client

Get web page

```sh
curl localhost:8080
```

Test inner API

```sh
curl -X "POST" -d '{"content": "Hello! Tell me a joke", "model": "sabia-3"}' localhost:8080/api
```

## Nix/NixOS

### Development shell

```sh
nix develop
```
