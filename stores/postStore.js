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


  const addComment = async (postId, content) => {
    console.log("asssasaa", authStore.user.email)
    try {
      if (!authStore.user) {
        throw new Error("You must be logged in to comment");
      }
  
      const comment = {
        postId,
        content,
        authorEmail: authStore.user?.email
      };
  
      const response = await $fetch(`/api/posts/${postId}/comment`, { 
        method: "POST",
        body: comment
      });
  
      if (response.success) {
        const index = posts.value.findIndex(p => p._id === postId);
        if (index !== -1) {
          posts.value[index] = response.post;
        }
        return response.post;
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  };

  const addReply = async (postId, commentId, replyContent) => {
    const authorEmail = "Author"
    try {
      const response = await $fetch(`/api/posts/${postId}/reply`, {
        method: "POST",
        body: { commentId, content: replyContent, authorEmail },
      });

      if (response.success) {
        const post = posts.value.find((p) => p._id === postId);
        if (post) {
          const comment = post.comments.find((c) => c._id === commentId);
          if (comment) {
            if (!comment.replies) comment.replies = [];
            comment.replies.push(response.reply);
          }
        }
      }
      console.log("addreplyresponse", response)
      console.log("reply saved")
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
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

  return { posts, addPost, deletePost, bookmarks ,toggleLike, toggleBookmark, loadPosts, loadBookmarks,editPost, addComment , addReply };
});
