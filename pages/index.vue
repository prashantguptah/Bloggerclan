home page  of blogginf website <template>
    <div>
  
      <section class="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-center py-20">
        <h1 class="text-5xl font-bold mb-4">Welcome to Our Blog</h1>
        <p class="text-lg text-gray-200 max-w-2xl mx-auto">
          Discover amazing articles on various topics and bookmark your favorites!
        </p>
        <button
          class="mt-6 bg-yellow-500 px-6 py-3 text-lg rounded-lg font-semibold hover:bg-yellow-400 transition"
          @click="scrollToArticles"
        >
          Explore Articles
        </button>
      </section>
  
     
      <section ref="articlesSection" class="p-6 min-h-[60vh]">
        <h1 class="text-2xl font-bold text-gray-800">Latest Articles</h1>

        <div v-if="loading" class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
        
        <div v-else-if="postStore.posts && postStore.posts.length > 0" class="flex flex-wrap gap-4 justify-center">
          <div
            v-for="post in postStore.posts.slice(0, 6)"
            :key="post.id"
            class="relative bg-white w-[27rem] h-[25rem] px-[30px] overflow-hidden space-y-3 p-4 shadow-lg rounded-2xl my-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            @click="navigateToPost(post._id)"
          >
       
            <div v-if="post.image" class="w-full h-[12rem] mb-4 flex align-center justify-center">
              <img :src="post.image" alt="Post Image" class="object-cover rounded-lg object-center" />
            </div>
  
        
            <h2 class="text-2xl font-bold text-gray-800 line-clamp-1 break-words overflow-hidden text-ellipsis">
              {{ post.title }}s
            </h2>
  
            <p class="line-clamp-3 break-words overflow-hidden text-ellipsis">
              {{ post.content }}
            </p>
  
           
          </div>
        </div>
  
        <p v-else class="text-gray-500">No posts available.</p>
      </section>
  
   
      <footer class="bg-gray-900 text-gray-300 py-6 text-center">
        <p>&copy; {{ new Date().getFullYear() }} Blog Website. All rights reserved.</p>
        <div class="flex justify-center space-x-6 mt-3">
          <a href="#" class="hover:text-white">Privacy Policy</a>
          <a href="#" class="hover:text-white">Terms of Service</a>
          <a href="#" class="hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { usePostStore } from "~/stores/postStore";
  import { useRouter } from "vue-router";
  const loading = ref(true);
  
  const postStore = usePostStore();
  const router = useRouter();
  const articlesSection = ref(null);
  
  const navigateToPost = (id) => {
    router.push(`/post/${id}`);
  };
  

  const scrollToArticles = () => {
    articlesSection.value?.scrollIntoView({ behavior: "smooth" });
  };
  
  onMounted(() => {
    postStore.loadPosts();
    loading.value = false;
  });
  </script>
  
  