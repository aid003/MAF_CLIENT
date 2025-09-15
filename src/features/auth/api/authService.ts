import { User, AuthResponse } from '../model/types';
import { 
  setUserToStorage, 
  clearUserFromStorage, 
  getStoredUserData 
} from '../lib/storage';

class AuthService {
  static async checkAuth(): Promise<User | null> {
    const userData = getStoredUserData();
    if (!userData) {
      return null;
    }
    return userData;
  }

  static async loginAsGuest(): Promise<User> {
    const guestUser: User = {
      id: 'guest',
      name: 'Гость',
      email: 'guest@example.com',
      token: 'guest',
      isAuthenticated: true
    };
    
    setUserToStorage('guest');
    return guestUser;
  }

  static async logout(): Promise<void> {
    clearUserFromStorage();
  }
}

export { AuthService };