<template>
  <div class="max-w-6xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg">
 
    <button @click="goBack" class="text-blue-600 hover:underline flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
        class="w-5 h-5 mr-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      Back to Articles
    </button>

    <template v-if="post">
    
      <h1 class="text-4xl font-extrabold text-gray-900 mt-6 leading-tight">{{ post.title }}</h1>

    
      <div class="flex justify-between items-center text-gray-600 mt-3">
        <p class="text-lg font-medium">Author: <span class="text-blue-600">{{ post.authorEmail }}</span></p>
        
       <div class="flex gap-2">
        <button @click.stop="postStore.toggleLike(post)">
            <span v-if="post.likes.includes(authStore.user?.id)" class="text-red-500">❤️</span>
            <span v-else class="text-gray-400">🤍</span>
            <span>({{ post.likes.length }})</span> 
          </button>
        <p class="text-sm">{{ post.createdAt
}}</p>

       </div> 
      </div>


      <img v-if="post.image" :src="post.image" alt="Post Image"
        class="my-6 mx-auto w-full h-[400px] object-contain rounded-lg shadow-md border border-gray-300" />


      <article class="mt-4 text-lg text-gray-800 leading-relaxed bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <pre class="whitespace-pre-wrap break-words">{{ post.content }}</pre>
      </article>
    </template>

    <p v-else class="text-red-500 font-semibold mt-6">Loading post...</p>
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
    return authStore.user.email.split("@")[0];
  }
  return "Unknown User";
});

const post = computed(() => {
  return (
    postStore.posts.find((p) => p._id == route.params.id) ||
    postStore.bookmarks.find((p) => p.id == route.params.id)
  );
});


const formattedDate = computed(() => {
  const date = new Date("2025-03-22T11:35:30.909Z"); 
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",  
    month: "long",    
    day: "numeric",  
  });
});

onMounted(() => {
  console.log("post", post)
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
