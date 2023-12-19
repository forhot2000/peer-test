import './style.css';

import { customAlphabet } from 'nanoid';
import { DataConnection, Peer } from 'peerjs';

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
    conn: undefined as DataConnection | undefined,
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
      logMessage({ message: data as string, id: opts.friend });
    });
    conn.on('open', () => {
      conn.send('hi!');
    });
  });

  function logMessage(opts: { message: string; id: string; isSend?: boolean }) {
    const { message, id, isSend = false } = opts;
    const d = document.createElement('div');
    if (isSend) {
      d.style.setProperty('text-align', 'right');
      d.innerText = `${message} :${id}`;
    } else {
      d.innerText = `${id}: ${message}`;
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
      logMessage({ message: data as string, id: opts.friend });
    });
    conn.on('open', () => {
      conn.send('hi!');
    });
  });

  messageEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!e.altKey && !e.ctrlKey) {
        // press Enter key to send
        send();
      } else {
        // insert newline when alt or ctrl key down
        let p = messageEl.selectionStart;
        messageEl.setRangeText('\n');
        messageEl.setSelectionRange(p + 1, p + 1);
      }
    }
  });

  sendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    send();
  });

  function send() {
    if (opts.conn) {
      const message = messageEl.value.trim();
      messageEl.value = '';
      if (message) {
        opts.conn.send(message);
        logMessage({ message, id: opts.my, isSend: true });
      }
    } else {
      console.log('not connected.');
    }
  }
}

enableVConsole()
  .then(() => main())
  .catch((err) => console.error(err));
