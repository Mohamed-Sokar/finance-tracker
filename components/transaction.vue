<script setup>
// import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(["deleted"]);

const isloading = ref(false);
const { currency } = useCurrency(props.transaction.amount);
const supabase = useSupabaseClient();
const toast = useToast();

const editHandler = () => {
  console.log("edit");
};

const deleteHandler = async () => {
  isloading.value = true;
  try {
    const { data, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", props.transaction.id);

    toast.add({
      title: "transaction deleted successfully",
      icon: "heroicons-check-circle-20-solid",
    });
    emit("deleted", props.transaction.id);
  } catch (error) {
    toast.add({
      title: "transaction deleted failed",
      description: "There was a problem with your request.",
      icon: "i-lucide-info",
      color: "error",
    });
  } finally {
    isloading.value = false;
  }
};
const items = ref([
  {
    label: "edit",
    icon: "heroicons-pencil-square-20-solid",
    onSelect() {
      editHandler();
    },
  },
  {
    label: "trash",
    icon: "heroicons-trash",
    onSelect() {
      deleteHandler();
    },
  },
]);

const isIncome = computed(() => {
  return props.transaction.type === "Income";
});

const icon = computed(() =>
  isIncome.value
    ? "heroicons-arrow-up-right-solid"
    : "heroicons-arrow-down-right-solid"
);

const iconColor = computed(() =>
  isIncome.value ? "text-green-400" : "text-red-400"
);
</script>

<template>
  <div
    class="grid grid-cols-2 gap-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex justify-between">
      <div class="flex space-x-1 items-center font-semibold">
        <UIcon :class="[iconColor]" :name="icon" size="w-4 h-4" />
        <!-- <UIcon name="heroicons-arrow-down-right-solid" size="w-4 h-4" /> -->
        <div>{{ props.transaction.description }}</div>
      </div>
      <div>
        <UBadge v-if="props.transaction.category">{{
          props.transaction.category
        }}</UBadge>
      </div>
    </div>
    <div class="flex justify-end space-x-2 items-center font-semibold">
      <div>{{ currency }}</div>
      <div>
        <UButton
          :loading="isloading"
          :active="false"
          color="neutral"
          variant="ghost"
          active-color="primary"
        ></UButton>
        <UDropdownMenu
          :items="items"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
          }"
          :ui="{
            content: 'w-48',
          }"
        >
          <UButton
            v-if="!isloading"
            icon="heroicons-ellipsis-horizontal-20-solid"
            color="neutral"
            variant="soft"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
