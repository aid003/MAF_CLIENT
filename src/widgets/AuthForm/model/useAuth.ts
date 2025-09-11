import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import {
  logoutUser,
  setUser,
  UserState,
} from "@/shared/redux/slices/userSlice";

export function useAuth() {
  const user: UserState = useAppSelector(
    (state: { user: UserState }) => state.user
  );
  const dispatch = useAppDispatch();

  const isFetchingUser = useRef(false);

  const fetchUser = useCallback(async () => {
    if (isFetchingUser.current) return;
    isFetchingUser.current = true;

    // Авторизация отключена - не проверяем токен, всегда авторизуем как гостя
    dispatch(
      setUser({
        id: "guest",
        name: "Гость",
        email: "guest@example.com",
        token: "guest",
      })
    );
    return;
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Ошибка входа");
        }

        localStorage.setItem("user", data.token);
        dispatch(
          setUser({
            id: data.id ?? "",
            name: data.name ?? "Гость",
            email: data.email ?? "",
            token: data.token,
          })
        );
      } catch (error) {
        console.error("Ошибка входа:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Ошибка регистрации");
        }

        localStorage.setItem("user", data.token);
        dispatch(
          setUser({
            id: data.id ?? "",
            name: data.name ?? "Гость",
            email: data.email ?? "",
            token: data.token,
          })
        );
      } catch (error) {
        console.error("Ошибка регистрации:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    dispatch(logoutUser());
  }, [dispatch]);

  return { user, login, register, logout, fetchUser };
}
