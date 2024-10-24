
<script setup>
const props = defineProps(["title", "unReadMessages"]);
</script>


<template>
  <div class="unread" v-if="unReadMessages.length">
    <h3>
      {{ title }}
    </h3>
    <ul>
      <router-link
        v-for="(msg, id) in unReadMessages"
        active-class="active"
        :to="{
          name: msg.groupId ? 'groupChat' : 'chat',
          params: { id: msg.groupId || msg.from },
        }"
        :key="id"
      >
        <font-awesome-icon :icon="['fas', 'envelope']" class="icon" />
        <li>
          {{ msg.text }}
        </li>
      </router-link>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.unread {
  border-radius: 10px;
  overflow: hidden;
  margin: 1em;

  h3 {
    padding: 0.4em 1em;
    margin: 0;
    background: rgb(22, 22, 22);
    color: white;
  }

  ul {
    margin: 0;
    background: #fff5;
    padding: 0;
  }

  a {
    display: flex;
    list-style: none;
    padding: 0.5em 1em;
    gap: 1em;

    &:hover {
      background: #fff5;
    }

    .icon {
      color: var(--link-color);
      font-size: 30px;
    }
  }
}
</style>