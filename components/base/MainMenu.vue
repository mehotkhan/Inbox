<script lang="ts" setup>
const { menuItems } = useMainMenu();
const route = useRoute();
</script>

<template>
  <ul class="list-none flex mt-8">
    <li v-for="menu in menuItems" :key="menu._path">
      <NuxtLink
        :external="false"
        :to="menu._path"
        class="hover:text-black py-1 px-5 dark:hover:text-gray-200"
        :class="route.path == menu._path ? 'router-link-active' : ''"
        >{{ menu.title }}</NuxtLink
      >
    </li>
  </ul>
</template>
<style lang="scss" scoped>
a {
  text-wrap: nowrap;
}
.router-link-active {
  background: #454545e1;
  color: white;
  border-radius: 3px;
  // text-decoration: underline;
}
</style>
