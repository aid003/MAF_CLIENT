import React from 'react';
import { Box, Typography, Divider, Button, Switch } from '@mui/material';
import { SettingsSectionProps } from '../../../shared/types/settings';

interface SecuritySettingsProps extends SettingsSectionProps {
  onTwoFactorToggle?: () => void;
  onPasswordChange?: () => void;
  onSessionTimeoutChange?: () => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  theme,
  onTwoFactorToggle,
  onPasswordChange,
  onSessionTimeoutChange,
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Безопасность
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Настройте пароли, двухфакторную аутентификацию и другие меры безопасности
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      {/* Двухфакторная аутентификация */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography>Двухфакторная аутентификация</Typography>
          <Typography variant="body2" color="text.secondary">
            Дополнительная защита вашего аккаунта
          </Typography>
        </Box>
        <Switch
          checked={false} // TODO: подключить к реальному состоянию
          onChange={onTwoFactorToggle}
        />
      </Box>

      {/* Смена пароля */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ mb: 1 }}>Пароль</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onPasswordChange}
        >
          Изменить пароль
        </Button>
      </Box>

      {/* Таймаут сессии */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography>Таймаут сессии</Typography>
          <Typography variant="body2" color="text.secondary">
            Автоматический выход через 30 минут неактивности
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={onSessionTimeoutChange}
        >
          Настроить
        </Button>
      </Box>
    </>
  );
};
