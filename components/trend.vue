<script setup lang="ts">
const props = defineProps<{
  title: string;
  amount: number;
  lastAmount: number;
  color: string;
  loading: boolean;
}>();

const { amount } = toRefs(props); // to make amount reactive

const colorClasses = computed(() => {
  return {
    ...{
      "text-green-600 dark:text-green-600": trendingUp.value,
      ...{ "text-red-600 dark:text-red-600": !trendingUp.value },
    },
  };
});
const trendingUp = computed(() => props.amount >= props.lastAmount);

const icon = computed(() =>
  trendingUp.value
    ? "heroicons-arrow-trending-up-20-solid"
    : "heroicons-arrow-trending-down-20-solid"
);

const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) return "∞%";

  const lower = Math.min(props.amount, props.lastAmount);
  const bigger = Math.max(props.amount, props.lastAmount);

  const ratio = ((bigger - lower) / lower) * 100;

  const result = Math.ceil(ratio);

  return `${result}%`;
});
// const { currency } = useCurrency(props.amount);
const { counter } = useAutoCounter(amount.value, 5);
const { currency } = useCurrency(counter); // To make (amount) reactive
</script>

<template>
  <div class="font-bold rounded-md flex flex-col gap-1">
    <div :class="[colorClasses]">
      {{ title }}
    </div>

    <div>
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div class="text-xl" v-else>{{ currency }}</div>
    </div>
    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div class="flex space-x-1 items-center" v-else>
        <UIcon :name="icon" class="size-5" :class="[colorClasses]" />
        <div class="text-sm text-gray-500 dark:text-gray-400 font-normal">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
