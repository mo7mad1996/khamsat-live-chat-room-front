<script setup>
import { usePeerStore } from "@/stores/peerStore";
import { onMounted, ref } from "vue";
import { useSocket } from "@/composables/useSocket";

// assets
import notificationSound from "@/assets/sound/notification.wav";
const audio = new Audio(notificationSound);

// components
import SideBar from "@/components/Layout/SideBar/index.vue";
import { useRoute } from "vue-router";

// config
const { socket } = useSocket();
const peerStore = usePeerStore();
const route = useRoute();

// data
const unRead = ref([]);

// methods
const unReadUpdate = (msg, event) => {
  switch (event) {
    case "push":
      unRead.value.push(msg);
      audio.currentTime = 0;
      audio.play();
      break;

    case "update":
      unRead.value = unRead.value.filter((m) => {
        if (m.groupId) return m.groupId != msg;
        else return m.from != msg;
      });
      break;

    default:
      console.error("define the event method");
  }
};

// events
socket.on("private_message", (msg) => {
  if (!route.params.id) unReadUpdate(msg, "push");
});

socket.on("group_message", (msg) => {
  if (!route.params.id || route.params.id !== msg.groupId)
    unReadUpdate(msg, "push");
});

onMounted(() => peerStore.setPeer());
</script>

<template>
  <main>
    <nav>
      <SideBar :unRead="unRead" />
    </nav>
    <section>
      <RouterView @unRead="unReadUpdate" />
    </section>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  max-height: 100dvh;

  nav {
    flex: 1;
  }

  section {
    flex: 0;
    transition: 1s;
  }
  section:has(*) {
    flex: 4;
  }

  nav:has(~ section > *) {
    @media (max-width: 920px) {
      flex: 0;
      display: none;
    }
  }
}
</style>
