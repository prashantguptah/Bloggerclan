<template>
  <div class="h-[95vh] bg-gray-100 text-gray-900 flex justify-center items-center">
    <div class="bg-white p-8 rounded-xl shadow-lg w-[45rem] border border-gray-300">
     
      <h1 class="text-3xl font-bold text-center mb-6">Create a New Post</h1>

     
      <input
        v-model="title"
        type="text"
        placeholder="Enter post title..."
        class="w-full bg-gray-100 text-gray-900 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none mb-4"
      />


      <textarea
        v-model="content"
        rows="5"
        placeholder="Write your content here..."
        class="w-full bg-gray-100 text-gray-900 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none resize-none mb-4"
      ></textarea>

  
      <label
        class="block bg-gray-200 text-gray-700 px-4 py-3 text-center rounded-lg cursor-pointer hover:bg-gray-300 transition mb-4"
      >
        Upload Image
        <input type="file" @change="handleImageUpload" accept="image/*" class="hidden" />
      </label>

    
      <div v-if="imagePreview" class="mb-4">
        <img :src="imagePreview" alt="Image Preview" class="w-full h-40 object-contain rounded-lg border border-gray-300" />
      </div>

    
      <button
        @click="addNewPost"
        class="w-full bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-400 transition"
      >
        Publish Post
      </button>
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


const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image.value = e.target.result; 
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};


const addNewPost = async () => {
  if (!authStore.user) {
    alert("Please log in to create a post.");
    return;
  }

  const newPost = {
    title: title.value,
    content: content.value,
    image: image.value,
    authorId: authStore.user.id,
    authorEmail: authStore.user.email,
  };

  try {
    await postStore.addPost(newPost);
    router.push("/");
  } catch (error) {
    console.error("Error publishing post:", error);
  }
};
</script>
