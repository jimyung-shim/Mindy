export function toWsUrl(httpUrl: string): string {
  // http:// -> ws://, https:// -> wss://
  return httpUrl.replace(/^http/, 'ws').replace(/\/+$/, '');
}

export function withPath(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
