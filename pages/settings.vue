<template>
  <div class="grid grid-cols-6 gap-8">
    <UNavigationMenu orientation="vertical" :items="links" class="col-span-2" />
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    label: "Profile",
    icon: "i-lucide-user",
    to: "/settings/profile",
  },
  {
    label: "Avatar",
    icon: "i-lucide-image",
    to: "/settings/avatar",
  },
  {
    label: "settings",
    icon: "i-lucide-cog",
    to: "/settings/settings",
  },
];
</script>

<style scoped></style>
