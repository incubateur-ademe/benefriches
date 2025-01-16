declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _paq?: any[];
  }
}
export const trackPageView = (url: string) => {
  if (!window._paq) return;
  window._paq.push(["setCustomUrl", url]);
  window._paq.push(["trackPageView"]);
};
