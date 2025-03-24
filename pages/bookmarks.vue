<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Bookmarked Articles</h1>
    <div v-if="filteredBookmarkedPosts.length === 0" class="text-gray-500">
      No bookmarks yet.
    </div>
    
    <div class="flex flex-wrap gap-4 justify-center">
      <div
      v-for="post in filteredBookmarkedPosts"
      :key="post.id"
      class="relative p-4 border rounded my-4 w-[27rem] h-[27rem] space-y-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
      @click="navigateToPost(post._id)"
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


      <h2 class="font-bold line-clamp-1 break-words overflow-hidden text-ellipsis">{{ post.title }}</h2>
      <p class="line-clamp-2 break-words overflow-hidden text-ellipsis">
          {{ post.content}}
        </p>
      <div class="mt-2 flex gap-4">
        <button
          @click.stop="postStore.toggleBookmark(post)"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-yellow-400"
        >
          Unbookmark
        </button>
      </div>
    </div>
    </div>
    
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { usePostStore } from "~/stores/postStore";
import { useAuthStore } from "~/stores/authStore";



const postStore = usePostStore();
const router = useRouter();
const authStore = useAuthStore();
const userId = authStore.user?.id.toString();
console.log(userId)
const filteredBookmarkedPosts = computed(() =>
  postStore.posts.filter((post) => post.bookmarks.includes(userId))
);

const navigateToPost = (id) => {
  console.log(postStore.bookmarks)
  router.push(`/post/${id}`);
};


</script>
