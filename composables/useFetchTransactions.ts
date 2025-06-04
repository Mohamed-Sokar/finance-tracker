interface Period {
  value: {
    from: Date;
    to: Date;
  };
}

export const useFetchTransactions = (period: Period) => {
  const supabase = useSupabaseClient();
  const transactions = ref();
  const pending = ref(false);

  // Methods
  const transactionsGroupedByDate = computed(() => {
    const grouped: any = {};
    for (const transaction of transactions.value) {
      // const date = new Date(transaction.created_at).toISOString().split("T")[0]; // this will cause an issue
      const date = transaction.created_at.split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    }
    // To sort the grouped in client side

    // const sortedKeys = Object.keys(grouped).sort().reverse();
    // let sortedGrouped: any = {};
    // for (const key of sortedKeys) {
    //   sortedGrouped[key] = grouped[key];
    // }
    // return sortedGrouped;

    return grouped;
  });
  // const key = computed(
  //   () =>
  //     `transactions-${period.value.from?.toISOString()}-${period.value.to?.toISOString()}`
  // );
  const fetchTransactions = async () => {
    // console.log("fetchTransactions");
    try {
      pending.value = true;

      // Ensure period.value.from and to are not null/undefined
      if (!period.value?.from || !period.value?.to) {
        console.warn("Invalid period:", period.value);
        return [];
      }
      // const { data: transactionsData, error: transactionsError } =
      //   await useAsyncData(key.value, async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select()
        .gte("created_at", period.value.from.toISOString()) // to handle the case when from is undefined
        .lte("created_at", period.value.to.toISOString())
        .order("created_at", { ascending: false }); // to sort the transactions in the server side
      if (error) return [];
      return data;
      // });
      //   }
      // );
      // return transactionsData.value;
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    transactions.value = await fetchTransactions();
  };
  watch(period, async () => await refresh());

  // computed properties
  const income = computed(() => {
    return transactions.value.filter((t: any) => t.type === "Income") ?? [];
  });
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

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      refresh,
      // fetchTransactions,
    },
    pending,
    // income,
    // expense,
    incomeCount,
    expenseCount,
    expenseTotal,
    incomeTotal,
  };
};
