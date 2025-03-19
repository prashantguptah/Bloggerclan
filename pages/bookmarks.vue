<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Bookmarked Articles</h1>
    <div v-if="postStore.bookmarks.length === 0" class="text-gray-500">
      No bookmarks yet.
    </div>
    
    <div class="flex  gap-4">
      <div
      v-for="post in postStore.bookmarks"
      :key="post.id"
      class="relative p-4 border rounded my-4 w-[27rem] h-[27rem] space-y-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
      @click="navigateToPost(post.id)"
    >
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


      <h2 class="font-bold">{{ post.title }}</h2>
      <p class="text-gray-600 mb-4">
          {{ truncateText(post.content, 20) }}
        </p>
      <div class="mt-2 flex gap-4">
        <button
          @click.stop="postStore.toggleBookmark(post)"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-yellow-400"
        >
          {{
            postStore.bookmarks.some((b) => b.id === post.id)
              ? "Unbookmark"
              : "Bookmark"
          }}
        </button>
      </div>
    </div>
    </div>
    
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { usePostStore } from "~/stores/postStore";

const postStore = usePostStore();
const router = useRouter();

const navigateToPost = (id) => {
  router.push(`/post/${id}`);
};

const truncateText = (text, limit) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};
</script>
