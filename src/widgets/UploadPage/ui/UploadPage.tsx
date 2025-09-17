"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { FileRejection } from "react-dropzone";
import { useUploadProgress, useFileUpload } from "../../../features/upload/model";
import { UploadDropzone, UploadProgress } from "../../upload/ui";
import { UploadResponse } from "../../../shared/types/upload";

export default function UploadPage() {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  
  // Используем хук для управления состоянием загрузки
  const uploadProgress = useUploadProgress();
  
  // Инициализируем Socket.IO при монтировании
  useEffect(() => {
    uploadProgress.restoreProgressState();
    uploadProgress.initializeSocket();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Используем хук для обработки загрузки файлов
  const fileUpload = useFileUpload({
    onUploadStart: uploadProgress.startUpload,
    onUploadProgress: uploadProgress.setUploadProgress,
    onUploadComplete: (response: UploadResponse) => {
      uploadProgress.saveProgressState();
    },
    onProcessingStart: uploadProgress.startProcessing,
    onError: uploadProgress.setError,
    onReset: uploadProgress.reset,
    getSocketId: uploadProgress.getSocketId,
    startFallbackTimer: uploadProgress.startFallbackTimer,
    stopFallbackTimer: uploadProgress.stopFallbackTimer,
  });

  // Обработчики для drag & drop
  const handleFileDrop = (files: File[]) => {
    setAcceptedFiles(files);
    fileUpload.handleFileDrop(files);
  };

  const handleFileRejected = (fileRejections: FileRejection[]) => {
    fileUpload.handleFileRejected(fileRejections);
  };


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

      <UploadDropzone
        onDrop={handleFileDrop}
        onDropRejected={handleFileRejected}
        disabled={uploadProgress.isUploading || uploadProgress.isProcessing}
        acceptedFiles={acceptedFiles}
      />

      <UploadProgress
        isUploading={uploadProgress.isUploading}
        uploadProgress={uploadProgress.uploadProgress}
        isProcessing={uploadProgress.isProcessing}
        processingProgress={uploadProgress.processingProgress}
        currentProcessingStep={uploadProgress.currentProcessingStep}
        errorMessage={uploadProgress.errorMessage}
        successMessage={uploadProgress.successMessage}
      />
    </Box>
  );
}
