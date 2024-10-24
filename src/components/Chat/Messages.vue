<script setup>
import { useSocket } from "@/composables/useSocket";
import { usePeerStore } from "@/stores/peerStore";
import { defineProps, ref, watch, reactive } from "vue";
import { Buffer } from "buffer";

// config
const props = defineProps(["me", "to", "messages", "isGroup"]);
const peerStore = usePeerStore();
const { socket } = useSocket();

// data
const scroll = ref(null); // HTML ref
const onLive = reactive({});
const URL = window.URL;
const onLiveGroups = ref([]);

// methods
const scrollToBottom = () => {
  setTimeout(() => {
    if (scroll.value) {
      scroll.value.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 0);
};

const createAnURL = (chunks) => {
  let audioBlob = null;

  if (chunks[0].type === "Buffer") {
    // come from database as array of JSON buffers
    const buffers = chunks.map((chunk) => Buffer.from(chunk.data));
    audioBlob = new Blob(buffers, { type: "audio/webm; codecs=opus" });
  } else if (typeof chunks[0] == "string") {
    // come from database as array of string
    const bufferData = Buffer.from(chunks[0], "base64");
    audioBlob = new Blob([bufferData], { type: "audio/webm; codecs=opus" });
  } else {
    // come from socket as array of buffers
    audioBlob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
  }

  const audioUrl = URL.createObjectURL(audioBlob);

  return audioUrl;
};

const setupPeerEvents = () => {
  if (peerStore.peer) {
    peerStore.peer.on("call", (call) => {
      call.answer();

      call.on("stream", (stream) => {
        const audio = new Audio();
        audio.srcObject = stream;
        onLive[call.peer] = audio;
        if (call.peer === props.to) {
          audio.play();
        }
      });

      call.on("close", () => {
        closeTheCall(call.peer);
      });

      call.on("error", (err) => {
        closeTheCall(call.peer);
      });
    });

    peerStore.peer.on("connection", function (conn) {
      conn.on("data", function (data) {
        onLiveGroups.value.push(data);
      });
    });
  }
};

const closeTheCall = (peerId) => {
  if (onLive[peerId]) {
    onLive[peerId].pause();
    delete onLive[peerId];
  }
  onLiveGroups.value = onLiveGroups.value.filter((e) => e.peer != peerId);
};

const playAudio = (peerId) => {
  if (onLive[peerId]) {
    onLive[peerId].play();
  }
};

const pauseAudio = (peerId) => {
  if (onLive[peerId]) {
    onLive[peerId].pause();
  }
};

// watch data
watch(() => props.to, scrollToBottom);
watch(() => props.messages, scrollToBottom);
watch(
  () => props.to,
  (newTo, oldTo) => {
    if (oldTo) {
      pauseAudio(peerStore.peers[oldTo]);
    }
    if (newTo && onLive[newTo]) {
      playAudio(peerStore.peers[newTo]);
    }
  }
);
watch(() => peerStore.peer, setupPeerEvents, { immediate: true });

// socket events
socket.on("stop-live", (peerId) => {
  if (onLive[peerId]) {
    onLive[peerId].pause();
    onLive[peerId].srcObject = null;
    delete onLive[peerId];
  }
});
</script>

<template>
  <div class="massages_container">
    <div class="live" v-if="isGroup">
      <div
        v-for="(audio, n) in onLiveGroups
          .filter((e) => to == e.group)
          .map((e) => onLive[e.peer])"
        :key="n"
      >
        <div class="controller">
          <font-awesome-icon :icon="['fas', 'volume-high']" />
          {{ audio.play() && "" }}
          <input
            type="range"
            v-model="audio.volume"
            max="1"
            min="0"
            step=".001"
          />
        </div>
      </div>
    </div>
    <div class="live" v-else>
      <div v-for="(audio, n) in onLive" :key="n">
        <div
          class="controller"
          v-if="
            peerStore.peers[to] == n && onLiveGroups.some((o) => o.peer !== n)
          "
        >
          <font-awesome-icon :icon="['fas', 'volume-high']" />
          {{ audio.play() && "" }}
          <input
            type="range"
            v-model="audio.volume"
            max="1"
            min="0"
            step=".001"
          />
        </div>
      </div>
    </div>
    <ul>
      <li
        v-for="(msg, n) in messages"
        :key="n"
        :class="{
          'my-message': msg.from == me,
        }"
      >
        <audio v-if="msg.isAudio" :src="createAnURL(msg.chunks)" controls />
        <span v-else>{{ msg.text }}</span>
      </li>
      <li class="scroll" ref="scroll"></li>
    </ul>
  </div>
</template>


<style lang="scss" scoped>
.massages_container {
  width: 100%;
  background: rgb(255, 255, 255);
  height: calc(100dvh - 70px);
  overflow: auto;

  ul {
    padding: 0;
    margin: 0;

    li {
      list-style: none;
      display: flex;
      flex-direction: column;
      padding: 10px 30px;
      align-items: flex-start;

      span {
        border-radius: 10px;
        padding: 0.3em 1em;
        background: var(--primary-color);
        color: var(--chat-color);
      }
    }
  }

  .my-message {
    align-items: flex-end;

    span {
      background: rgb(207, 207, 207);
      color: var(--main-text-color);
    }
  }
}

.scroll {
  padding: 0 !important;
}

.live {
  position: sticky;
  top: 0;
  padding: 10px;
  z-index: 15;

  .controller {
    margin-bottom: 5px 0;
    color: var(--main-text-color);
    background: white;
    padding: 5px 1em;
    border-radius: 1em;
    max-width: 300px;
    display: flex;
    align-items: center;
    gap: 1em;
    animation: popup 0.3s;
    margin: auto;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;

    input {
      width: 100%;
    }
  }
}
@keyframes popup {
  from {
    transform: scale(0) translateY(100px);
  }
}
</style>
