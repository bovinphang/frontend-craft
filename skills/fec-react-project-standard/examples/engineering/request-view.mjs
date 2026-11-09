import React, { useEffect, useState } from 'react';

// Defect switch is for the paired verification only. The default owns cleanup.
export function RequestView({ requestId, load }) {
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const defective = process.env.CRAFT_ENGINEERING_DEFECTIVE === '1';
    setStatus('loading');
    void (async () => {
      try {
        const result = await load(requestId, { signal: controller.signal });
        if (defective || active) setStatus(result);
      } catch (error) {
        if (defective || active) setStatus(error instanceof Error ? error.message : 'request failed');
      }
    })();
    return () => {
      if (!defective) { active = false; controller.abort(); }
    };
  }, [requestId, load]);
  return React.createElement('output', { role: 'status' }, status);
}
