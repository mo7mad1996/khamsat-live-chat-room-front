<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";
import { useSocket } from "@/composables/useSocket";
import axios from "@/api";

// components
import Messages from "@/components/Chat/Messages.vue";
import Form from "@/components/Chat/Form.vue";

// setup
const { socket } = useSocket();
const authStore = useAuthStore();
const route = useRoute();
const emit = defineEmits(["unRead"]);

// data
const me = computed(() => authStore.user.id);
const to = computed(() => route.params.id);
const messages = ref([]);
const messages_for_user = computed(() =>
  messages.value.filter(
    (msg) =>
      (msg.from === me.value && msg.to === to.value) ||
      (msg.from === to.value && msg.to === me.value)
  )
);

// methods
const updateMessages = (msg) => {
  if (msg.from != msg.to) messages.value.push(msg);
}; // Add the new message to the list

// on INIT
onMounted(() => {
  axios.get("/api/messages").then((res) => (messages.value = res.data));
  emit("unRead", to.value, "update");
});

// watch
watch(to, (v) => emit("unRead", v, "update"));

// socket events
socket.on("private_message", (msg) => {
  if (msg.from != route.params.id && authStore.user.id != msg.from) {
    emit("unRead", msg, "push");
  }
  messages.value.push(msg);
});
</script>

<template>
  <main class="main">
    <div class="messages">
      <Messages :me="me" :to="to" :messages="messages_for_user" />
    </div>

    <Form :me="me" :to="to" @sendMessage="updateMessages" />
  </main>
</template>


<style lang="scss" scoped>
.main {
  height: 100dvh;
  overflow: auto;
  flex-direction: column;

  .messages {
    flex: 1;
    align-items: flex-end;
    display: flex;
    // background: var(--chat-color);
  }
}
</style>