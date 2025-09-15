"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/redux/hooks";
import { UserBadger } from "@/features/UserBadge/ui/UserBadge";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Проверяем аутентификацию и перенаправляем если не авторизован
    if (!isAuthenticated && pathname !== "/auth") {
      router.push("/auth");
    }
  }, [isAuthenticated, pathname, router]);

  const userBadger = ["/profile", "/auth"].includes(pathname);

  return isAuthenticated ? (
    <>
      {!userBadger && <UserBadger />}
      {children}
    </>
  ) : null;
}
