<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">My Posts</h1>
    <div v-if="myPosts.length === 0" class="text-gray-500">
      You have not created any posts yet.
    </div>
     <div class="flex  gap-4">
      <div
      v-for="post in myPosts"
      :key="post.id"
      class="relative w-[27rem] h-[27rem] overflow-hidden space-y-6 p-4 border rounded my-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
      @click="navigateToPost(post.id)"
    >
      <!-- Post Image -->
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

      <div class="flex justify-between">
        <h2 class="font-bold">{{ post.title }}</h2>
        <button>
          <span v-if="post.liked" class="text-red-500 text-xl">❤️ {{ post.likes }}</span>
          <span v-else class="text-gray-400 text-xl">🤍 {{ post.likes }}</span>
        </button>
      </div>

      <p class="text-gray-600 mb-4">
        {{ truncateText(post.content, 20) }}
      </p>

      <div class="mt-2 flex gap-4">
        <button @click.stop="startEdit(post)" class="bg-blue-500 text-white px-3 py-1 rounded">
          Edit
        </button>
        <button @click.stop="deletePost(post.id)" class="bg-red-500 text-white px-3 py-1 rounded">
          Delete
        </button>
      </div>
    </div>

     </div>
  

    <!-- Edit Post Modal -->
    <div v-if="editingPost" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-[30rem]">
        <h2 class="text-xl font-bold mb-4">Edit Post</h2>
        <input v-model="editingPost.title" class="w-full p-2 border rounded mb-2" placeholder="Post Title" />
        <textarea v-model="editingPost.content" class="w-full h-[15rem] p-2 border rounded mb-2" placeholder="Post Content"></textarea>
        
        <!-- Image Preview -->
        <div v-if="editingPost.image" class="w-full h-[12rem] mb-4 flex justify-center items-center">
          <img :src="editingPost.image" alt="Selected Image" class=" object-cover rounded-lg" />
        </div>

        <!-- Upload New Image -->
        <input type="file" @change="handleImageUpload" class="mb-2" />

        <div class="flex justify-end gap-4 mt-4">
          <button @click="saveEdit" class="bg-green-500 text-white px-3 py-1 rounded">
            Save
          </button>
          <button @click="cancelEdit" class="bg-gray-500 text-white px-3 py-1 rounded">
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

const myPosts = computed(() => {
  return postStore.posts.filter((post) => post.email === authStore.user?.email);
});

const editingPost = ref(null);

const startEdit = (post) => {
  editingPost.value = { ...post }; // Create a copy of the post to edit
};

const saveEdit = () => {
  if (editingPost.value) {
    postStore.editPost(editingPost.value);
    editingPost.value = null; // Exit edit mode
  }
};

const cancelEdit = () => {
  editingPost.value = null; // Exit edit mode without saving
};

const deletePost = (id) => {
  postStore.deletePost(id);
};

const navigateToPost = (id) => {
  router.push(`/post/${id}`);
};

const truncateText = (text, limit) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editingPost.value.image = e.target.result; // Update image preview
    };
    reader.readAsDataURL(file);
  }
};
</script>
