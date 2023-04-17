import { createSSRApp, type Plugin } from "vue";
import App from "@/App.vue";
import Http from "@/request/http";
import uviewPlus from "uview-plus";
import { createPinia } from "pinia";
import "@/static/font/font.css";
const pinia = createPinia();
export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus as Plugin);
  app.use(pinia);
  app.provide("$http", Http);
  return {
    app,
  };
}
