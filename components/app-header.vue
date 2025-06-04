<template>
  <header class="flex justify-between spac-x-4">
    <NuxtLink to="/" class="text-2xl">Finance Traker</NuxtLink>
    <UDropdownMenu
      v-if="user"
      class="hover:cursor-pointer"
      arrow
      :items="items"
      :ui="{
        content: 'w-60',
      }"
    >
      <UAvatar :src="url ?? '/images/avatar.jpg'" size="xl" class="border" />
    </UDropdownMenu>
  </header>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
console.log(user.value);

const { url }: string | any = useAvatarUrl();

const items: DropdownMenuItem[] = [
  [
    {
      label: user.value?.email,
      icon: "i-lucide-user",
      disabled: true,
      onSelect: () => {
        console.log("test");
      },
    },
    {
      label: "Settings",
      icon: "i-lucide-cog",
      onSelect: () => {
        navigateTo("/settings/profile");
      },
    },
  ],
  [
    {
      label: "Sign-out",
      color: "error",
      icon: "heroicons-arrow-right-end-on-rectangle-20-solid",
      class: "text-red-500 hover:font-bold hover:cursor-pointer",
      onSelect: () => {
        signOut();
      },
    },
  ],
];

const signOut = async () => {
  await supabase.auth.signOut();
  return navigateTo("/login");
  // }
};
</script>

<style scoped></style>
