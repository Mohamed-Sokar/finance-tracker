<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

const success = ref(false);
const { toastError, toastSuccess } = useAppToast();
const supabase = useSupabaseClient();
const pending = ref(false);

const schema = object({
  email: string().email("Invalid email").required("Required"),
  //   password: string()
  //     .min(8, "Must be at least 8 characters")
  //     .required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  email: "",
  //   password: undefined,
});
useRedirectIfAuthenticated();

const handleLogin = async () => {
  pending.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: state.email,
      options: {
        emailRedirectTo: `${process.env.BASE_URL}/confirm`,
      },
    });

    if (error) {
      throw error;
    }

    success.value = true;
    toastSuccess({
      title: "Success",
      description: "You have successfully signed in.",
    });
    console.log("Sign-in data:", data);
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    toastError({
      title: "Error Authentication",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <div>
    <UCard v-if="!success">
      <template #header>
        <h2>Sign-in to Finance Tracker</h2>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="handleLogin"
      >
        <UFormField
          label="Email"
          name="email"
          help="You will receive a magic link to sign in."
        >
          <UInput
            v-model="state.email"
            class="w-full"
            placeholder="Email"
            required
          />
        </UFormField>

        <!-- <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField> -->

        <UButton type="submit" :loading="pending" :disabled="pending">
          Sign-in
        </UButton>
      </UForm>
    </UCard>
    <UCard v-else>
      <template #header>
        <h2>Email has been sent</h2>
      </template>
      <p class="text-center mb-4">
        We have sent an email to <strong>aboomarsokar@gmail.com</strong> with a
        link to sign in
      </p>
      <p class="text-center">
        <strong>Important: </strong> The link will expire in
        <strong>5</strong> minutes.
      </p>
    </UCard>
  </div>
</template>

<style scoped></style>
