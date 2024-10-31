import { defineStore } from "pinia";
import axios from "~/api";
import cookie from "js-cookie";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: {},
    isAuthenticated: false,
  }),

  actions: {
    async checkAuth() {
      const token = cookie.get("token");
      this.isAuthenticated = !!token;

      if (token) {
        try {
          const res = await axios.get("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.user = res.data;
        } catch (error) {
          throw error;
        }
      }
    },
    async login(data, cb, final = () => {}) {
      try {
        const res = await axios.post("/api/login", data);

        // update State
        this.user = res.data.user;
        this.isAuthenticated = true;

        // save cookie
        cookie.set("token", res.data.token, {
          // sameSite: "None",
          // secure: true,
          // expires: new Date() + 1000 * 60 * 60 * 24 * 30,
        });

        // run callback
        cb();
      } catch (error) {
        throw error;
      } finally {
        final();
      }
    },
    logout() {
      this.user = {};
      this.isAuthenticated = false;
      cookie.remove("token");
    },
    async register(data, cb, final = () => {}) {
      try {
        await axios.post("/api/register", data);
        this.login(data, cb);
      } catch (error) {
        throw error;
      } finally {
        final();
      }
    },
  },
});
