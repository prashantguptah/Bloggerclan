import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { useFetch } from "#app";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);
  const token = ref(null);


  const loadStoredAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken");
  
      if (storedUser && storedUser !== "undefined") {
        try {
          user.value = JSON.parse(storedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          user.value = null;
        }
      }
  
      token.value = storedToken || null;
    }
  };

 
  onMounted(() => {
    loadStoredAuth();

    setInterval(refreshAccessToken, 14 * 60 * 1000);
  });

  const register = async (newUser) => {
    const { data, error } = await useFetch("/api/auth/register", {
      method: "POST",
      body: newUser,
    });

    if (error.value) {
      alert(error.value.data.error);
      return;
    }

    alert(data.value.message);
  };

  const login = async (email, password) => {
    const { data, error } = await useFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (error.value) {
      alert(error.value.data.error);
      return false;
    }

    user.value = data.value.user;
    token.value = data.value.token;
    console.log("uservalue",user.value.email)

    if (process.client) {
      localStorage.setItem("user", JSON.stringify(data.value.user));
      localStorage.setItem("authToken", data.value.token);
    }

    console.log("Token stored:", data.value.token);
    return true;
  };

  const refreshAccessToken = async () => {
    const { data, error } = await useFetch("/api/auth/refresh", {
      method: "POST",
    });

    if (!error.value && data.value.accessToken) {
      token.value = data.value.accessToken;
      localStorage.setItem("authToken", data.value.accessToken);
    }
  };

  const logout = async () => {
    await useFetch("/api/auth/logout", { method: "POST" });
    user.value = null;
    token.value = null;
    if (process.client) {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
    navigateTo("/login")
  };

  return { user, token, register, refreshAccessToken,  login, logout };
});
