import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/features/auth/model/types";

export interface UserState extends User {
  isAuthenticated: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
  id: null,
  name: null,
  email: null,
  token: null,
};

export const loadUserFromStorage = createAsyncThunk(
  "user/loadUserFromStorage",
  async (_, { dispatch }) => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.token) {
          // Проверяем, является ли токен гостевым
          if (user.token === "guest") {
            dispatch(setGuestUser());
            return;
          }

          // Проверяем токен на сервере для обычных пользователей
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            dispatch(setUser({ ...data.user, token: user.token, isAuthenticated: true }));
            return;
          }
        }
      } catch (error) {
        console.error("Failed to parse user from storage", error);
      }
    }
    dispatch(logoutUser());
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    setGuestUser(state) {
      state.isAuthenticated = true;
      state.id = "guest";
      state.name = "Гость";
      state.email = "guest@example.com";
      state.token = "guest";
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setGuestUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
