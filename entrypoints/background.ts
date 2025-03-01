import { browser } from "wxt/browser";

export default defineBackground(() => {
  // @ts-ignore
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: any) => console.error(error));
});
