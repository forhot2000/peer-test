import './style.css';

import { DataConnection, Peer } from 'peerjs';
import { customAlphabet } from 'nanoid';

async function enableVConsole() {
  try {
    const { default: VConsole } = await import('vconsole');
    new VConsole();
  } catch {}
}

function main() {
  const nanoid = customAlphabet('1234567890abcdefghjkmnpqrstuvwxyz', 4);

  const connectForm = document.querySelector<HTMLFormElement>('#connect_form')!;
  const sendForm = document.querySelector<HTMLFormElement>('#send_form')!;
  const friendEl = document.querySelector<HTMLInputElement>('#friend')!;
  const connectBtn = document.querySelector<HTMLButtonElement>('#connect')!;
  const sendBtn = document.querySelector<HTMLButtonElement>('#send')!;
  const messageEl = document.querySelector<HTMLTextAreaElement>('#message')!;
  const historyEl = document.querySelector<HTMLElement>('#history')!;

  const opts = {
    my: '',
    friend: '',
    conn: {} as DataConnection,
  };

  const peer = new Peer(nanoid(), {
    host: 'knn8xt-9000.csb.app',
    path: '/myapp',
    debug: 3,
  });
  peer.on('open', (id) => {
    opts.my = id;
    document.title = `${id}@chatroom`;
    document.querySelector<HTMLElement>('#id')!.innerText = id;
  });
  peer.on('error', (err) => {
    console.error(err);
  });
  peer.on('connection', (conn) => {
    console.log('incoming peer connection!');
    const friend = conn.peer;
    console.log({ friend });
    friendEl.disabled = true;
    friendEl.value = friend;
    connectBtn.disabled = true;
    sendBtn.disabled = false;
    opts.friend = friend;
    opts.conn = conn;
    conn.on('data', (data) => {
      console.log('receive: %O', data);
      logMessage(data as string);
    });
    conn.on('open', () => {
      conn.send('hi!');
    });
  });

  function logMessage(message: string, isSend = false) {
    const d = document.createElement('div');
    d.innerText = message;
    if (isSend) {
      d.style.setProperty('text-align', 'right');
    }
    historyEl.appendChild(d);
    historyEl.scrollTo({ top: d.scrollHeight });
  }

  connectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const friend = friendEl.value;

    const conn = peer.connect(friend);
    opts.conn = conn;
    friendEl.disabled = true;
    connectBtn.disabled = true;
    sendBtn.disabled = false;
    opts.friend = friend;
    conn.on('data', (data) => {
      console.log('receive: %O', data);
      logMessage(data as string);
    });
    conn.on('open', () => {
      conn.send('hi!');
    });
  });

  sendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageEl.value.trim();
    messageEl.value = '';
    if (message) {
      opts.conn.send(message);
      logMessage(message, true);
    }
  });
}

enableVConsole()
  .then(() => main())
  .catch((err) => console.error(err));
