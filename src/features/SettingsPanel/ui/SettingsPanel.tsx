import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSettings } from "../../settings/model";
import { 
  SettingsSidebar, 
  GeneralSettings, 
  SecuritySettings, 
  AboutSettings, 
  AccountSettings 
} from "../../../widgets/settings/ui";
import { SettingsMenuItem } from "../../../shared/types/settings";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const menuItems: SettingsMenuItem[] = [
  { id: "general", text: "Общее", icon: <SettingsIcon /> },
  { id: "account", text: "Аккаунт", icon: <LogoutIcon /> },
  { id: "security", text: "Безопасность", icon: <SecurityIcon /> },
  { id: "about", text: "О программе", icon: <InfoIcon /> },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose }) => {
  const theme = useTheme();
  
  // Используем хук для управления настройками
  const settings = useSettings();

  // Функция для рендеринга контента в зависимости от выбранной секции
  const renderContent = () => {
    switch (settings.selectedSection) {
      case "Общее":
        return (
          <GeneralSettings
            theme={theme}
            themeMode={settings.themeMode}
            language={settings.language}
            isVoiceInputEnabled={settings.isVoiceInputEnabled}
            onThemeChange={settings.handleThemeChange}
            onLanguageChange={settings.handleLanguageChange}
            onVoiceInputToggle={settings.handleVoiceInputToggle}
          />
        );
      case "Безопасность":
        return (
          <SecuritySettings
            theme={theme}
            onTwoFactorToggle={() => console.log('Two factor toggle')}
            onPasswordChange={() => console.log('Password change')}
            onSessionTimeoutChange={() => console.log('Session timeout change')}
          />
        );
      case "О программе":
        return <AboutSettings theme={theme} />;
      case "Аккаунт":
        return (
          <AccountSettings
            theme={theme}
            onLogout={settings.handleLogout}
            onClearCache={() => console.log('Clear cache')}
            onExportData={() => console.log('Export data')}
            onDeleteAccount={() => console.log('Delete account')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        Настройки
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, backgroundColor: theme.palette.background.default }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <SettingsSidebar
            menuItems={menuItems}
            selectedSection={settings.selectedSection}
            onSectionChange={settings.handleSectionChange}
            theme={theme}
          />

          <Box
            sx={{
              flexGrow: 1,
              height: "55vh",
              px: 2,
              color: theme.palette.text.primary,
              overflowY: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                width: 8,
                backgroundColor: theme.palette.background.paper,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#444654" : "#b3b3b3",
                borderRadius: 4,
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303030" : "#a0a0a0",
              },
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.primary }}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPanel;
