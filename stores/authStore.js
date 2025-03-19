import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { faker } from "@faker-js/faker";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);

  const loadUser = () => {
    user.value = JSON.parse(localStorage.getItem("user")) || null;
  };

  const register = (newUser) => {
    newUser.profileImage = faker.image.avatar();
    localStorage.setItem("user", JSON.stringify(newUser));
    user.value = newUser;
  };

  const login = (email) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email === email) {
      user.value = storedUser;
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    user.value = null;
  };

  // Load user data when the store is initialized
  onMounted(() => {
    loadUser();
  });

  return { user, loadUser, register, login, logout };
});
