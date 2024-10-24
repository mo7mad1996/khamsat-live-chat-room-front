<script setup>
import { useSocket } from "@/composables/useSocket";
import { onMounted, ref, defineProps, defineEmits, watch } from "vue";

// components
import Live from "@/components/Chat/Live.vue";
import Record from "@/components/Chat/Record.vue";
import { useContentStore } from "@/stores/contentStore";

// config
const { socket } = useSocket();
const props = defineProps(["me", "to", "isGroup", "groupId"]);
const contentStore = useContentStore();
const emit = defineEmits(["sendMessage"]);

// data
const text = ref("");
const input = ref(null); // HTML ref

// component life cycle hook
onMounted(() => focusInput());

// methods
const focusInput = () => input.value.focus();
const sendAMessage = () => {
  if (text.value.trim()) {
    // create message object
    const message = {
      from: props.me,
      to: props.to,
      text: text.value,
      groupId: props.groupId,
    };

    if (props.groupId) {
      socket.emit("send-group-message", message);
    } else {
      socket.emit("send-message", message);
      emit("sendMessage", message);
    }
  }
  text.value = "";
};

const sendVoice = (chunks) => {
  const data = {
    from: props.me,
    to: props.to,
    chunks,
    isAudio: true,
    groupId: props.groupId,
    isGroup: props.isGroup,
  };
  if (props.groupId) {
    socket.emit("audio-chunk-group", data);
  } else {
    socket.emit("audio-chunk", data);
    emit("sendMessage", data);
  }
};

// watch data
watch(() => props.to, focusInput);
</script>

<template>
  <form @submit.prevent="sendAMessage">
    <Live :to="to" :me="me" :groupId="groupId" />
    <Record @getVoice="sendVoice" />
    <div class="input">
      <label for="input">{{ contentStore.content.msgLabel }}</label>
      <input ref="input" v-model="text" required />
    </div>

    <button type="submit">
      <font-awesome-icon :icon="['fas', 'paper-plane']" />
    </button>
  </form>
</template>


<style lang="scss" scoped>
form {
  background: #ffffffaa;
  display: flex;
  position: sticky;
  bottom: 0;
  padding: 10px;
  gap: 10px;

  .input {
    flex: 1;
  }
}
</style>