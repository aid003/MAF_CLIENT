import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  public connect(url: string): Socket {
    if (!this.socket || !this.socket.connected) {
      console.log("SocketService: Подключаемся к", url);
      this.socket = io(url, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
        withCredentials: true,
        autoConnect: true,
        path: "/socket.io/",
        upgrade: true,
        rememberUpgrade: true,
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionAttempts: 5,
      });

      // Добавляем логирование событий
      this.socket.on("connect", () => {
        console.log("SocketService: Подключен с ID:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("SocketService: Отключен. Причина:", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("SocketService: Ошибка подключения:", error);
      });
    }
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  public on<T>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback);
  }

  public off<T>(event: string, callback?: (data: T) => void): void {
    this.socket?.off(event, callback);
  }

  public emit<T>(event: string, data?: T): void {
    this.socket?.emit(event, data);
  }

  public reconnect(): void {
    if (this.socket) {
      console.log("SocketService: Принудительное переподключение");
      this.socket.disconnect();
      this.socket.connect();
    }
  }
}

// Экспортируем именованный объект вместо анонимного
export const socketService = new SocketService();
