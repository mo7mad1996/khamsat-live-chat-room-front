import "./assets/css/main.css";
import "vue3-toastify/dist/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import * as all from "@fortawesome/free-solid-svg-icons";
const icons = Object.values(all).filter((e) => typeof e == "object");

/* add icons to the library */
library.add(...icons);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 3000,
});

app.mount("#app");
