<script setup>
import { defineProps } from "vue";
import { useContentStore } from "@/stores/contentStore";
import { useAuthStore } from "@/stores/authStore";

// assets
import imgPlaceholder from "~/assets/images/user.jpg";

// config || stores
const props = defineProps(["onlineUsers"]);
const contentStore = useContentStore();
const authStore = useAuthStore();
</script>

<template>
  <ul>
    <router-link
      class="link"
      active-class="active"
      v-for="(user, socketId) in onlineUsers"
      :key="socketId"
      :to="{ name: 'chat', params: { id: user.id } }"
    >
      <img :src="imgPlaceholder" :alt="user.name" />
      <li>
        <h3>
          {{ user.name }}
          {{ user.id == authStore.user.id ? contentStore.content.you : "" }}
        </h3>
        <span>{{ user.email }}</span>
      </li>
    </router-link>
  </ul>
</template>


<style lang="scss" scoped>
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
</style>

