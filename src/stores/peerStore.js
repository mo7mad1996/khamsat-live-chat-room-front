import { defineStore } from "pinia";
import { Peer } from "peerjs";

export const usePeerStore = defineStore("peerStore", {
  state() {
    return {
      peer: null,
      peerId: null,
      peers: {},
    };
  },

  actions: {
    setPeer() {
      this.peer = new Peer();
      this.peer.on("open", (id) => (this.peerId = id));
    },
    setPeers(d) {
      this.peers = {};
      for (const key in d) {
        this.peers[d[key].id] = d[key].peerId;
      }
    },
  },
});
