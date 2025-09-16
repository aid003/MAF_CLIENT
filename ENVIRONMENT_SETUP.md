# Настройка переменных окружения для клиента

## Обязательные переменные

### NEXT_PUBLIC_UPLOAD_URL
URL для загрузки файлов на сервер.
```bash
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5041/api/uploads
```

## Опциональные переменные

### NEXT_PUBLIC_SOCKET_URL
URL Socket.IO сервера для получения реального прогресса обработки файлов.
```bash
NEXT_PUBLIC_SOCKET_URL=http://localhost:5041
```

## Настройка для разных бэкендов

### Для текущего бэкенда (KAF_BACKEND)
```bash
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5041/api/uploads
NEXT_PUBLIC_SOCKET_URL=http://localhost:5041
```

### Для другого бэкенда
```bash
NEXT_PUBLIC_UPLOAD_URL=https://your-backend.com/api/upload
NEXT_PUBLIC_SOCKET_URL=https://your-backend.com
```

## Логика работы

1. **Загрузка файла**: Клиент отправляет файл на `NEXT_PUBLIC_UPLOAD_URL` и отслеживает прогресс загрузки
2. **Обработка файла**: 
   - Если сервер поддерживает реальный прогресс (возвращает `supportsProgress: true`), клиент использует Socket.IO
   - Иначе используется симуляция прогресса обработки
3. **Независимость от бэкенда**: Клиент автоматически адаптируется к возможностям сервера

## Поддержка Socket.IO (опционально)

Если ваш бэкенд поддерживает Socket.IO для отслеживания прогресса, он должен:

1. Возвращать в ответе на загрузку:
```json
{
  "message": "Файл успешно обработан",
  "supportsProgress": true
}
```

2. Отправлять Socket.IO события:
```json
// Начало обработки файла
{ 
  "type": "file_start", 
  "filename": "book.pdf", 
  "fileIndex": 1, 
  "totalFiles": 1, 
  "progress": 0 
}

// Начало обработки PDF
{ 
  "type": "processing_start", 
  "filename": "book.pdf", 
  "message": "Начинаю обработку PDF файла..." 
}

// Завершение обработки файла
{ 
  "type": "file_complete", 
  "filename": "book.pdf", 
  "fileIndex": 1, 
  "totalFiles": 1, 
  "progress": 100 
}

// Завершение всей обработки
{ 
  "type": "all_complete", 
  "successCount": 1, 
  "errorCount": 0, 
  "message": "Обработано файлов: 1 успешно, 0 с ошибками" 
}
```
