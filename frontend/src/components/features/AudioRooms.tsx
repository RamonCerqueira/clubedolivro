"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Users, Volume2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

interface AudioRoomsProps {
  clubId: string;
}

interface AudioUser {
  socketId: string;
  userId: string;
  username: string;
  isMuted?: boolean;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const AudioRooms: React.FC<AudioRoomsProps> = ({ clubId }) => {
  const { user, token } = useAuthStore();
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeUsers, setActiveUsers] = useState<AudioUser[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const audioElementsRef = useRef<{ [socketId: string]: HTMLAudioElement }>({});

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  };

  useEffect(() => {
    // Limpeza ao desmontar componente
    return () => {
      disconnectAudio();
    };
  }, []);

  const initSocket = () => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      if (user) {
        socketRef.current?.emit("joinAudioRoom", {
          roomId: clubId,
          userId: user.id,
          username: user.username
        });
      }
    });

    // Quando outro usuário entra na sala
    socketRef.current.on("userJoinedAudio", async (data: { socketId: string, userId: string, username: string }) => {
      console.log("Outro usuário entrou no canal de voz:", data);
      
      // Adicionar usuário à lista
      setActiveUsers(prev => {
        if (prev.some(u => u.socketId === data.socketId)) return prev;
        return [...prev, data];
      });

      // Se eu já estiver na sala, eu inicio a conexão WebRTC com quem acabou de entrar (oferta)
      if (localStreamRef.current) {
        const peer = createPeer(data.socketId, localStreamRef.current);
        peersRef.current[data.socketId] = peer;

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socketRef.current?.emit("audioSignal", {
          toSocketId: data.socketId,
          signal: offer,
          userId: user?.id,
          username: user?.username
        });
      }
    });

    // Quando um usuário sai da sala
    socketRef.current.on("userLeftAudio", (data: { socketId: string, userId: string }) => {
      console.log("Usuário saiu do canal de voz:", data);
      
      // Remover usuário da lista
      setActiveUsers(prev => prev.filter(u => u.socketId !== data.socketId));
      
      // Fechar conexão peer
      if (peersRef.current[data.socketId]) {
        peersRef.current[data.socketId].close();
        delete peersRef.current[data.socketId];
      }

      // Remover elemento de áudio
      if (audioElementsRef.current[data.socketId]) {
        audioElementsRef.current[data.socketId].pause();
        audioElementsRef.current[data.socketId].remove();
        delete audioElementsRef.current[data.socketId];
      }
    });

    // Sinal WebRTC recebido
    socketRef.current.on("audioSignalReceived", async (data: { fromSocketId: string, signal: any, userId: string, username: string }) => {
      const { fromSocketId, signal, userId, username } = data;

      // Garantir que o usuário esteja na lista ativa
      setActiveUsers(prev => {
        if (prev.some(u => u.socketId === fromSocketId)) return prev;
        return [...prev, { socketId: fromSocketId, userId, username }];
      });

      if (signal.type === "offer") {
        console.log("Recebida oferta WebRTC de:", username);
        const peer = createPeer(fromSocketId, localStreamRef.current!);
        peersRef.current[fromSocketId] = peer;

        await peer.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socketRef.current?.emit("audioSignal", {
          toSocketId: fromSocketId,
          signal: answer,
          userId: user?.id,
          username: user?.username
        });
      } else if (signal.type === "answer") {
        console.log("Recebida resposta WebRTC de:", username);
        const peer = peersRef.current[fromSocketId];
        if (peer) {
          await peer.setRemoteDescription(new RTCSessionDescription(signal));
        }
      } else if (signal.candidate) {
        console.log("Recebido ICE Candidate de:", username);
        const peer = peersRef.current[fromSocketId];
        if (peer) {
          await peer.addIceCandidate(new RTCIceCandidate(signal));
        }
      }
    });
  };

  const createPeer = (socketId: string, stream: MediaStream): RTCPeerConnection => {
    const peer = new RTCPeerConnection(iceServers);

    // Adicionar faixas locais ao peer
    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream);
    });

    // Quando receber faixas remotas
    peer.ontrack = (event) => {
      console.log("Recebida faixa de áudio remota para o socket:", socketId);
      const remoteStream = event.streams[0];
      
      let audio = audioElementsRef.current[socketId];
      if (!audio) {
        audio = document.createElement("audio");
        audio.autoplay = true;
        audio.style.display = "none";
        document.body.appendChild(audio);
        audioElementsRef.current[socketId] = audio;
      }
      
      audio.srcObject = remoteStream;
      audio.play().catch(e => console.error("Erro ao reproduzir áudio do peer", e));
    };

    // Enviar candidatos ICE
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("audioSignal", {
          toSocketId: socketId,
          signal: event.candidate,
          userId: user?.id,
          username: user?.username
        });
      }
    };

    return peer;
  };

  const connectAudio = async () => {
    try {
      console.log("Iniciando conexão de áudio...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      // Iniciar WebSocket e conectar
      initSocket();
      setIsInRoom(true);

      // Adicionar a si mesmo à lista ativa (com socketId provisório 'me')
      if (user) {
        setActiveUsers([{ socketId: "me", userId: user.id, username: user.username }]);
      }
    } catch (err) {
      console.error("Erro ao obter mídia local de áudio:", err);
      alert("Microfone não disponível ou permissão negada.");
    }
  };

  const disconnectAudio = () => {
    console.log("Desconectando do canal de voz...");
    
    // Sair do socket
    if (socketRef.current) {
      if (user) {
        socketRef.current.emit("leaveAudioRoom", { roomId: clubId, userId: user.id });
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Parar tracks de áudio locais
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Fechar todas as conexões peer
    Object.keys(peersRef.current).forEach(socketId => {
      peersRef.current[socketId].close();
    });
    peersRef.current = {};

    // Remover todos os elementos de áudio
    Object.keys(audioElementsRef.current).forEach(socketId => {
      audioElementsRef.current[socketId].pause();
      audioElementsRef.current[socketId].remove();
    });
    audioElementsRef.current = {};

    setActiveUsers([]);
    setIsInRoom(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  return (
    <div className="glass-card p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
      {/* Background glow effects */}
      <div className="absolute -right-24 -top-24 w-48 h-48 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-secondary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-secondary/20 transition-all duration-700" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-md font-display font-bold text-white flex items-center gap-2">
            <Volume2 className={cn("w-5 h-5", isInRoom ? "text-primary animate-pulse" : "text-neutral-400")} />
            Roda de Conversa por Voz
          </h4>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            {isInRoom ? "Você está conectado!" : "Conecte-se com outros leitores"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-neutral-400 uppercase tracking-widest">
          <Users size={12} className="text-secondary" />
          <span>{isInRoom ? activeUsers.length : 0} online</span>
        </div>
      </div>

      {!isInRoom ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-4 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Phone size={24} className="text-primary" />
          </div>
          <p className="text-sm text-neutral-400 mb-6 max-w-xs leading-relaxed">
            Entre na chamada de voz em tempo real do clube para debater capítulos e compartilhar insights de leitura!
          </p>
          <Button
            onClick={connectAudio}
            className="w-full rounded-2xl h-12 bg-gradient-to-r from-primary to-secondary text-white font-black hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            ENTRAR NA CHAMADA
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Users Mesh Visual */}
          <div className="flex flex-wrap gap-4 items-center justify-center py-4 bg-black/40 rounded-2xl border border-white/5 min-h-[100px]">
            {activeUsers.map(u => (
              <div key={u.socketId} className="flex flex-col items-center space-y-1.5 p-2 relative">
                {/* Voice Pulse Effect */}
                <div className={cn(
                  "absolute inset-0.5 rounded-full blur-[8px] opacity-0 transition-opacity duration-300 pointer-events-none",
                  u.socketId === "me" && isMuted ? "" : "bg-primary/20 opacity-100 animate-pulse"
                )} />

                <div className="relative">
                  <Avatar user={{ name: u.username }} size="md" className={cn(
                    "border-2 transition-all duration-300",
                    u.socketId === "me" 
                      ? isMuted ? "border-red-500/50" : "border-primary" 
                      : "border-secondary"
                  )} />
                  
                  {u.socketId === "me" && isMuted && (
                    <div className="absolute -bottom-1 -right-1 bg-red-600 border border-black p-1 rounded-full text-white">
                      <MicOff size={10} />
                    </div>
                  )}
                </div>
                
                <span className="text-[11px] font-bold text-neutral-300 max-w-[80px] truncate text-center leading-none">
                  {u.username} {u.socketId === "me" ? "(Você)" : ""}
                </span>
              </div>
            ))}
          </div>

          {/* Call Controls */}
          <div className="flex gap-3">
            <Button
              onClick={toggleMute}
              variant="ghost"
              className={cn(
                "flex-1 h-12 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all",
                isMuted 
                  ? "bg-red-950/40 text-red-400 border-red-500/20 hover:bg-red-950/60" 
                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
              )}
            >
              {isMuted ? (
                <>
                  <MicOff size={16} /> DESMUTADO
                </>
              ) : (
                <>
                  <Mic size={16} /> MUTAR
                </>
              )}
            </Button>
            <Button
              onClick={disconnectAudio}
              className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
              <PhoneOff size={16} /> DESCONECTAR
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
