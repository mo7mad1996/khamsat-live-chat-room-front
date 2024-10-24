import { defineStore } from "pinia";
import cookie from "js-cookie";
import data from "~/data/langs.json";

export const useContentStore = defineStore("contentStore", {
  state: () => ({
    lang: cookie.get("lang") || "ar",
  }),
  getters: {
    languages: () => {
      return Object.keys(data).map((el) => ({
        key: el,
        value: data[el].langName,
      }));
    },
    content: (state) => {
      return data[state.lang];
    },
  },
  actions: {
    setLang(l) {
      this.updateCookie(l);
      this.lang = l;
    },
    updateCookie(l) {
      cookie.set("lang", l, {
        sameSite: "None",
        secure: true,
      });
    },
  },
});
