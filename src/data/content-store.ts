/** Content fetched from the shared store at startup. Set once in main.tsx, before the app modules load. */
let remote: Record<string, unknown> | null = null;

export function setRemoteContent(value: Record<string, unknown> | null) {
  remote = value;
}

export function getRemoteContent() {
  return remote;
}
