<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Bookmarked Articles</h1>
    <div v-if="filteredBookmarkedPosts.length === 0" class="text-gray-500">
      No bookmarks yet.
    </div>
    
    <div class="flex flex-wrap gap-4 justify-center">
      <div
      v-for="post in paginatedBookmarkedPosts"
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
    

    <div v-if="totalPages > 0" class="flex justify-center items-center gap-3 mt-6 fixed bottom-0 left-0 right-0">

      <button 
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span v-for="page in totalPages" :key="page">
        <button 
          @click="goToPage(page)"
          :class="{
            'bg-blue-500 text-white': currentPage === page,
            'bg-gray-200 text-gray-800': currentPage !== page
          }"
          class="px-3 py-2 rounded font-semibold transition-all duration-300 hover:bg-blue-400"
        >
          {{ page }}
        </button>
      </span>

   
      <button 
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
import { computed, ref } from "vue";
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


const currentPage = ref(1); 
const postsPerPage = 10; 

const paginatedBookmarkedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return filteredBookmarkedPosts.value.slice(start, end);
});


const totalPages = computed(() => Math.ceil(filteredBookmarkedPosts.value.length / postsPerPage));


const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const goToPage = (page) => {
  currentPage.value = page;
};

const navigateToPost = (id) => {
  console.log(postStore.bookmarks)
  router.push(`/post/${id}`);
};



onMounted(() => {
  postStore.posts;

});

</script>
