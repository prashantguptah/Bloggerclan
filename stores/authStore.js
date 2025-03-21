import { defineStore } from "pinia";
import { ref } from "vue";
import { useFetch } from "#app";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);
  const token = ref(null);

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
    return true;
  };

  const logout = () => {
    user.value = null;
    token.value = null;
  };

  return { user, token, register, login, logout  };
});
