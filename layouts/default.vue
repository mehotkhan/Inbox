<script lang="ts" setup>
// const { welcomeMessage } = useSupport();

// onMounted(() => {
//   welcomeMessage();
// });
</script>
<template>
  <div class="flex-col flex">
    <slot name="app-before" />
    <div id="app-before"></div>
    <BaseHeader />
    <main class="flex min-h-screen mt-20">
      <div class="container">
        <div
          class="prose md:prose-xl dark:prose-invert leading-10 text-justify"
        >
          <slot />
        </div>
      </div>
      <slot name="app-after" />
      <div id="app-after"></div>
    </main>
  </div>
  <!-- <SupportStart /> -->
</template>
