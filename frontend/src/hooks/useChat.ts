import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const useChat = (clubId?: string, eventId?: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      if (clubId) {
        socketRef.current?.emit("joinRoom", { roomId: clubId });
      } else if (eventId) {
        socketRef.current?.emit("joinRoom", { roomId: eventId });
      }
    });

    socketRef.current.on("msgToClient", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [clubId, eventId, token]);

  const sendMessage = (content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("msgToServer", {
        roomId: clubId || eventId,
        userId: user?.id,
        content,
        type: clubId ? "club" : "event",
      });
    }
  };

  return { messages, sendMessage, isConnected };
};
