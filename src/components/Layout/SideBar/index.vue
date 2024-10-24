<script setup>
import { computed, ref, watch } from "vue";
import { useContentStore } from "@/stores/contentStore";
import { useSocket } from "@/composables/useSocket";
import { usePeerStore } from "@/stores/peerStore";
import { useAuthStore } from "@/stores/authStore";

// components
import UnRead from "~/components/Chat/UnRead.vue";
import Online from "~/components/Layout/SideBar/Online.vue";
import Groups from "~/components/Layout/SideBar/Groups.vue";
import Setting from "~/components/Layout/SideBar/Setting.vue";

// config || stores
const { socket } = useSocket();
const contentStore = useContentStore();
const props = defineProps(["unRead"]);
const peerStore = usePeerStore();
const authStore = useAuthStore();

// data
const tabs = [
  {
    title: "online_users",
    icon: ["fas", "street-view"],
    component: Online,
  },
  {
    title: "groups",
    icon: ["fas", "people-group"],
    component: Groups,
  },
  {
    title: "settings",
    icon: ["fas", "gears"],
    component: Setting,
  },
];
const active_tab = ref("online_users");
const unReadDataBase = ref([]);
const unReadMessages = computed(() => [
  ...unReadDataBase.value,
  ...props.unRead,
]);
const onlineUsers = ref({});

const activeComponent = computed(
  () => tabs.find((e) => e.title == active_tab.value).component
);

// socket events
socket.on("online-users", (d) => {
  onlineUsers.value = d;
  peerStore.setPeers(d);
});

// watch values
watch(
  () => peerStore.peerId,
  () =>
    socket.emit("user-connected", {
      ...authStore.user,
      peerId: peerStore.peerId,
    })
);
watch(
  () => authStore.user,
  () =>
    socket.emit("user-connected", {
      ...authStore.user,
      peerId: peerStore.peerId,
    })
);
</script>

<template>
  <div class="online">
    <UnRead
      :unReadMessages="unReadMessages"
      :title="contentStore.content.unRead"
    />

    <nav class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.title"
        class="tab"
        :class="{ active: active_tab === tab.title }"
        @click="active_tab = tab.title"
      >
        <font-awesome-icon :icon="tab.icon" class="icon" />
        <span>{{ contentStore.content[tab.title] }}</span>
      </div>
    </nav>

    <!-- Render dynamic component here -->
    <component
      :is="activeComponent"
      :key="active_tab"
      :onlineUsers="onlineUsers"
    ></component>
  </div>
</template>


 
 
<style lang="scss" scoped>
.online {
  max-height: 100dvh;
  overflow: auto;

  .tabs {
    display: flex;
    background: white;
    // border-radius: 1em 1em 0 0;

    .tab {
      padding: 10px 1em;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.4em;
      cursor: pointer;
      border-radius: 1em 1em 0 0;
      flex: 1;

      .icon {
        font-size: 25px;
      }

      span {
        font-size: 14px;
      }
      &.active {
        background: #e6e3e3;
        color: var(--primary-color);
      }
    }
  }
}
</style>