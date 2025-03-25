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
            <span>{{ post.likes.length }}</span>
          </button>
          <p class="text-sm">{{ formatDate(post.createdAt) }}</p>
        </div>
      </div>

      <img v-if="post.image" :src="post.image" alt="Post Image"
        class="my-6 mx-auto w-full h-[400px] object-contain rounded-lg shadow-md border border-gray-300" />

      <article class="mt-4 text-lg text-gray-800 leading-relaxed bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <pre class="whitespace-pre-wrap break-words">{{ post.content }}</pre>
      </article>

      <!-- Comments Section -->
      <div class="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Comments ({{ post.comments ? post.comments.length : 0 }})</h2>

        <!-- Add a comment -->
        <div v-if="authStore.user" class="mb-6">
          <div class="flex items-start space-x-3">
            <div class="flex-grow">
              <textarea
                v-model="newComment"
                placeholder="Write a comment..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
              <div class="flex justify-end mt-2">
                <button
                  @click="addComment"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  :disabled="isSubmitting || !newComment.trim()"
                >
                  {{ isSubmitting ? 'Publishing...' : 'Publish Comment' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="mb-6 p-4 bg-gray-100 rounded-lg text-center">
          <p>Please <a href="/login" class="text-blue-500 hover:underline">login</a> to leave a comment</p>
        </div>

        <!-- Comments list -->
        <div v-if="post.comments && post.comments.length > 0">
          <div v-for="(comment, index) in sortedComments" :key="index" class="border-b border-gray-200 py-4 last:border-b-0">
            <div class="flex justify-between items-start">
              <div class="font-semibold text-blue-600">{{ comment.authorEmail }}</div>
              <div class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</div>
            </div>
            <p class="mt-2 text-gray-700">{{ comment.content }}</p>
             <!-- Reply button (Only for post author) -->
            <div v-if="isPostAuthor" class="mt-2">
              <button 
                @click="toggleReplyBox(index)"
                class="text-sm text-blue-500 hover:underline"
              >
                Reply
              </button>

              <div v-if="showReplyBox === index" class="mt-2">
                <textarea 
                  v-model="replyText"
                  placeholder="Write a reply..."
                  class="w-full p-2 border border-gray-300 rounded-lg"
                ></textarea>
                <button 
                  @click="addReply(comment._id)"
                  class="mt-1 bg-green-500 text-white px-3 py-1 rounded-lg"
                >
                  Submit Reply
                </button>
              </div>
            </div>

                    <!-- Replies Section -->
            <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 ml-6 border-l-2 border-gray-300 pl-4">
              <h3 class="text-sm font-semibold text-gray-600">Replies:</h3>
              <div v-for="(reply, replyIndex) in comment.replies" :key="replyIndex" class="mt-2">
                <div class="bg-gray-100 p-3 rounded-md flex gap-4 items-center">
                  <span class="font-bold text-gray-600 text-sm">{{ reply.authorEmail }}</span>
                  <p class="text-xs text-gray-500">{{ new Date(reply.createdAt).toLocaleString() }}</p>
                </div>
                <p class="text-gray-700">{{ reply.content }}</p>
              </div>

            </div>
            
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          No comments yet. Be the first to comment!
        </div>
      </div>
    </template>

    <p v-else class="text-red-500 font-semibold mt-6">Loading post...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "~/stores/postStore";
import { useAuthStore } from "~/stores/authStore";
import { computed, onMounted, ref } from "vue";

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();

const newComment = ref("");
const isSubmitting = ref(false);

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



const sortedComments = computed(() => {
  if (!post.value || !post.value.comments) return [];
  return [...post.value.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

onMounted(() => {
  console.log("sortedcomments", sortedComments)
  console.log("postvalue", post.value)
  console.log("post", post);
  if (!post.value) {
    alert("Post not found");
    router.push("/");
   
  }
});



const addComment = async () => {
  if (!newComment.value.trim()) return;
  
  try {
    console.log("post.value._id", post.value._id)
    console.log("newComment.value", newComment.value)
    isSubmitting.value = true;
    await postStore.addComment(post.value._id, newComment.value.trim());
    newComment.value = "";
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Failed to add comment. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};


const isPostAuthor = computed(() => {
  return post.value?.authorId === authStore.user?.id;
});



const showReplyBox = ref(null);
const replyText = ref("");
const toggleReplyBox = (index) => {
  showReplyBox.value = showReplyBox.value === index ? null : index;
};

const addReply = async (commentId) => {
  if (!replyText.value.trim()) return;
  
  try {
    await postStore.addReply(post.value._id, commentId, replyText.value.trim());
    replyText.value = "";
    showReplyBox.value = null;
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>