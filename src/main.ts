import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { vReveal } from "./directives/reveal";
import "./styles/global.scss";

createApp(App).use(router).directive("reveal", vReveal).mount("#app");
