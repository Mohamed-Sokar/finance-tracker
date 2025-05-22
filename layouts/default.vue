<template>
  <div class="container max-w-4xl mx-auto px-3">
    <AppHeader class="mt-10" />
    <main class="my-10">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({});
const colorMode = useColorMode();
colorMode.preference = "system";
</script>

<style>
body {
  font-family: "Inter";
  /*@apply dark:bg-gray-900 bg-white;*/
}
</style>
