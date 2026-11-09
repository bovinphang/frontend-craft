const test = require('node:test');
const assert = require('node:assert/strict');
const { createTitleHandler } = require('./ipc-lifecycle.cjs');
const trustedUrl = 'app://bundle/index.html';
function event() {
  const frame = { url: trustedUrl };
  return { sender: { id: 7, mainFrame: frame, isDestroyed: () => false }, senderFrame: frame };
}
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}
test('EP-IPC-01 closed handler cannot produce privileged effects', async () => {
  const gate = deferred(), effects = [];
  const handler = createTitleHandler({ trustedContentsId: 7, trustedUrl, prepare: () => gate.promise, commit: title => effects.push(title) });
  const pending = handler.handle(event(), { title: 'safe' });
  const rejected = assert.rejects(pending, /closed or cancelled/);
  handler.close(); gate.resolve(); await rejected;
  assert.deepEqual(effects, []);
});
test('EP-IPC-01 cancelled handler cannot produce privileged effects', async () => {
  const gate = deferred(), effects = [], cancel = new AbortController();
  const handler = createTitleHandler({ trustedContentsId: 7, trustedUrl, prepare: () => gate.promise, commit: title => effects.push(title) });
  const pending = handler.handle(event(), { title: 'safe' }, { signal: cancel.signal });
  const rejected = assert.rejects(pending, /closed or cancelled/);
  cancel.abort(); gate.resolve(); await rejected;
  assert.deepEqual(effects, []);
});
test('EP-IPC-01 valid live call commits once', async () => {
  const effects = [];
  const handler = createTitleHandler({ trustedContentsId: 7, trustedUrl, prepare: async () => {}, commit: title => effects.push(title) });
  assert.deepEqual(await handler.handle(event(), { title: 'safe' }), { ok: true });
  assert.deepEqual(effects, ['safe']);
  handler.close();
});
test('EP-IPC-01 denied sender and malformed payload have zero effects', async () => {
  const effects = [];
  const handler = createTitleHandler({ trustedContentsId: 7, trustedUrl, prepare: async () => {}, commit: title => effects.push(title) });
  const untrusted = event(); untrusted.senderFrame.url = 'https://untrusted.invalid/';
  await assert.rejects(handler.handle(untrusted, { title: 'safe' }), /untrusted sender/);
  await assert.rejects(handler.handle(event(), { title: '' }), /invalid title/);
  assert.deepEqual(effects, []);
});
