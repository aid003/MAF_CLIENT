import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, useTheme } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileRejection } from 'react-dropzone';

interface UploadDropzoneProps {
  onDrop: (files: File[]) => void;
  onDropRejected: (fileRejections: FileRejection[]) => void;
  disabled?: boolean;
  acceptedFiles?: File[];
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onDrop,
  onDropRejected,
  disabled = false,
  acceptedFiles = [],
}) => {
  const theme = useTheme();

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    noClick: true,
    noKeyboard: true,
    disabled,
    accept: {
      'application/pdf': [],
    },
  });

  const filesList = acceptedFiles.map((file) => (
    <li key={file.name}>{file.name}</li>
  ));

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: 2,
          p: 6,
          mt: 3,
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          '&:hover': {
            backgroundColor: disabled ? 'transparent' : theme.palette.action.hover,
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
        disabled={disabled}
      >
        Выбрать файл
      </Button>

      {acceptedFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Вы выбрали:</Typography>
          <ul>{filesList}</ul>
        </Box>
      )}
    </>
  );
};
