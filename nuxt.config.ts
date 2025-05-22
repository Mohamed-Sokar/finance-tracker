// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  // imports: {
  //   autoImport: true, // Should be true by default
  // },
  ui: {
    // colorMode: false,
  },
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
    },
  },
  css: ["~/assets/css/main.css"],
});
