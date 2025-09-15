import { User } from "../model/types";

export const USER_LOCALSTORAGE_KEY = 'user';

export const getStoredUserData = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  if (!token) {
    return null;
  }

  return {
    token,
    isAuthenticated: true,
    id: 'guest',
    name: 'Гость',
    email: 'guest@example.com'
  };
};

export const setUserToStorage = (token: string) => {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, token);
};

export const clearUserFromStorage = () => {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
};