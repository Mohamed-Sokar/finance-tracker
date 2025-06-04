<template>
  <UModal
    title="Add Transaction"
    size="lg"
    @close="resetForm"
    v-model:open="isOpen"
  >
    <!-- <UButton
      active
      color="neutral"
      variant="outline"
      active-color="primary"
      active-variant="solid"
      icon="heroicons-plus-circle-20-solid"
      :label="isEditing ? 'Edit' : 'Add'"
    /> -->
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
            :disabled="isEditing"
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

        <UFormField
          label="Category"
          name="category"
          required
          v-if="state.type === 'Expense'"
        >
          <USelect
            v-model="state.category"
            :items="transactionCategoryOptions"
            type="text"
            class="w-full"
            placeholder="Category"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Save"
          :loading="isLoading"
          class="w-full text-center justify-center font-bold"
        >
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { number, object, string } from "yup";

import {
  transactionTypeOptions,
  transactionCategoryOptions,
} from "~/constants";

const props = defineProps({
  modalValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["saved", "update:modalValue"]);

const { toastSuccess, toastError } = useAppToast();

const supabase = useSupabaseClient();
const isLoading = ref(false);
const form = ref();
const isEditing = computed(() => !!props.transaction);
const isOpen = computed({
  get: () => props.modalValue || false,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modalValue", value);
  },
});

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
  // category: string()
  //   .oneOf(transactionCategoryOptions.value.map((option) => option))
  //   .required("Category is required"),
});

// type Schema = InferType<typeof schema>;

// interface Transaction {
//   type: undefined;
//   amount: number | undefined;
//   created_at: undefined;
//   description: undefined;
//   category: undefined;
// }

const initialState = isEditing.value
  ? {
      type: props.transaction?.type,
      amount: props.transaction?.amount,
      created_at: props.transaction?.created_at.split("T")[0],
      description: props.transaction?.description,
      category: props.transaction?.category,
    }
  : {
      type: undefined,
      amount: 0,
      created_at: undefined,
      description: undefined,
      category: undefined,
    };

const state = reactive({ ...initialState });

const resetForm = () => {
  Object.assign(state, initialState);
  isLoading.value = false;
  form.value.clear(); // clear the errors from the form
};

async function onSubmit(event) {
  isLoading.value = true;
  // to insert the data into the database
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state, id: props.transaction?.id });
    if (error) {
      isLoading.value = false;
      console.log(error);
      throw error;
    } else {
      toastSuccess({
        title: "Successfully",
        description: "The form has been submitted.",
      });

      isLoading.value = false;
      emit("saved");
      // close the modal
      isOpen.value = false;
      resetForm();
    }
  } catch (e) {
    toastError({
      title: "Error",
      description: e.meessage,
    });
  }
}
</script>

<style scoped></style>
