import { useCallback } from 'react';
import { FileRejection } from 'react-dropzone';
import { UploadService } from '../../../shared/services/upload/UploadService';
import { UploadResponse } from '../../../shared/types/upload';

interface UseFileUploadProps {
  onUploadStart: () => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (response: UploadResponse) => void;
  onProcessingStart: (message: string) => void;
  onError: (error: string) => void;
  onReset: () => void;
  getSocketId: () => string | null;
  startFallbackTimer: () => void;
  stopFallbackTimer: () => void;
}

export const useFileUpload = ({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onProcessingStart,
  onError,
  onReset,
  getSocketId,
  startFallbackTimer,
  stopFallbackTimer,
}: UseFileUploadProps) => {
  
  const handleFileDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    onReset();
    onUploadStart();

    try {
      // Запускаем фолбэк таймер
      startFallbackTimer();

      // Загружаем файлы на сервер
      const response = await UploadService.uploadFiles(
        acceptedFiles,
        getSocketId(),
        (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          } else {
            // Если total недоступен, плавно увеличиваем прогресс, но не выше 95%
            // Это будет обработано в хуке useUploadProgress
          }
        }
      );

      // Останавливаем фолбэк таймер
      stopFallbackTimer();

      // Начинаем обработку
      onProcessingStart('Файлы загружены, начинаю обработку...');

      // Проверяем, поддерживает ли сервер реальный прогресс
      const supportsRealTimeProgress = response?.supportsProgress || false;
      
      if (!supportsRealTimeProgress) {
        // Если сервер не поддерживает реальный прогресс, симулируем его
        await UploadService.simulateProcessingProgress(
          (progress, message) => {
            onUploadProgress(progress);
            onProcessingStart(message);
          }
        );
      }

      onUploadComplete(response);

    } catch (error) {
      stopFallbackTimer();
      const errorMessage = UploadService.handleUploadError(error);
      onError(errorMessage);
    }
  }, [
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onProcessingStart,
    onError,
    onReset,
    getSocketId,
    startFallbackTimer,
    stopFallbackTimer,
  ]);

  const handleFileRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors = fileRejections
      .map((rejection) => rejection.errors.map((e) => e.message).join(', '))
      .join('; ');
    onError(`Некоторые файлы не прошли проверку: ${errors}`);
  }, [onError]);

  return {
    handleFileDrop,
    handleFileRejected,
  };
};
