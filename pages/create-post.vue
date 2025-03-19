<template>
  <div class="h-[80vh] flex justify-center items-center">
    <div class="p-6 max-w-2xl mx-auto text-center ">
      <h1 class="text-[40px] font-bold mb-4">Create a New Post</h1>
      
      <input v-model="title" type="text" placeholder="Title" class="w-full border p-2 mb-2">
      
      <textarea v-model="content" rows="5" placeholder="Content" class="w-full border p-2 mb-2"></textarea>
      
    
      <input type="file" @change="handleImageUpload" accept="image/*" class="w-full border p-2 mb-2">
      
    
      <img v-if="imagePreview" :src="imagePreview" alt="Image Preview" class="my-4 w-full rounded">
      
      <button @click="addNewPost" class="bg-blue-500 text-white px-4 py-2 rounded">Publish</button>
   </div>
  </div>
 
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { usePostStore } from "~/stores/postStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const postStore = usePostStore();
const router = useRouter();

const title = ref("");
const content = ref("");
const image = ref(null);
const imagePreview = ref(null);

// Handle Image Upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image.value = e.target.result; // Convert image to Base64
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addNewPost = () => {
  if (!authStore.user) {
    alert("Please log in to create a post.");
    return;
  }

  const newPost = {
    id: Date.now(),
    title: title.value,
    content: content.value,
    image: image.value, // Store image
    author: authStore.user.name,
    email: authStore.user.email,
  };

  postStore.addPost(newPost);
  router.push("/");
};
</script>
