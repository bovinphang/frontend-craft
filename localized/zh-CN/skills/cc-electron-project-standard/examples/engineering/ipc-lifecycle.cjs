/** Main-owned handler core. prepare is non-privileged; commit is synchronous. */
function createTitleHandler({ trustedContentsId, trustedUrl, prepare, commit }) {
  let closed = false;
  const owned = new Set();
  const defective = process.env.CRAFT_ENGINEERING_DEFECTIVE === '1';
  function trusted(event) {
    return event?.sender?.id === trustedContentsId &&
      typeof event.sender.isDestroyed === 'function' && !event.sender.isDestroyed() &&
      event.senderFrame && event.senderFrame === event.sender.mainFrame &&
      event.senderFrame.url === trustedUrl;
  }
  return {
    async handle(event, payload, { signal } = {}) {
      if (!trusted(event)) throw new Error('untrusted sender');
      if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
          Object.keys(payload).length !== 1 || typeof payload.title !== 'string' ||
          !payload.title.trim() || payload.title.length > 80 || /[\x00-\x1f\x7f]/.test(payload.title)) {
        throw new Error('invalid title');
      }
      if (closed || signal?.aborted) throw new Error('handler closed or cancelled');
      const title = payload.title;
      const controller = new AbortController();
      const cancel = () => controller.abort();
      owned.add(controller);
      signal?.addEventListener('abort', cancel, { once: true });
      try {
        await prepare({ title }, { signal: controller.signal });
        if (!defective && (closed || controller.signal.aborted || !trusted(event))) {
          throw new Error('handler closed or cancelled');
        }
        commit(title);
        return { ok: true };
      } finally {
        signal?.removeEventListener('abort', cancel);
        owned.delete(controller);
      }
    },
    close() {
      closed = true;
      for (const controller of owned) controller.abort();
    },
  };
}
module.exports = { createTitleHandler };
