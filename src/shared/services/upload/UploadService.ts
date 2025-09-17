import axios, { AxiosProgressEvent } from 'axios';
import { UploadResponse } from '../../types/upload';

export class UploadService {
  private static readonly DEFAULT_UPLOAD_URL = 'http://localhost:5041/api/uploads';

  public static async uploadFiles(
    files: File[],
    socketId: string | null,
    onProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || this.DEFAULT_UPLOAD_URL;
    
    if (!uploadUrl) {
      throw new Error('Upload URL is not defined');
    }

    console.log('Начинаем загрузку файла на:', uploadUrl);
    console.log('Socket ID:', socketId);

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        'X-Socket-ID': socketId || '',
      },
      onUploadProgress: onProgress,
    });

    console.log('Загрузка завершена:', response.data);
    return response.data;
  }

  public static async simulateProcessingProgress(
    onProgress: (progress: number, message: string) => void
  ): Promise<void> {
    const processingSteps = [
      { progress: 20, message: 'Извлечение текста из PDF...' },
      { progress: 40, message: 'Разбиение на фрагменты...' },
      { progress: 60, message: 'Векторизация текста...' },
      { progress: 80, message: 'Сохранение в базу данных...' },
      { progress: 100, message: 'Обработка завершена!' }
    ];

    for (const step of processingSteps) {
      onProgress(step.progress, step.message);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  public static handleUploadError(error: unknown): string {
    console.error('Ошибка при загрузке:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return 'Ошибка сети. Проверьте, что сервер запущен.';
      } else {
        return error.response?.data?.message || `Ошибка при загрузке файла: ${error.message}`;
      }
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'Произошла неизвестная ошибка';
    }
  }
}
