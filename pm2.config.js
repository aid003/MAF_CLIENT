module.exports = {
  apps: [
    {
      name: 'maf-frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
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
