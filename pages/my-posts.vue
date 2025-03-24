<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">My Posts</h1>
    <div v-if="myPosts.length === 0" class="text-gray-500">
      You have not created any posts yet.
    </div>
     <div class="flex flex-wrap gap-4 justify-center">
      <div
      v-for="post in myPosts"
      :key="post._id"
      class="relative w-[27rem] h-[27rem] overflow-hidden space-y-6 p-4 border rounded my-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
      @click="navigateToPost(post._id)"
    >
     
      <div
        v-if="post.image"
        class="w-full h-[12rem] mb-4 flex align-center justify-center"
      >
        <img
          :src="post.image"
          alt="Post Image"
          class=" object-cover rounded-lg object-center"
        />
      </div>

      <div class="flex justify-between ">
        <h2 class="font-bold line-clamp-1 break-words overflow-hidden text-ellipsis">{{ post.title }}</h2>
        <button @click.stop="postStore.toggleLike(post)">
            <span v-if="post.likes.includes(authStore.user?.id)" class="text-red-500">❤️</span>
            <span v-else class="text-gray-400">🤍</span>
            <span>({{ post.likes.length }})</span> 
          </button>
      </div>

      <p class="line-clamp-2 break-words overflow-hidden text-ellipsis">
        {{ post.content}}
      </p>

      <div class="mt-2 flex gap-4">
        <button @click.stop="startEdit(post)" class="bg-blue-500 text-white px-3 py-1 rounded">
          Edit
        </button>
        <button @click.stop="deletePost(post._id)" class="bg-red-500 text-white px-3 py-1 rounded">
          Delete
        </button>
      </div>
    </div>

     </div>
  

 
     <div v-if="editingPost" class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg shadow-2xl w-[30rem] border border-gray-300">
    
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Edit Post</h2>

 
    <input
      v-model="editingPost.title"
      class="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none mb-3"
      placeholder="Post Title"
    />

 
    <textarea
      v-model="editingPost.content"
      class="w-full h-[12rem] p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none resize-none mb-3"
      placeholder="Post Content"
    ></textarea>

   
    <div v-if="editingPost.image" class="w-full h-[12rem] mb-4 flex justify-center items-center">
      <img :src="editingPost.image" alt="Selected Image" class="w-full h-full object-contain rounded-lg border border-gray-300" />
    </div>


    <label class="block bg-gray-200 text-gray-700 px-4 py-3 text-center rounded-lg cursor-pointer hover:bg-gray-300 transition mb-4">
      Upload Image
      <input type="file" @change="handleImageUpload" accept="image/*" class="hidden" />
    </label>

    
    <div class="flex justify-end gap-4 mt-4">
      <button @click="saveEdit" class="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-400 transition">
        Save
      </button>
      <button @click="cancelEdit" class="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition">
        Cancel
      </button>
    </div>
  </div>
  
</div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { usePostStore } from "~/stores/postStore";

const authStore = useAuthStore();
const postStore = usePostStore();
const router = useRouter();

onMounted(async () => {
  await postStore.loadPosts();
  
});

const myPosts = computed(() => {
  return postStore.posts.filter((post) => {
    console.log("Post:", post);
    console.log("Post Email:", post.email);
    console.log("Auth User Email:", authStore.user?.email);
    return post?.authorId === authStore.user?.id;
  });
  
});


const editingPost = ref(null);

const startEdit = (post) => {
  console.log("post", post)
  editingPost.value = { ...post }; 
};

const saveEdit = () => {
  if (editingPost.value) {
    postStore.editPost(editingPost.value);
    editingPost.value = null; 
  }
};

const cancelEdit = () => {
  editingPost.value = null;
};

const deletePost = (id) => {
  postStore.deletePost(id);
};

const navigateToPost = (id) => {
  router.push(`/post/${id}`);
};




const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editingPost.value.image = e.target.result; 
    };
    reader.readAsDataURL(file);
  }
};

watch(editingPost, async (newValue, oldValue) => {
  if (oldValue !== null && newValue === null) {
    await postStore.loadPosts(); 
  }
});
</script>
