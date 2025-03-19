<template>
  <div class="p-6 max-w-2xl mx-auto">
    <button @click="goBack" class="text-blue-600 hover:underline">
      &larr; Back
    </button>

    <template v-if="post">
      <h1 class="text-3xl font-bold my-4">{{ post.title }}</h1>
      <div class="flex justify-between">
        <p class="text-gray-600">Author: {{ userName }}</p>
        <button>
          <span v-if="post.liked" class="text-red-500 text-xl"
            >❤️ {{ post.likes }}</span
          >
          <span v-else class="text-gray-400 text-xl">🤍 {{ post.likes }}</span>
        </button>
      </div>

     
      <img
        v-if="post.image"
        :src="post.image"
        alt="Post Image"
        class="my-4 mx-auto  rounded"
      />
      <pre class="mt-4 text-[14px] whitespace-pre-wrap break-words">{{ post.content }}</pre>

    </template>

    <p v-else class="text-red-500">Loading post...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "~/stores/postStore";
import { useAuthStore } from "~/stores/authStore";
import { computed, onMounted } from "vue";

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();

const userName = computed(() => {
  if (authStore.user?.email) {
    return authStore.user.email.split("@")[0]; // Extracts the name before '@'
  }
  return "Unknown User"; // Default if not logged in
});

const post = computed(() => {
  return (
    postStore.posts.find((p) => p.id == route.params.id) ||
    postStore.bookmarks.find((p) => p.id == route.params.id)
  );
});

onMounted(() => {
  if (!post.value) {
    alert("Post not found");
    router.push("/");
  }
});

const toggleLike = (id) => {
  postStore.toggleLike(id);
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>
