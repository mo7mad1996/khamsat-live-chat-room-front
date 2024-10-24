<script setup>
import { useContentStore } from "@/stores/contentStore";
import { useSocket } from "@/composables/useSocket";
import axios from "@/api";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

// assets
import placeholder from "@/assets/images/group.jpg";

// config
const contentStore = useContentStore();
const { socket } = useSocket();

// data
const chats = ref([]);
const loading = ref(false);

// methods
const create = async () => {
  const name = prompt(contentStore.content.newGroupChatQuestion);
  if (name) socket.emit("create-group", { name });
};
const getGroups = async () => {
  try {
    loading.value = true;
    const response = await axios.get("/api/groups");
    chats.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// socket emits
socket.on("create-group", (chat) => chats.value.push(chat));

onMounted(() => getGroups());
</script>

<template>
  <div class="tab_page">
    <button @click="create">
      <span>
        {{ contentStore.content.new }}
        <font-awesome-icon :icon="['fas', 'sheet-plastic']" />
      </span>
    </button>

    <div v-if="loading">{{ contentStore.content.loading }}</div>
    <div v-else>
      <div v-if="chats.length === 0">
        {{ contentStore.content.noGroups }}
      </div>
      <div>
        <ul>
          <RouterLink
            class="link"
            :to="{ name: 'groupChat', params: { id: chat._id } }"
            active-class="active"
            v-for="chat in chats"
            :key="chat._id"
          >
            <img :src="placeholder" alt="group" />
            <li>
              {{ chat.name }}
            </li>
          </RouterLink>
        </ul>
      </div>
    </div>
  </div>
</template>



<style scoped lang="scss">
.tab_page {
  padding: 1em;
  button {
    display: block;
    width: 100%;
    margin: 1em 0;
  }

  ul {
    padding: 0;

    .link {
      display: flex;
      align-items: center;
      gap: 1em;
      text-decoration: none;
      color: inherit;
      position: relative;
      border-bottom: 1px solid #666;

      img {
        height: 70px;
        width: 70px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        display: block;
        object-fit: cover;
      }

      li {
        display: block;
        list-style: none;

        h3 {
          margin: 0 10px 0 0;
        }

        span {
          opacity: 0.8;
        }
      }

      &::before {
        content: "";
        display: block;
        height: 100px;
        width: 5px;
      }

      &.active {
        border-bottom: none;
        background: var(--secondary-color);

        &::before {
          transition: 0.5s;
          background: var(--link-color);
        }
      }

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
