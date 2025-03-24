<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Latest Articles</h1>

    <div v-if="postStore.posts && postStore.posts.length > 0" class="flex flex-wrap gap-4 justify-center">
      <div
        v-for="post in postStore.posts.slice(0, 5)"
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
            <span>({{ post.likes.length }})</span> 
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
  </div>
</template>

<script setup>
import { onMounted,computed  } from "vue";
import { usePostStore } from "~/stores/postStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const postStore = usePostStore();
const authStore = useAuthStore();
const router = useRouter();

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
