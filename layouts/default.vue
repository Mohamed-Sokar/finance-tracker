<template>
  <div>
    <AppHeader />
    <div class="container max-w-4xl mx-auto px-3">
      <main class="my-10">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Finance Tracker App",
});
const colorMode = useColorMode();
const user = useSupabaseUser();

watch(
  user,
  () => (colorMode.preference = user.value?.user_metadata?.color_mode),
  { immediate: true }
);
</script>

<style>
body {
  font-family: "Inter";
  /*@apply dark:bg-gray-900 bg-white;*/
}
</style>
