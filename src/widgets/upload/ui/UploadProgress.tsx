import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  isProcessing: boolean;
  processingProgress: number;
  currentProcessingStep: string;
  errorMessage: string | null;
  successMessage: string | null;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  uploadProgress,
  isProcessing,
  processingProgress,
  currentProcessingStep,
  errorMessage,
  successMessage,
}) => {
  return (
    <>
      {/* Полоска прогресса загрузки файла */}
      {isUploading && (
        <Box sx={{ width: '100%', maxWidth: 600, mt: 3 }}>
          <Typography variant="body2" align="center" mb={1} color="primary">
            📤 Загрузка файла на сервер
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" align="center" mt={1}>
            {uploadProgress}%
          </Typography>
        </Box>
      )}

      {/* Полоска прогресса обработки */}
      {isProcessing && (
        <Box sx={{ width: '100%', maxWidth: 600, mt: 3 }}>
          <Typography variant="body2" align="center" mb={1} color="secondary">
            ⚙️ Обработка и векторизация
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={processingProgress} 
            color="secondary"
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" align="center" mt={1}>
            {processingProgress}%
          </Typography>
          {currentProcessingStep && (
            <Typography variant="caption" align="center" display="block" mt={1} color="text.secondary">
              {currentProcessingStep}
            </Typography>
          )}
        </Box>
      )}

      {/* Сообщения об ошибках */}
      {errorMessage && (
        <Box sx={{ mt: 2, maxWidth: 600 }}>
          <Typography variant="body2" color="error" align="center">
            ❌ {errorMessage}
          </Typography>
        </Box>
      )}
      
      {/* Сообщения об успехе */}
      {successMessage && (
        <Box sx={{ mt: 2, maxWidth: 600 }}>
          <Typography variant="body2" color="success.main" align="center">
            ✅ {successMessage}
          </Typography>
        </Box>
      )}
    </>
  );
};
