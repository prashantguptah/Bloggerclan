import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";

export const usePostStore = defineStore("postStore", () => {
  const posts = ref([]);
  const bookmarks = ref([]);
  const authStore = useAuthStore();
  const user = ref(null); 

  
   const loadPosts = async () => {
    try {
      const response = await $fetch("/api/posts");
      posts.value = response;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };


  const addPost = async (post) => {
    try {
      const response = await $fetch("/api/posts", {
        method: "POST",
        body: post,
      });
      console.log("response", response)
      posts.value.unshift(response); 
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };
 
  const deletePost = async (id) => {
    try {
      await $fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      posts.value = posts.value.filter((post) => {
        console.log("Checking post ID:", post._id); 
        return post._id !== id;
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  

   const toggleBookmark = async (post) => {
    try {
      const response = await $fetch("/api/posts/bookmark", {
        method: "POST",
        body: { postId: post._id },
      });

      if (response.success) {
       
        const updatedPost = posts.value.find((p) => p._id === post._id);
        if (updatedPost) {
          if (response.isBookMarked) {
            updatedPost.bookmarks.push(authStore.user?.id);
          } else {
            updatedPost.bookmarks = updatedPost.bookmarks.filter(
              (id) => id !== authStore.user?.id
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

 
    const toggleLike = async (post) => {
      try {
        const response = await $fetch("/api/posts/toggleLike", {
          method: "POST",
          body: { postId: post._id },
        });
  
        if (response.success) {
          const updatedPost = posts.value.find((p) => p._id === post._id);
          if (updatedPost) {
            updatedPost.likes = response.isLiked
              ? [...updatedPost.likes, authStore.user?.id]
              : updatedPost.likes.filter((id) => id !== authStore.user?.id);
          }
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
      }
    };


  const editPost = async (updatedPost) => {
    try {
      const response = await $fetch(`/api/posts/${updatedPost._id}`, {
        method: "PUT",
        body: updatedPost,
      });
      const index = posts.value.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        posts.value[index] = response;
      }
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };


  const addComment = async (postId, comment) => {
    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    const data = await res.json();
    return data;
  };

  const replyToComment = async (postId, commentId, reply) => {
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reply),
    });
    const data = await res.json();
    return data;
  };

  

  const loadBookmarks = async () => {
    try {
      const response = await $fetch("/api/posts/bookmarks");
      bookmarks.value = response;
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    }
  };

 

    onMounted(() => {
      loadPosts();
      loadBookmarks();
    });

  return { posts, addPost, deletePost, bookmarks ,toggleLike, toggleBookmark, loadPosts, loadBookmarks,editPost, addComment, replyToComment  };
});
