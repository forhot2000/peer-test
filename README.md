# Test for library peerjs

# Preparation

## Run peer server

### Run peer server on local

```sh
npm install -g peer
npx peerjs --port 9000 --key peerjs --path /myapp
```

replace your peer server in `src/main.ts`

```ts
const peer = new Peer(nanoid(), {
  host: 'localhost',
  port: 9000,
  path: '/myapp',
  debug: 3,
});
```

### Run peer server on codesandbox.io

create devbox from template node.js

modify package.json

```json
  "scripts": {
    "start": "peerjs --port 9000 --key peerjs --path /myapp"
  },
  "dependencies": {
    "peer": "^1.0.2"
  }
```

run `npm install` in terminal, and then restart server

[here](https://codesandbox.io/p/devbox/peer-server-knn8xt?embed=1&file=%2Fpackage.json) is my peer-server on codesandbox.io

[![Edit peer-server](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/peer-server-knn8xt?embed=1&file=%2Fpackage.json)

replace your peer server in `src/main.ts`

```ts
const peer = new Peer(nanoid(), {
  host: '<your_peer_server_host>',
  path: '/myapp',
  debug: 3,
});
```

# Start dev

```sh
npm run dev
```

after server is started, open http://localhost:5173/ in browser to test it.

# Deploy production

```sh
npm run build
```

then, push dist dir to your server.
