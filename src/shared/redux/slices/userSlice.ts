import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  isAuthenticated: boolean;
  id: string | null;
  name: string | null;
  email: string | null;
  token: string | null;
}

const initialState: UserState = {
  isAuthenticated: true,
  id: "guest",
  name: "Гость",
  email: "guest@example.com",
  token: "guest",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state: UserState,
      action: PayloadAction<Omit<UserState, "isAuthenticated">>
    ) {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", action.payload.token ?? "");
      }
    },
    logoutUser(state: UserState) {
      state.isAuthenticated = false;
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    loadUserFromStorage(state: UserState) {
      // Авторизация отключена - всегда авторизуем пользователя как гостя
      state.isAuthenticated = true;
      state.id = "guest";
      state.name = "Гость";
      state.email = "guest@example.com";
      state.token = "guest";
    },
  },
});

export const { setUser, logoutUser, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
