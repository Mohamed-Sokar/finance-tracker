<script setup lang="ts">
import { transactionViewOptions } from "~/constants";

const supabase = useSupabaseClient();
const viewSelected = ref(transactionViewOptions.value[0]);
const transactions = ref();
const isLoading = ref(false);

// Methods
const transactionsGroupedByDate = computed(() => {
  const grouped: any = {};
  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  }

  return grouped;
});
const fetchTransactions = async () => {
  console.log("fetchTransactions");
  try {
    isLoading.value = true;
    // const { data } = await useAsyncData("transactions", async () => {
    const { data, error } = await supabase.from("transactions").select();
    if (error) return [];
    return data;
    // });
    // return data.value;
  } finally {
    isLoading.value = false;
  }
};
const refreshTransactions = async () => {
  transactions.value = await fetchTransactions();
};
// you should to but it before you wanna use (transactions.value)
await refreshTransactions();

// computed properties
const income = computed(
  () => transactions.value.filter((t: any) => t.type === "Income") ?? []
);
const expense = computed(
  () => transactions.value.filter((t: any) => t.type === "Expense") ?? []
);

const incomeTotal = computed(() =>
  // use reduce to sum the income transactions
  income.value.reduce(
    (sum: any, transaction: any) => (sum += transaction.amount),
    0
  )
);
const expenseTotal = computed(() =>
  expense.value.reduce(
    (sum: any, transaction: any) => (sum += transaction.amount),
    0
  )
);
const incomeCount = computed(() => {
  return income.value.length;
});
const expenseCount = computed(() => {
  return expense.value.length;
});
</script>
<template>
  <!-- Start Summary section -->
  <section class="flex justify-between items-center mb-10">
    <h1 class="">Summary</h1>
    <USelectMenu
      v-model="viewSelected"
      :items="transactionViewOptions"
      class="w-48"
    />
  </section>
  <!-- End Summary section -->

  <!-- Start Trend section -->
  <section
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 mb-10"
  >
    <Trend
      title="Income"
      :amount="incomeTotal"
      :last-amount="3000"
      color="green"
      :loading="isLoading"
    />
    <Trend
      title="Expense"
      :amount="expenseTotal"
      :last-amount="4500"
      color="red"
      :loading="isLoading"
    />
    <Trend
      title="Investments"
      :amount="0"
      :last-amount="0"
      color="green"
      :loading="isLoading"
    />
    <Trend
      title="Saving"
      :amount="0"
      :last-amount="0"
      color="red"
      :loading="isLoading"
    />
  </section>
  <!-- End Trend section -->

  <section>
    <div class="flex justify-between items-center">
      <div class="">
        <div class="font-bold text-2xl mb-2">Transactions</div>
        <div class="text-sm text-gray-500">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expense this
          period
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <transaction-modal @added="refreshTransactions()" />

        <UButton
          active
          color="neutral"
          variant="outline"
          active-color="primary"
          @click="refreshTransactions()"
          >Refresh</UButton
        >
      </div>
    </div>
  </section>

  <!-- Start refresh button -->

  <!-- Start Skeleton -->
  <div class="grid gap-3" v-if="isLoading">
    <USkeleton class="h-10 w-full" />
    <USkeleton class="h-10 w-full" />
    <USkeleton class="h-10 w-full" />
    <USkeleton class="h-10 w-full" />
  </div>
  <!-- End Skeleton -->

  <!-- Start Transaction section -->
  <section v-else>
    <div v-if="isLoading" class="flex justify-center items-center">
      <UButton
        loading
        :active="false"
        color="neutral"
        variant="ghost"
        active-color="primary"
      ></UButton>
    </div>
    <div
      v-else
      class="mb-10"
      v-for="[date, transactionsOnDay] in Object.entries(
        transactionsGroupedByDate
      )"
    >
      <TransactionDaily
        :date="date"
        :transactionsOnDay="transactionsOnDay"
        :key="date"
      />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :transaction="transaction"
        :key="transaction.id"
        @deleted="refreshTransactions()"
      />
    </div>
  </section>
  <!-- End Transaction section -->
</template>

<style scoped></style>
