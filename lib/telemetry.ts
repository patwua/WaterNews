// Lightweight telemetry helpers for Streams
// Uses navigator.sendBeacon when available; falls back to fetch.

let sid: string | null = null;
export function getStreamsSessionId() {
  if (typeof window === 'undefined') return 'ssr';
  if (sid) return sid;
  try {
    sid = localStorage.getItem('streams.sid');
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('streams.sid', sid);
    }
  } catch {
    sid = 'anon';
  }
  return sid!;
}

export function postEvent(type: string, payload: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const url = '/api/telemetry/events';
  const body = JSON.stringify({ type, sid: getStreamsSessionId(), ...payload });
  try {
    if ('sendBeacon' in navigator) {
      const blob = new Blob([body], { type: 'application/json' });
      (navigator as any).sendBeacon(url, blob);
      return;
    }
  } catch {}
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

