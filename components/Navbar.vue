<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <NuxtLink to="/" class="font-bold text-lg">My Blog</NuxtLink>

    <div v-if="authStore" class="flex items-center gap-4">
      <template v-if="!authStore.user">
        <NuxtLink to="/login" class="mx-2">Login</NuxtLink>
        <NuxtLink to="/register" class="mx-2">Register</NuxtLink>
      </template>

      <template v-else>
        <NuxtLink to="/allpost" class="mx-2">All Post</NuxtLink>
        <NuxtLink to="/create-post" class="mx-2">Create Post</NuxtLink>
        <NuxtLink to="/my-posts" class="mx-2">My Posts</NuxtLink>
        <NuxtLink to="/bookmarks" class="mx-2">Bookmarks</NuxtLink>

        <!-- Profile Dropdown -->
        <div class="relative">
          <button @click="toggleDropdown" class="flex items-center focus:outline-none">
            <img
              :src="authStore.user.profileImage || 'https://via.placeholder.com/40'"
              alt="User Profile"
              class="w-10 h-10 rounded-full border border-gray-300"
            />
          </button>

          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg py-2 z-[100]"
          >
           
            <div class="flex items-center gap-3 px-4 py-2 border-b">
              <img
                :src="authStore.user.profileImage || 'https://via.placeholder.com/40'"
                alt="User Profile"
                class="w-10 h-10 rounded-full border border-gray-300"
              />
              <div>
                <p class="text-[12px] font-semibold">{{ authStore.user.email }}</p>
              </div>
            </div>

            <NuxtLink to="/editprofile" class="block px-4 py-2 hover:bg-gray-200">Edit Profile</NuxtLink>
            <NuxtLink to="/settings" class="block px-4 py-2 hover:bg-gray-200">Settings</NuxtLink>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const logout = () => {
  authStore.logout();
  isDropdownOpen.value = false;
};
</script>
