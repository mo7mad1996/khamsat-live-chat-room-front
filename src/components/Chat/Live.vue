<script setup>
import { useSocket } from "@/composables/useSocket";
import { usePeerStore } from "@/stores/peerStore";
import { computed, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { useContentStore } from "~/stores/contentStore";

// config
const props = defineProps(["me", "to", "groupId"]);
const contentStore = useContentStore();
const peerStore = usePeerStore();
const { socket } = useSocket();
const calls = ref([]);

// data
const isRecord = ref(false);
const isSupported = computed(() => {
  const is_valid =
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    peerStore.peerId;

  return is_valid;
});
let mediaStream, currentCall;

// methods
const toggleRecord = () => (isRecord.value = !isRecord.value);

const startRecord = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      if (props.groupId) {
        const { peers } = peerStore;
        Object.values(peers).forEach((peer) => {
          const conn = peerStore.peer.connect(peer);
          const call = peerStore.peer.call(peer, stream);

          conn.on("open", function () {
            conn.send({ group: props.groupId, peer: peerStore.peerId });
          });
          calls.value.push(call);
        });
      } else {
        const to = peerStore.peers[props.to];
        if (to) {
          currentCall = peerStore.peer.call(to, stream);
        }
      }
      mediaStream = stream;
      isRecord.value = true;
    })
    .catch((err) => {
      isRecord.value = false;
      toast.error(contentStore.content.voiceError);
      console.error(err);
    });
};

const endRecord = () => {
  isRecord.value = false;
  if (calls.value.length) {
    calls.value.forEach((call) => call.close());
    calls.value = [];
  }
  if (currentCall) {
    currentCall.close();
    currentCall = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  socket.emit("stop-live", props.to);
};

watch(isRecord, (v) => {
  if (v) startRecord();
  else endRecord();
});
watch(
  () => props.to,
  () => endRecord()
);
</script>

<template>
  <button
    type="button"
    @click="toggleRecord"
    :class="{ isRecord }"
    v-if="isSupported"
  >
    <font-awesome-icon :icon="['fas', 'phone-volume']" v-if="isRecord" />
    <font-awesome-icon :icon="['fas', 'phone-slash']" v-else />
  </button>
</template>
  


<style scoped lang="scss">
.icon {
  width: 1em;
}

.isRecord {
  //   outline: 10px red solid;
  animation: hover 0.5s infinite alternate;

  .icon {
    display: inline-block;
    color: red;
  }
}

@keyframes hover {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>