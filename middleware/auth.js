export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return; // Ensure it only runs on the client side

  const authToken = process.client ? localStorage.getItem("authToken") : null;

  const protectedRoutes = ["/bookmarks", "/create-post", "/my-posts"]; // Add other protected routes

  if (!authToken && protectedRoutes.includes(to.path)) {
    return navigateTo("/login");
  }
  });
  