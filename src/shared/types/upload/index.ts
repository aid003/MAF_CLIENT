// Типы для Socket.IO событий загрузки
export interface UploadProgressData {
  type: 'file_start' | 'processing_start' | 'file_complete' | 'all_complete' | 'vector_start' | 'vector_progress' | 'vector_complete' | 'vector_error';
  filename?: string;
  fileIndex?: number;
  totalFiles?: number;
  progress?: number;
  message?: string;
}

// Типы для ответа сервера
export interface UploadResponse {
  message?: string;
  supportsProgress?: boolean;
  filesCount?: number;
}

// Состояние прогресса загрузки
export interface UploadProgressState {
  isUploading: boolean;
  uploadProgress: number;
  processingProgress: number;
  isProcessing: boolean;
  currentProcessingStep: string;
  errorMessage: string | null;
  successMessage: string | null;
  isRealTimeProcessing: boolean;
}

// Состояние для сохранения в localStorage
export interface SavedProgressState {
  isProcessing: boolean;
  processingProgress: number;
  currentProcessingStep: string;
  isRealTimeProcessing: boolean;
  timestamp: number;
}

// Конфигурация загрузки
export interface UploadConfig {
  uploadUrl: string;
  socketUrl: string;
  maxFileSize?: number;
  acceptedFileTypes?: Record<string, string[]>;
}

// Результат обработки файла
export interface FileProcessingResult {
  filename: string;
  status: 'success' | 'error';
  message: string;
}