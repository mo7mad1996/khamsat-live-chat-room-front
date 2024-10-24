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
const groupId = computed(() => route.params.id);
const messages = ref([]);
const groupMessages = computed(() =>
  messages.value.filter((msg) => msg.groupId === groupId.value)
);

// methods
const updateMessages = (msg) => {
  messages.value.push(msg);
};
const getMessages = () => {
  axios
    .get(`/api/groups/messages/${groupId.value}`)
    .then((res) => (messages.value = res.data));
  emit("unRead", groupId.value, "update");
};

// on INIT
onMounted(getMessages);

// watch
watch(groupId, (v) => emit("unRead", v, "update"));
watch(groupId, () => getMessages());
watch(groupId, (c, p) => {
  socket.emit("leave-group", p);
  socket.emit("join-group", c);
});

// socket events
socket.on("group_message", (msg) => {
  if (msg.groupId == groupId.value) messages.value.push(msg);
});
</script>

<template>
  <main class="main">
    <div class="messages">
      <Messages
        :me="me"
        :groupId="groupId"
        :to="to"
        :isGroup="true"
        :messages="groupMessages"
      />
    </div>

    <Form
      :me="me"
      :to="to"
      :groupId="groupId"
      :isGroup="true"
      @sendMessage="updateMessages"
    />
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