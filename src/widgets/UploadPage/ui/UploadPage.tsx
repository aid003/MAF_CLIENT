"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { FileRejection } from "react-dropzone";
import { socketService } from "../../../shared/socket/socketService";

// Типы для Socket.IO событий
interface UploadProgressData {
  type: 'file_start' | 'processing_start' | 'file_complete' | 'all_complete';
  filename?: string;
  fileIndex?: number;
  totalFiles?: number;
  progress?: number;
  message?: string;
}

// Типы для ответа сервера
interface UploadResponse {
  message?: string;
  supportsProgress?: boolean;
}

export default function UploadPage() {
  const theme = useTheme();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentProcessingStep, setCurrentProcessingStep] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const socketIdRef = useRef<string | null>(null);
  const uploadFallbackTimerRef = useRef<number | null>(null);
  const lastUploadProgressTsRef = useRef<number>(0);

  // Подключаемся к Socket.IO при монтировании компонента
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5041";
    console.log("Подключаемся к Socket.IO:", socketUrl);
    const socket = socketService.connect(socketUrl);
    
    socket.on("connect", () => {
      console.log("Socket.IO подключен:", socket.id);
      socketIdRef.current = socket.id || null;
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO отключен");
      socketIdRef.current = null;
    });

    // Слушаем события прогресса загрузки
    socket.on("upload_progress", (data: UploadProgressData) => {
      console.log("Получен прогресс загрузки:", data);
      
      switch (data.type) {
        case "file_start":
          setCurrentProcessingStep(`Начинаю обработку файла ${data.filename || 'неизвестный'} (${data.fileIndex || 0}/${data.totalFiles || 0})`);
          setProcessingProgress(data.progress || 0);
          break;
        case "processing_start":
          setCurrentProcessingStep(data.message || "Начинаю обработку...");
          break;
        case "file_complete":
          setCurrentProcessingStep(`Файл ${data.filename || 'неизвестный'} обработан (${data.fileIndex || 0}/${data.totalFiles || 0})`);
          setProcessingProgress(data.progress || 0);
          break;
        case "all_complete":
          setProcessingProgress(100);
          setCurrentProcessingStep("Обработка завершена!");
          setSuccessMessage(data.message || "Обработка завершена успешно!");
          break;
        default:
          console.log("Неизвестный тип события:", data.type);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Функция для симуляции прогресса обработки
  const simulateProcessingProgress = useCallback(async () => {
    const processingSteps = [
      { progress: 20, message: "Извлечение текста из PDF..." },
      { progress: 40, message: "Разбиение на фрагменты..." },
      { progress: 60, message: "Векторизация текста..." },
      { progress: 80, message: "Сохранение в базу данных..." },
      { progress: 100, message: "Обработка завершена!" }
    ];

    for (const step of processingSteps) {
      setProcessingProgress(step.progress);
      setCurrentProcessingStep(step.message);
      await new Promise(resolve => setTimeout(resolve, 500)); // Задержка для демонстрации
    }
  }, []);

  // Функция для обработки реального прогресса от сервера через Socket.IO
  const handleRealTimeProgress = useCallback(async (responseData: UploadResponse) => {
    try {
      // Проверяем, поддерживает ли сервер реальный прогресс
      if (responseData?.supportsProgress && socketIdRef.current) {
        console.log('Используем Socket.IO для отслеживания прогресса');
        // Socket.IO уже подключен и слушает события в useEffect
        // Просто ждем завершения обработки
        return new Promise<void>((resolve) => {
          // События будут обработаны в useEffect
          // Просто ждем некоторое время для демонстрации
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      } else {
        // Если Socket.IO недоступен, используем симуляцию
        console.log('Используем симуляцию прогресса');
        await simulateProcessingProgress();
      }
    } catch (error) {
      console.error('Ошибка при обработке реального прогресса:', error);
      // В случае ошибки используем симуляцию
      await simulateProcessingProgress();
    }
  }, [simulateProcessingProgress]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (acceptedFiles.length === 0) return;

    // Этап 1: Загрузка файла на сервер
    setIsUploading(true);
    setUploadProgress(0);
    setProcessingProgress(0);
    setIsProcessing(false);
    setCurrentProcessingStep("");

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || "http://localhost:5041/api/uploads";
      if (!uploadUrl) {
        throw new Error("Upload URL is not defined");
      }

      // Загрузка файла с отслеживанием прогресса
      console.log("Начинаем загрузку файла на:", uploadUrl);
      console.log("Socket ID:", socketIdRef.current);
      
      // Запускаем фолбэк: если события прогресса не приходят, плавно двигаем до 95%
      lastUploadProgressTsRef.current = Date.now();
      if (uploadFallbackTimerRef.current === null) {
        uploadFallbackTimerRef.current = window.setInterval(() => {
          const idleMs = Date.now() - lastUploadProgressTsRef.current;
          // если 800мс нет новых событий и прогресс < 95 — двигаем на 1%
          if (idleMs > 800) {
            setUploadProgress((prev) => (prev < 95 ? prev + 1 : prev));
            lastUploadProgressTsRef.current = Date.now();
          }
        }, 500);
      }

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'X-Socket-ID': socketIdRef.current || '', // Передаем socket ID для связи с Socket.IO
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            lastUploadProgressTsRef.current = Date.now();
          } else {
            // Если total недоступен, плавно увеличиваем прогресс, но не выше 95%
            setUploadProgress((prev) => {
              const next = Math.min(prev + 1, 95);
              return next;
            });
            lastUploadProgressTsRef.current = Date.now();
          }
        },
      });

      console.log("Загрузка завершена:", response.data);

      // Этап 2: Обработка файла
      setIsUploading(false);
      setIsProcessing(true);
      setUploadProgress(100);

      // Проверяем, поддерживает ли сервер реальный прогресс обработки
      const supportsRealTimeProgress = response.data?.supportsProgress || false;
      
      if (supportsRealTimeProgress) {
        // Если сервер поддерживает реальный прогресс, используем его
        await handleRealTimeProgress(response.data);
      } else {
        // Иначе симулируем прогресс обработки
        await simulateProcessingProgress();
      }

      // Показываем результат
      if (response.data?.message) {
        setSuccessMessage(response.data.message);
      } else {
        setSuccessMessage("Файл успешно обработан и добавлен в базу данных!");
      }

    } catch (error: unknown) {
      console.error("Ошибка при загрузке:", error);
      
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          setErrorMessage("Ошибка сети. Проверьте, что сервер запущен.");
        } else {
          setErrorMessage(
            error.response?.data?.message || `Ошибка при загрузке файла: ${error.message}`
          );
        }
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Произошла неизвестная ошибка");
      }
    } finally {
      if (uploadFallbackTimerRef.current !== null) {
        clearInterval(uploadFallbackTimerRef.current);
        uploadFallbackTimerRef.current = null;
      }
      setIsUploading(false);
      setIsProcessing(false);
    }
  }, [handleRealTimeProgress, simulateProcessingProgress]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors = fileRejections
      .map((rejection) => rejection.errors.map((e) => e.message).join(", "))
      .join("; ");
    setErrorMessage(`Некоторые файлы не прошли проверку: ${errors}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open, acceptedFiles } =
    useDropzone({
      onDrop,
      onDropRejected,
      noClick: true,
      noKeyboard: true,
      accept: {
        "application/pdf": [],
      },
    });

  const filesList = acceptedFiles.map((file) => (
    <li key={file.name}>{file.name}</li>
  ));

  return (
    <Box
      sx={{
        p: 4,
        width: "90vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" textAlign="center">
        Загрузите книги
      </Typography>
      <Typography variant="body1" mt={3} textAlign="center">
        Выберите и перетащите файл вашей книги в выделенную область
        <br />
        или нажмите кнопку ниже
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: 2,
          p: 6,
          mt: 3,
          width: "100%",
          maxWidth: 600,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" color="action" />
        {isDragActive ? (
          <Typography variant="body1" component="p" mt={2}>
            Отпустите файлы, чтобы загрузить
          </Typography>
        ) : (
          <Typography variant="body1" component="p" mt={2}>
            Перетащите файлы сюда
          </Typography>
        )}
        <Typography variant="body2" mt={1} color="text.secondary" component="p">
          Поддерживаемые форматы: PDF
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={open}
        sx={{ mt: 6 }}
        startIcon={<CloudUploadIcon />}
        disabled={isUploading || isProcessing}
      >
        Выбрать файл
      </Button>

      {acceptedFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Вы выбрали:</Typography>
          <ul>{filesList}</ul>
        </Box>
      )}

      {/* Полоска прогресса загрузки файла */}
      {isUploading && (
        <Box sx={{ width: "100%", maxWidth: 600, mt: 3 }}>
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
        <Box sx={{ width: "100%", maxWidth: 600, mt: 3 }}>
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
      {errorMessage && (
        <Box sx={{ mt: 2, maxWidth: 600 }}>
          <Typography variant="body2" color="error" align="center">
            ❌ {errorMessage}
          </Typography>
        </Box>
      )}
      
      {successMessage && (
        <Box sx={{ mt: 2, maxWidth: 600 }}>
          <Typography variant="body2" color="success.main" align="center">
            ✅ {successMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
