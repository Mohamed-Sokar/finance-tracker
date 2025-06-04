<template>
  <div class="w-full sticky top-0 z-1 backdrop-blur-md" id="mainHeader">
    <header
      class="container max-w-4xl mx-auto px-3 flex justify-between py-3 spac-x-4"
    >
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
        <template #account="{ item }">
          <div class="text-left w-full">
            <p class="text-muted">Signed in as</p>
            <div class="flex justify-between w-full">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ user.email }}
              </p>
              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
              />
            </div>
          </div>
        </template>
        <template #item-leading> </template>

        <!-- <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>

        <UIcon
          :name="item.icon"
          class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
        />
      </template> -->
      </UDropdownMenu>
    </header>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
// console.log(user.value);

const { url }: string | any = useAvatarUrl();

const items: DropdownMenuItem[] = [
  [
    {
      slot: "account",
      // label: user.value?.email,
      icon: "i-lucide-user",
      disabled: true,
    },
  ],
  [
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

const header = ref<HTMLElement | null>(null);
onMounted(() => {
  header.value = document.getElementById("mainHeader");
  window.addEventListener("scroll", () => {
    if (header.value) {
      if (window.scrollY > 0) {
        header.value.classList.add("shadow-lg");
      } else {
        header.value.classList.remove("shadow-lg");
      }
    }
  });
});
</script>

<style scoped></style>
