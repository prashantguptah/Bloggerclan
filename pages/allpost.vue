<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Latest Articles</h1>

    <div  v-if="paginatedPosts.length > 0" class="flex flex-wrap gap-4 justify-center">
      <div
        v-for="post in paginatedPosts"
        :key="post.id"
        class="relative bg-white w-[27rem] h-[27rem] overflow-hidden space-y-3 p-4 shadow-lg rounded-2xl p-6 my-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
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

        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800 line-clamp-1 break-words overflow-hidden text-ellipsis">
            {{ post.title }}
          </h2>
          <button @click.stop="postStore.toggleLike(post)">
            <span v-if="post.likes.includes(authStore.user?.id)" class="text-red-500">❤️</span>
            <span v-else class="text-gray-400">🤍</span>
            <span>{{ post.likes.length }}</span> 
          </button>
        </div>

      
        <p class="line-clamp-2 break-words overflow-hidden text-ellipsis">
          {{ post.content }}
        </p>

     
        <button
           @click.stop="handleBookmark(post)"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
        >
        {{ isBookmarked(post) ? "Unbookmark" : "Bookmark" }}
        </button>
      </div>
    </div>

    <p v-else class="text-gray-500">No posts available.</p>

    
     <div class="flex justify-center mt-6 space-x-4 fixed bottom-0 right-0 left-0">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span class="text-lg font-semibold">Page {{ currentPage }} of {{ totalPages }}</span>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: "auth",
});

import { onMounted,computed  } from "vue";
import { usePostStore } from "~/stores/postStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const postStore = usePostStore();
const authStore = useAuthStore();
const router = useRouter();

const currentPage = ref(1);
const postsPerPage = 10;


const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  return postStore.posts.slice(start, start + postsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(postStore.posts.length / postsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};


const navigateToPost = (id) => {
  router.push(`/post/${id}`);
};

const isBookmarked = (post) => {
  return post?.bookmarks?.includes(authStore.user?.id);
};

const handleBookmark = async (post) => {
  await postStore.toggleBookmark(post);
};



onMounted(() => {
  postStore.loadPosts();

});
</script>
