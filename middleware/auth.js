export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    
    // If the user is not logged in, redirect to home page
    if (!authStore.token) {
      return navigateTo("/");
    }
  });
  