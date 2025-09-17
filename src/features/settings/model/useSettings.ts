import { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColorModeContext } from '../../../shared/themeContext/ThemeContext';
import { useAuth } from '../../../widgets/AuthForm/model/useAuth';
import { RootState } from '../../../shared/redux/store';
import { toggleVoiceInput } from '../../../shared/redux/slices/voiceSlice';
import { SettingsState, ThemeMode, Language } from '../../../shared/types/settings';
import type { SelectChangeEvent } from '@mui/material/Select';

export const useSettings = () => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const { logout } = useAuth();

  // Redux состояние
  const isVoiceInputEnabled = useSelector(
    (state: RootState) => state.voice.isVoiceInputEnabled
  );
  const themeModeRedux = useSelector((state: RootState) => state.theme.mode);

  // Локальное состояние
  const [themeMode, setThemeMode] = useState<ThemeMode>(themeModeRedux);
  const [language, setLanguage] = useState<Language>('ru');
  const [selectedSection, setSelectedSection] = useState<string>('Общее');

  // Обработчики
  const handleThemeChange = (e: SelectChangeEvent<ThemeMode>) => {
    const newMode = e.target.value as ThemeMode;
    setThemeMode(newMode);
    if (newMode !== themeModeRedux) {
      toggleColorMode();
    }
  };

  const handleLanguageChange = (e: SelectChangeEvent<Language>) => {
    setLanguage(e.target.value as Language);
  };

  const handleVoiceInputToggle = () => {
    dispatch(toggleVoiceInput());
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const handleLogout = () => {
    logout();
  };

  // Состояние для передачи в компоненты
  const settingsState: SettingsState = {
    themeMode,
    language,
    isVoiceInputEnabled,
    selectedSection,
  };

  return {
    // Состояние
    ...settingsState,
    
    // Обработчики
    handleThemeChange,
    handleLanguageChange,
    handleVoiceInputToggle,
    handleSectionChange,
    handleLogout,
    
    // Утилиты
    setThemeMode,
    setLanguage,
    setSelectedSection,
  };
};
