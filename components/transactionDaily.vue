<script setup>
const props = defineProps(["transactionsOnDay", "date"]);
// console.log(props.date, props.transactionsOnDay);

let amountSum = computed(() => {
  let sum = 0;
  for (const transaction of props.transactionsOnDay) {
    sum += transaction.amount;
  }
  return sum;
});

const { currency } = useCurrency(amountSum);
</script>

<template>
  <div
    class="grid grid-cols-2 gap-2 py-4 border-b-2 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
  >
    <div class="text-gray-400 font-bold text-sm">{{ props.date }}</div>
    <div class="flex justify-end text-gray-400 font-bold text-sm">
      {{ currency }}
    </div>
  </div>
</template>

<style scoped></style>
