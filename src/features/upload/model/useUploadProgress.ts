import { useState, useCallback, useRef, useEffect } from 'react';
import { UploadProgressState, UploadProgressData, SavedProgressState, UploadResponse } from '../../../shared/types/upload';
import { UploadSocketHandler, UploadProgressStorage } from '../../../shared/services/upload/UploadSocketHandler';

export const useUploadProgress = () => {
  const [state, setState] = useState<UploadProgressState>({
    isUploading: false,
    uploadProgress: 0,
    processingProgress: 0,
    isProcessing: false,
    currentProcessingStep: "",
    errorMessage: null,
    successMessage: null,
    isRealTimeProcessing: false,
  });

  const socketHandlerRef = useRef<UploadSocketHandler | null>(null);
  const uploadFallbackTimerRef = useRef<number | null>(null);
  const lastUploadProgressTsRef = useRef<number>(0);

  // Обработчик прогресса от Socket.IO
  const handleProgress = useCallback((data: UploadProgressData) => {
    console.log("Обрабатываем событие:", data.type);
    
    switch (data.type) {
      case "file_start":
        const fileProgress = data.totalFiles && data.totalFiles > 1 
          ? `Файл ${data.fileIndex || 0}/${data.totalFiles || 0}: ${data.filename || 'неизвестный'}`
          : `Начинаю обработку файла ${data.filename || 'неизвестный'}`;
        
        setState(prev => ({
          ...prev,
          currentProcessingStep: fileProgress,
          processingProgress: data.progress || 0,
          isRealTimeProcessing: true,
        }));
        
        // Останавливаем фолбэк таймер
        if (uploadFallbackTimerRef.current) {
          clearInterval(uploadFallbackTimerRef.current);
          uploadFallbackTimerRef.current = null;
        }
        break;

      case "processing_start":
        setState(prev => ({
          ...prev,
          currentProcessingStep: data.message || "Начинаю обработку...",
        }));
        break;

      case "file_complete":
        const completeMessage = data.totalFiles && data.totalFiles > 1
          ? `✅ Файл ${data.fileIndex || 0}/${data.totalFiles || 0} завершен: ${data.filename || 'неизвестный'}`
          : `✅ Файл ${data.filename || 'неизвестный'} обработан`;
        
        setState(prev => ({
          ...prev,
          currentProcessingStep: completeMessage,
          processingProgress: data.progress || 0,
        }));
        break;

      case "all_complete":
        setState(prev => ({
          ...prev,
          processingProgress: 100,
          currentProcessingStep: "Обработка завершена!",
          successMessage: data.message || "Обработка завершена успешно!",
          isRealTimeProcessing: false,
        }));
        
        // Очищаем сохраненное состояние
        UploadProgressStorage.clearState();
        lastUploadProgressTsRef.current = Date.now();
        break;

      case "vector_start":
        const vectorMessage = data.filename 
          ? `📚 Загружаю "${data.filename}" в векторную базу данных...`
          : "Начинаю загрузку в векторную базу данных...";
        
        setState(prev => ({
          ...prev,
          currentProcessingStep: vectorMessage,
        }));
        break;

      case "vector_progress":
        setState(prev => ({
          ...prev,
          currentProcessingStep: data.message || "Загружаю в векторную базу данных...",
          processingProgress: data.progress !== undefined ? data.progress : prev.processingProgress,
        }));
        lastUploadProgressTsRef.current = Date.now();
        break;

      case "vector_complete":
        setState(prev => ({
          ...prev,
          currentProcessingStep: data.message || "Загрузка в векторную базу данных завершена",
          processingProgress: data.progress !== undefined ? data.progress : prev.processingProgress,
        }));
        lastUploadProgressTsRef.current = Date.now();
        break;

      case "vector_error":
        setState(prev => ({
          ...prev,
          currentProcessingStep: data.message || "Ошибка при загрузке в векторную базу данных",
          errorMessage: data.message || "Ошибка при загрузке в векторную базу данных",
        }));
        break;

      default:
        console.log("Неизвестный тип события:", data.type);
    }
  }, []);

  // Обработчик подключения Socket.IO
  const handleSocketConnect = useCallback((socketId: string) => {
    console.log("Socket подключен с ID:", socketId);
  }, []);

  // Обработчик отключения Socket.IO
  const handleSocketDisconnect = useCallback(() => {
    console.log("Socket отключен");
  }, []);

  // Инициализация Socket.IO
  const initializeSocket = useCallback(() => {
    // Проверяем, не подключен ли уже сокет
    if (socketHandlerRef.current?.isConnected()) {
      console.log("Socket уже подключен, пропускаем инициализацию");
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5041";
    console.log("Подключаемся к Socket.IO:", socketUrl);
    
    // Отключаем предыдущее соединение, если оно есть
    if (socketHandlerRef.current) {
      socketHandlerRef.current.disconnect();
    }
    
    socketHandlerRef.current = new UploadSocketHandler(
      handleProgress,
      handleSocketConnect,
      handleSocketDisconnect
    );
    
    socketHandlerRef.current.connect(socketUrl);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Восстановление состояния из localStorage
  const restoreProgressState = useCallback(() => {
    const savedState = UploadProgressStorage.restoreState();
    if (savedState) {
      setState(prev => ({
        ...prev,
        isProcessing: savedState.isProcessing,
        processingProgress: savedState.processingProgress,
        currentProcessingStep: savedState.currentProcessingStep,
        isRealTimeProcessing: savedState.isRealTimeProcessing,
      }));
    }
  }, []);

  // Сохранение состояния в localStorage
  const saveProgressState = useCallback(() => {
    const stateToSave: SavedProgressState = {
      isProcessing: state.isProcessing,
      processingProgress: state.processingProgress,
      currentProcessingStep: state.currentProcessingStep,
      isRealTimeProcessing: state.isRealTimeProcessing,
      timestamp: Date.now(),
    };
    UploadProgressStorage.saveState(stateToSave);
  }, [state.isProcessing, state.processingProgress, state.currentProcessingStep, state.isRealTimeProcessing]);

  // Обработка видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Страница стала видимой, проверяем соединение Socket.IO");
        if (socketHandlerRef.current && !socketHandlerRef.current.isConnected()) {
          console.log("Socket.IO не подключен, переподключаемся...");
          initializeSocket();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socketHandlerRef.current) {
        socketHandlerRef.current.disconnect();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Функции для управления состоянием
  const startUpload = useCallback(() => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      processingProgress: 0,
      isProcessing: false,
      currentProcessingStep: "",
      errorMessage: null,
      successMessage: null,
      isRealTimeProcessing: false,
    }));
  }, []);

  const setUploadProgress = useCallback((progress: number) => {
    setState(prev => ({
      ...prev,
      uploadProgress: progress,
    }));
    lastUploadProgressTsRef.current = Date.now();
  }, []);

  const startProcessing = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      isUploading: false,
      isProcessing: true,
      uploadProgress: 100,
      currentProcessingStep: message,
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      errorMessage: error,
      isUploading: false,
      isProcessing: false,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      errorMessage: null,
    }));
  }, []);

  const clearSuccess = useCallback(() => {
    setState(prev => ({
      ...prev,
      successMessage: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      processingProgress: 0,
      isProcessing: false,
      currentProcessingStep: "",
      errorMessage: null,
      successMessage: null,
      isRealTimeProcessing: false,
    });
    
    if (uploadFallbackTimerRef.current) {
      clearInterval(uploadFallbackTimerRef.current);
      uploadFallbackTimerRef.current = null;
    }
  }, []);

  // Фолбэк таймер для плавного прогресса
  const startFallbackTimer = useCallback(() => {
    lastUploadProgressTsRef.current = Date.now();
    if (uploadFallbackTimerRef.current === null) {
      uploadFallbackTimerRef.current = window.setInterval(() => {
        const idleMs = Date.now() - lastUploadProgressTsRef.current;
        if (idleMs > 2000) {
          setState(prev => ({
            ...prev,
            uploadProgress: prev.uploadProgress < 95 ? prev.uploadProgress + 1 : prev.uploadProgress,
          }));
          lastUploadProgressTsRef.current = Date.now();
        }
      }, 1000);
    }
  }, []);

  const stopFallbackTimer = useCallback(() => {
    if (uploadFallbackTimerRef.current !== null) {
      clearInterval(uploadFallbackTimerRef.current);
      uploadFallbackTimerRef.current = null;
    }
  }, []);

  return {
    // Состояние
    ...state,
    
    // Функции управления
    startUpload,
    setUploadProgress,
    startProcessing,
    setError,
    clearError,
    clearSuccess,
    reset,
    
    // Socket.IO
    initializeSocket,
    getSocketId: () => socketHandlerRef.current?.getSocketId() || null,
    isSocketConnected: () => socketHandlerRef.current?.isConnected() || false,
    
    // Таймеры
    startFallbackTimer,
    stopFallbackTimer,
    
    // Сохранение состояния
    saveProgressState,
    restoreProgressState,
  };
};
