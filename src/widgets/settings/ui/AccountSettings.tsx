import React from 'react';
import { Box, Typography, Divider, Button, Alert } from '@mui/material';
import { SettingsSectionProps } from '../../../shared/types/settings';

interface AccountSettingsProps extends SettingsSectionProps {
  onLogout: () => void;
  onClearCache?: () => void;
  onExportData?: () => void;
  onDeleteAccount?: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({
  theme,
  onLogout,
  onClearCache,
  onExportData,
  onDeleteAccount,
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Управление аккаунтом
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Управляйте текущей сессией, выходом из учётной записи и очисткой данных
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      {/* Выход из аккаунта */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Сессия
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Выйти из текущей сессии на этом устройстве
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={onLogout}
          sx={{ mr: 2 }}
        >
          Выйти из аккаунта
        </Button>
      </Box>

      {/* Очистка кэша */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Очистка данных
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Очистить кэш приложения и временные файлы
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClearCache}
          sx={{ mr: 2 }}
        >
          Очистить кэш
        </Button>
      </Box>

      {/* Экспорт данных */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Экспорт данных
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Скачать все ваши данные в формате JSON
        </Typography>
        <Button
          variant="outlined"
          color="info"
          onClick={onExportData}
          sx={{ mr: 2 }}
        >
          Экспортировать данные
        </Button>
      </Box>

      {/* Удаление аккаунта */}
      <Box sx={{ mb: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Внимание!</strong> Удаление аккаунта необратимо. 
            Все ваши данные будут безвозвратно удалены.
          </Typography>
        </Alert>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Удаление аккаунта
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Полностью удалить ваш аккаунт и все связанные данные
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={onDeleteAccount}
        >
          Удалить аккаунт
        </Button>
      </Box>
    </>
  );
};
