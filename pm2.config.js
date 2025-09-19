module.exports = {
  apps: [
    {
      name: 'maf-frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        HOSTNAME: '0.0.0.0',
        NEXT_PUBLIC_SOCKET_URL: 'http://192.168.63.222',
        NEXT_PUBLIC_UPLOAD_URL: 'http://192.168.63.222/api/uploads'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3005,
        HOSTNAME: '0.0.0.0',
        NEXT_PUBLIC_SOCKET_URL: 'http://localhost:5041',
        NEXT_PUBLIC_UPLOAD_URL: 'http://localhost:5041/api/uploads'
      },
      // Автозапуск при перезагрузке
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Логи
      log_file: '../logs/frontend-combined.log',
      out_file: '../logs/frontend-out.log',
      error_file: '../logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Перезапуск при ошибках
      min_uptime: '10s',
      max_restarts: 10,
      // Игнорировать изменения в этих файлах
      ignore_watch: ['node_modules', '.next', 'logs'],
      // Переменные окружения для разработки
      env_file: '.env'
    }
  ]
};
