/** Deliberately broken teaching variant: no sender or argument validation. */
function createSetTitleDefective({ setTitle }) {
  return (_event, payload) => { setTitle(payload.title); return { ok: true }; };
}
function createSetTitle({ trustedContentsId, trustedUrl, setTitle }) {
  return (event, payload) => {
    if (event.sender?.id !== trustedContentsId ||
        !event.senderFrame || event.senderFrame !== event.sender.mainFrame ||
        event.senderFrame.url !== trustedUrl) throw new Error('untrusted sender');
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).length !== 1 || typeof payload.title !== 'string' ||
        !payload.title.trim() || payload.title.length > 80 || /[\x00-\x1f\x7f]/.test(payload.title)) {
      throw new Error('invalid title');
    }
    setTitle(payload.title);
    return { ok: true };
  };
}
module.exports = { createSetTitle, createSetTitleDefective };
