<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-semibold mb-4 text-center">Login</h2>
        <input v-model="email" type="email" placeholder="Email" class="w-full border p-2 mb-2">
        <input v-model="password" type="password" placeholder="Password" class="w-full border p-2 mb-2">
        <button @click="loginUser" class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        <p class="mt-2 text-sm text-center">Don't have an account? <NuxtLink to="/register" class="text-blue-500">Register</NuxtLink></p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useAuthStore } from "~/stores/authStore";
  import { useRouter } from "vue-router";
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const email = ref("");
  const password = ref("");
  
  const loginUser = async () => {
  if (await authStore.login(email.value, password.value)) {
    router.push("/");
  } else {
    alert("Invalid credentials");
  }
};
  </script>
  