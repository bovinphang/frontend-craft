import test, { afterEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { RequestView } from './request-view.mjs';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test/' });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Node']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key] });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { render, cleanup } = await import('@testing-library/react');
afterEach(cleanup);
after(() => dom.window.close());
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
test('newer request survives a late older result', async () => {
  const a = deferred(), b = deferred();
  // This boundary deliberately ignores AbortSignal; cleanup must also guard publishing.
  const load = id => id === 'A' ? a.promise : b.promise;
  const view = render(React.createElement(RequestView, { requestId: 'A', load }));
  view.rerender(React.createElement(RequestView, { requestId: 'B', load }));
  await act(async () => b.resolve('result-B'));
  assert.equal(view.getByRole('status').textContent, 'result-B');
  await act(async () => a.resolve('result-A'));
  assert.equal(view.getByRole('status').textContent, 'result-B');
});
test('unmount cancels owned request', () => {
  let requestSignal;
  const load = (_id, { signal }) => { requestSignal = signal; return new Promise(() => {}); };
  const view = render(React.createElement(RequestView, { requestId: 'A', load }));
  assert.equal(requestSignal.aborted, false);
  view.unmount();
  assert.equal(requestSignal.aborted, true);
});
