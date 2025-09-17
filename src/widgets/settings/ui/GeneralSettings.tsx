import React from 'react';
import { Box, Typography, Select, MenuItem, Switch, Divider } from '@mui/material';
import { SettingsSectionProps, ThemeMode, Language } from '../../../shared/types/settings';
import type { SelectChangeEvent } from '@mui/material/Select';

interface GeneralSettingsProps extends SettingsSectionProps {
  themeMode: ThemeMode;
  language: Language;
  isVoiceInputEnabled: boolean;
  onThemeChange: (e: SelectChangeEvent<ThemeMode>) => void;
  onLanguageChange: (e: SelectChangeEvent<Language>) => void;
  onVoiceInputToggle: () => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  theme,
  themeMode,
  language,
  isVoiceInputEnabled,
  onThemeChange,
  onLanguageChange,
  onVoiceInputToggle,
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Общие настройки
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Настройте общие параметры приложения
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      {/* Настройка темы */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography>Тема</Typography>
        <Select
          value={themeMode}
          onChange={onThemeChange}
          size="small"
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="dark">Тёмная</MenuItem>
          <MenuItem value="light">Светлая</MenuItem>
        </Select>
      </Box>

      {/* Настройка языка */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography>Язык</Typography>
        <Select
          value={language}
          onChange={onLanguageChange}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="ru">Русский</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
      </Box>

      {/* Настройка голосового ввода */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography>Голосовой ввод</Typography>
        <Switch
          checked={isVoiceInputEnabled}
          onChange={onVoiceInputToggle}
        />
      </Box>
    </>
  );
};
