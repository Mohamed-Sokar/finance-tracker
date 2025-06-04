<script setup>
import { transactionViewOptions } from "~/constants";
const user = useSupabaseUser();
const isOpen = ref(false);
const viewSelected = ref(
  user.value?.user_metadata?.transaction_view ?? transactionViewOptions.value[1]
);
const { current, previous } = useSelectedTimePeriod(viewSelected);

const {
  transactions: {
    grouped: { byDate },
    refresh,
  },
  pending,
  incomeCount,
  expenseCount,
  expenseTotal,
  incomeTotal,
} = useFetchTransactions(current);

const {
  expenseTotal: prevExpenseTotal,
  incomeTotal: prevIncomTotal,
  transactions: { refresh: refreshPrev },
} = useFetchTransactions(previous);

await Promise.all([refresh(), refreshPrev()]);
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
      :last-amount="prevIncomTotal"
      color="green"
      :loading="pending"
    />
    <Trend
      title="Expense"
      :amount="expenseTotal"
      :last-amount="prevExpenseTotal"
      color="red"
      :loading="pending"
    />
    <Trend
      title="Investments"
      :amount="0"
      :last-amount="0"
      color="green"
      :loading="pending"
    />
    <Trend
      title="Saving"
      :amount="0"
      :last-amount="0"
      color="red"
      :loading="pending"
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
        <UButton
          active
          color="neutral"
          variant="outline"
          active-color="primary"
          active-variant="solid"
          icon="heroicons-plus-circle-20-solid"
          @click="isOpen = !isOpen"
          label="Add"
        />
        <transaction-modal @saved="refresh()" v-model:modal-value="isOpen" />

        <UButton
          active
          color="neutral"
          variant="outline"
          active-color="primary"
          @click="refresh()"
          >Refresh</UButton
        >
      </div>
    </div>
  </section>

  <!-- Start refresh button -->

  <!-- Start Skeleton -->
  <div class="grid gap-3" v-if="pending">
    <USkeleton class="h-10 w-full" />
    <USkeleton class="h-10 w-full" />
    <USkeleton class="h-10 w-full" />
    <USkeleton class="h-10 w-full" />
  </div>
  <!-- End Skeleton -->

  <!-- Start Transaction section -->
  <section v-else>
    <div v-if="pending" class="flex justify-center items-center">
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
      v-for="[date, transactionsOnDay] in Object.entries(byDate)"
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
        @deleted="refresh()"
        @edited="refresh()"
      />
    </div>
  </section>
  <!-- End Transaction section -->
</template>

<style scoped></style>
