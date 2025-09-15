import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import {
  logoutUser,
  setUser,
  loadUserFromStorage,
  UserState,
} from "@/shared/redux/slices/userSlice";
import { useRouter } from "next/navigation";

export function useAuth() {
  const user: UserState = useAppSelector(
    (state: { user: UserState }) => state.user
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isFetchingUser = useRef(false);

  const fetchUser = useCallback(async () => {
    if (isFetchingUser.current) return;
    isFetchingUser.current = true;

    dispatch(loadUserFromStorage());

    isFetchingUser.current = false;
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const loginAsGuest = useCallback(() => {
    const guestUser = {
      id: "guest",
      name: "Гость",
      email: "guest@example.com",
      token: "guest",
      isAuthenticated: true,
    };
    
    // Сохраняем в localStorage
    localStorage.setItem("user", JSON.stringify(guestUser));
    
    // Обновляем Redux state
    dispatch(setUser(guestUser));
    
    // Перенаправляем на главную страницу
    router.push("/");
  }, [dispatch, router]);

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
          const errorMessage = data.error || "Ошибка входа";
          console.error("Login error:", errorMessage);
          throw new Error(errorMessage);
        }

        localStorage.setItem("user", JSON.stringify({
          token: data.token,
          id: data.id,
          name: data.name,
          email: data.email,
          isAuthenticated: true
        }));
        dispatch(
          setUser({
            id: data.id ?? "",
            name: data.name ?? "Гость",
            email: data.email ?? "",
            token: data.token,
            isAuthenticated: true,
          })
        );
        
        // Перенаправляем на главную страницу
        router.push("/");
      } catch (error) {
        console.error("Ошибка входа:", error);
        throw error;
      }
    },
    [dispatch, router]
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
          const errorMessage = data.error || "Ошибка регистрации";
          console.error("Register error:", errorMessage);
          throw new Error(errorMessage);
        }

        localStorage.setItem("user", JSON.stringify({
          token: data.token,
          id: data.id,
          name: data.name,
          email: data.email,
          isAuthenticated: true
        }));
        dispatch(
          setUser({
            id: data.id ?? "",
            name: data.name ?? "Гость",
            email: data.email ?? "",
            token: data.token,
            isAuthenticated: true,
          })
        );
        
        // Перенаправляем на главную страницу
        router.push("/");
      } catch (error) {
        console.error("Ошибка регистрации:", error);
        throw error;
      }
    },
    [dispatch, router]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
    router.push("/auth");
  }, [dispatch, router]);

  return { user, login, register, logout, fetchUser, loginAsGuest };
}
