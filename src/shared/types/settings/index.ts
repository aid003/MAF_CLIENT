import { Theme } from '@mui/material/styles';

// Типы для настроек приложения
export type ThemeMode = 'light' | 'dark';
export type Language = 'ru' | 'en';

// Интерфейс для элемента меню настроек
export interface SettingsMenuItem {
  id: string;
  text: string;
  icon: React.ReactNode;
}

// Состояние настроек
export interface SettingsState {
  themeMode: ThemeMode;
  language: Language;
  isVoiceInputEnabled: boolean;
  selectedSection: string;
}

// Пропсы для компонентов настроек
export interface SettingsSectionProps {
  theme: Theme;
}

export interface SettingsSidebarProps {
  menuItems: SettingsMenuItem[];
  selectedSection: string;
  onSectionChange: (section: string) => void;
  theme: Theme;
}

// Конфигурация приложения
export interface AppConfig {
  version: string;
  developers: string[];
  buildDate?: string;
}

// Настройки безопасности
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
}

// Настройки аккаунта
export interface AccountSettings {
  username: string;
  email: string;
  lastLogin: string;
  isActive: boolean;
}