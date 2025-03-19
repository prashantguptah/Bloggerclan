<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Latest Articles</h1>

    <div v-if="postStore.posts && postStore.posts.length > 0" class="flex  gap-4">
      <div
        v-for="post in paginatedPosts"
        :key="post.id"
        class="relative bg-white w-[27rem] h-[27rem] overflow-hidden space-y-3 p-4 shadow-lg rounded-2xl p-6 my-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
        @click="navigateToPost(post.id)"
      >
        <!-- Image Section -->
        <div
          v-if="post.image"
          class="w-full h-[12rem] mb-4 flex align-center justify-center"
        >
          <img
            :src="post.image"
            alt="Post Image"
            class="object-cover rounded-lg object-center"
          />
        </div>

        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">{{ post.title }}</h2>
          <button @click.stop="postStore.toggleLike(post.id)">
            <span v-if="post.liked" class="text-red-500">❤️</span>
            <span v-else class="text-gray-400">🤍</span>
          </button>
        </div>

        <!-- Post Content -->
        <p class="text-gray-600 mb-4">
          {{ truncateText(post.content, 20) }}
        </p>

        <!-- Bookmark Button -->
        <button
          @click.stop="postStore.toggleBookmark(post)"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
        >
          {{
            postStore.bookmarks.some((b) => b.id === post.id)
              ? "Unbookmark"
              : "Bookmark"
          }}
        </button>
      </div>

      <!-- Pagination -->
      <div
        class="flex gap-2 fixed bottom-0 left-0 w-full bg-white p-4 shadow-md justify-center"
      >
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Prev
        </button>
        <button
          @click="nextPage"
          :disabled="page * 10 >= postStore.posts.length"
          class="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>

    <p v-else class="text-gray-500">No posts available.</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePostStore } from "~/stores/postStore";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const postStore = usePostStore();
const router = useRouter();

// Pagination
const page = ref(1);
const paginatedPosts = computed(() => {
  const start = (page.value - 1) * 10;
  return postStore.posts.slice(start, start + 10);
});

const nextPage = () => {
  page.value++;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

const navigateToPost = (id) => {
  router.push(`/post/${id}`);
};

const truncateText = (text, limit) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

onMounted(() => {
  postStore.loadPosts();
});
</script>
