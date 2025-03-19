import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

export const usePostStore = defineStore("postStore", () => {
  const posts = ref([]);
  const bookmarks = ref([]);

  const loadPosts = () => {
    if (process.client) {
      posts.value = JSON.parse(localStorage.getItem("posts")) || [];
      bookmarks.value = JSON.parse(localStorage.getItem("bookmarks")) || [];
    }
  };

  const addPost = (post) => {
    if (process.client) {
      posts.value.unshift(post);
      localStorage.setItem("posts", JSON.stringify(posts.value));
    }
  };

  const deletePost = (id) => {
    if (process.client) {
      posts.value = posts.value.filter((post) => post.id !== id);
      localStorage.setItem("posts", JSON.stringify(posts.value));
    }
  };

  const toggleBookmark = (post) => {
    if (process.client) {
      const exists = bookmarks.value.find((b) => b.id === post.id);
      if (exists) {
        bookmarks.value = bookmarks.value.filter((b) => b.id !== post.id);
      } else {
        bookmarks.value.push(post);
      }
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks.value));
    }
  };

  const editPost = (updatedPost) => {
    if (process.client) {
      const index = posts.value.findIndex((p) => p.id === updatedPost.id);
      if (index !== -1) {
        posts.value[index] = updatedPost;
        localStorage.setItem("posts", JSON.stringify(posts.value));
      }
    }
  };


    const toggleLike = (id) => {
      if (process.client) {
        const post = posts.value.find((p) => p.id === id);
        if (post) {
          post.liked = !post.liked;
          post.likes += post.liked ? 1 : -1;
          localStorage.setItem("posts", JSON.stringify(posts.value));
        }
      }
    };

  // Load posts only on client-side after mounting
  onMounted(() => {
    loadPosts();
  });

  return { posts, addPost, deletePost, bookmarks,toggleLike, toggleBookmark, loadPosts,editPost };
});
