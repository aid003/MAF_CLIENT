import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { SettingsSidebarProps } from '../../../shared/types/settings';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  menuItems,
  selectedSection,
  onSectionChange,
  theme,
}) => {
  return (
    <Box
      sx={{
        width: '14vw',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <List>
        {menuItems.map(({ id, text, icon }) => (
          <ListItemButton
            key={id}
            selected={text === selectedSection}
            onClick={() => onSectionChange(text)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  text === selectedSection
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
