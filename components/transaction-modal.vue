<template>
  <UModal title="Add Transaction" size="lg">
    <UButton
      active
      color="neutral"
      variant="outline"
      active-color="primary"
      active-variant="solid"
      icon="heroicons-plus-circle-20-solid"
      label="Add"
    />
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        ref="form"
      >
        <UFormField label="Transaction Type" name="type" required>
          <USelect
            v-model="state.type"
            :items="transactionTypeOptions"
            class="w-full"
            placeholder="Transaction type"
          />
        </UFormField>

        <UFormField label="Amount" name="amount" required>
          <UInput
            v-model="state.amount"
            type="number"
            class="w-full"
            placeholder="Amount"
          />
        </UFormField>

        <!-- transaction date -->
        <UFormField label="Transaction Date" name="created_at" required>
          <UInput
            v-model="state.created_at"
            type="date"
            class="w-full"
            placeholder="Date"
            icon="heroicons-calendar-days-solid"
          />
        </UFormField>

        <UFormField label="Description" name="description">
          <UInput
            v-model="state.description"
            type="text"
            class="w-full"
            placeholder="Description"
          />
        </UFormField>

        <UFormField label="Category" name="category" required>
          <USelect
            v-model="state.category"
            :items="transactionCategoryOptions"
            type="text"
            class="w-full"
            placeholder="Category"
          />
        </UFormField>

        <UButton type="submit">
          <UIcon
            v-if="isLoading"
            name="svg-spinners-12-dots-scale-rotate"
            class="size-5"
          />
          <span v-else> Save </span>
        </UButton>
      </UForm>
      <Placeholder class="h-48" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  transactionTypeOptions,
  transactionCategoryOptions,
} from "~/constants";

const toast = useToast();
const supabase = useSupabaseClient();
const isLoading = ref(false);
const form = ref();
const emit = defineEmits(["added"]);

const schema = object({
  type: string()
    .oneOf(transactionTypeOptions.value.map((option) => option))
    .required("Transaction type is required"),
  amount: number()
    .typeError("Amount must be a number")
    .positive("Amount must be a positive number")
    .required("Amount is required"),
  created_at: string().required("Date is required"),
  description: string().optional(),
  category: string()
    .oneOf(transactionCategoryOptions.value.map((option) => option))
    .required("Category is required"),
});

type Schema = InferType<typeof schema>;

interface Transaction {
  type: undefined;
  amount: number;
  created_at: undefined;
  description: undefined;
  category: undefined;
}

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};

const state = reactive<Transaction>({
  ...initialState,
});

const resetForm = () => {
  Object.assign(state, initialState);
  form.value.clear(); // clear the errors from the form
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const { error } = await supabase.from("transactions").insert(state);
  if (error) {
    toast.add({
      title: "Error",
      description: "there is a problem.",
      color: "error",
    });
    isLoading.value = false;
  } else {
    toast.add({
      title: "Success",
      description: "The form has been submitted.",
      color: "success",
    });
    isLoading.value = false;
    emit("added");
    resetForm();
  }
}
</script>

<style scoped></style>
