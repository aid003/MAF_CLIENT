import { socketService } from '../../socket/socketService';
import { UploadProgressData, SavedProgressState } from '../../types/upload';

export class UploadSocketHandler {
  private socketId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor(
    private onProgress: (data: UploadProgressData) => void,
    private onConnect: (socketId: string) => void,
    private onDisconnect: () => void
  ) {}

  public connect(socketUrl: string): void {
    const socket = socketService.connect(socketUrl);
    
    socket.on("connect", () => {
      console.log("Socket.IO подключен:", socket.id);
      this.socketId = socket.id || null;
      this.reconnectAttempts = 0;
      if (this.socketId) {
        this.onConnect(this.socketId);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO отключен, причина:", reason);
      this.socketId = null;
      this.onDisconnect();
      
      // Автоматически переподключаемся при разрыве соединения
      if (reason === "io server disconnect" || reason === "io client disconnect") {
        this.handleReconnect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Ошибка подключения Socket.IO:", error);
      this.handleReconnect();
    });

    // Слушаем события прогресса загрузки
    socket.on("upload_progress", (data: UploadProgressData) => {
      console.log("Получен прогресс загрузки:", data);
      this.onProgress(data);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5041";
        this.connect(socketUrl);
      }, this.reconnectDelay);
    } else {
      console.error("Превышено максимальное количество попыток переподключения");
    }
  }

  public getSocketId(): string | null {
    return this.socketId;
  }

  public isConnected(): boolean {
    return socketService.isConnected();
  }

  public disconnect(): void {
    socketService.disconnect();
    this.socketId = null;
  }

  public reconnect(): void {
    socketService.reconnect();
  }
}

// Утилиты для работы с localStorage
export class UploadProgressStorage {
  private static readonly STORAGE_KEY = 'uploadProgress';
  private static readonly MAX_AGE = 10 * 60 * 1000; // 10 минут

  public static saveState(state: SavedProgressState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Ошибка при сохранении состояния:", error);
    }
  }

  public static restoreState(): SavedProgressState | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved) as SavedProgressState;
        // Проверяем возраст сохраненного состояния
        if (Date.now() - state.timestamp < this.MAX_AGE) {
          console.log("Восстановлено состояние прогресса из localStorage");
          return state;
        } else {
          this.clearState();
        }
      }
    } catch (error) {
      console.error("Ошибка при восстановлении состояния:", error);
      this.clearState();
    }
    return null;
  }

  public static clearState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Ошибка при очистке состояния:", error);
    }
  }
}
