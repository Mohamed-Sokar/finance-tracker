<template>
  <div class="container max-w-4xl mx-auto px-3">
    <AppHeader class="mt-10" />
    <main class="my-10">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Finance Tracker App",
});
const colorMode = useColorMode();
const user = useSupabaseUser();

colorMode.preference = user.value?.user_metadata?.color_mode;
</script>

<style>
body {
  font-family: "Inter";
  /*@apply dark:bg-gray-900 bg-white;*/
}
</style>
