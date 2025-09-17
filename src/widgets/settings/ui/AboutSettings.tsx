import React from 'react';
import { Box, Typography, Divider, Link, Chip } from '@mui/material';
import { SettingsSectionProps, AppConfig } from '../../../shared/types/settings';

interface AboutSettingsProps extends SettingsSectionProps {
  config?: AppConfig;
}

const defaultConfig: AppConfig = {
  version: '1.2.6',
  developers: ['Балахадзе А.Г', 'Назаренко П.Е', 'Хакимов Р.Э'],
  buildDate: new Date().toLocaleDateString('ru-RU'),
};

export const AboutSettings: React.FC<AboutSettingsProps> = ({
  theme,
  config = defaultConfig,
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        О программе
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Информация о версии, разработчиках и технических деталях
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      {/* Информация о версии */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Версия приложения
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={config.version} 
            color="primary" 
            size="small"
          />
          {config.buildDate && (
            <Typography variant="body2" color="text.secondary">
              (сборка от {config.buildDate})
            </Typography>
          )}
        </Box>
      </Box>

      {/* Информация о разработчиках */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Команда разработки
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {config.developers.map((developer, index) => (
            <Typography key={index} variant="body2">
              • {developer}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Техническая информация */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Техническая информация
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          • React 19.0.0
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          • Material-UI 6.4.8
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          • Next.js 15.2.2
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • TypeScript 5.8.2
        </Typography>
      </Box>

      {/* Ссылки */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Полезные ссылки
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link 
            href="#" 
            color="primary" 
            underline="hover"
            sx={{ fontSize: '0.875rem' }}
          >
            Документация
          </Link>
          <Link 
            href="#" 
            color="primary" 
            underline="hover"
            sx={{ fontSize: '0.875rem' }}
          >
            Поддержка
          </Link>
          <Link 
            href="#" 
            color="primary" 
            underline="hover"
            sx={{ fontSize: '0.875rem' }}
          >
            GitHub репозиторий
          </Link>
        </Box>
      </Box>
    </>
  );
};
