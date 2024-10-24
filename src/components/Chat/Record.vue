<script setup>
import { useContentStore } from "@/stores/contentStore";
import { ref, watch, defineEmits } from "vue";
import { toast } from "vue3-toastify";

const contentStore = useContentStore();
const emit = defineEmits(["getVoice"]);

// data
var chunks = [];
const isRecord = ref(false);
const recorder = ref(null);
const isSupported =
  navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

// methods
const toggleRecord = () => (isRecord.value = !isRecord.value);
const setRecorder = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const r = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      r.onstart = () => (isRecord.value = true);
      r.ondataavailable = (e) => chunks.push(e.data); // get the voice chunks

      r.onstop = (e) => {
        emit("getVoice", chunks);

        stream.getTracks().forEach((track) => track.stop());
        chunks = [];
        isRecord.value = false;
        recorder.value = null;
      };

      recorder.value = r;
      recorder.value.start();
    })
    .catch((err) => {
      toast.error(contentStore.content.voiceError);
      isRecord.value = false;
      console.error(err);
    });
};

// recorder watch value
watch(isRecord, (d) => {
  if (!recorder.value) setRecorder();
  else {
    if (d) {
      recorder.value.start();
    } else {
      recorder.value.stop();
    }
  }
});
</script>

<template>
  <button
    type="button"
    @click="toggleRecord"
    :class="{ isRecord }"
    v-if="isSupported"
  >
    <font-awesome-icon
      class="icon"
      :icon="['fas', 'microphone-lines']"
      v-if="isRecord"
    />
    <font-awesome-icon
      class="icon"
      :icon="['fas', 'microphone-lines-slash']"
      v-else
    />
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