"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AudioRecorderProps {
  onAudioReady: (base64Audio: string) => void;
  onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [base64Data, setBase64Data] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Efeito para contar o tempo de gravação
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setAudioUrl(null);
    setBase64Data(null);
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Converter para Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setBase64Data(base64);
        };

        // Parar todos os tracks do stream para desligar o microfone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone", err);
      alert("Não foi possível acessar o microfone. Verifique as permissões do seu navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleConfirm = () => {
    if (base64Data) {
      onAudioReady(base64Data);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900 border border-white/5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">Gravador de Insights</span>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-center w-full min-h-[80px]">
        {isRecording ? (
          <div className="flex flex-col items-center space-y-2">
            {/* Ondas Sonoras Animadas em CSS */}
            <div className="flex items-center gap-1.5 h-8">
              {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                <div
                  key={bar}
                  className="w-1 bg-primary rounded-full"
                  style={{
                    height: "100%",
                    animation: `pulse-bar 1.2s ease-in-out infinite alternate`,
                    animationDelay: `${bar * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-red-500 animate-pulse">{formatTime(recordingTime)} • Gravando</span>
          </div>
        ) : audioUrl ? (
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayback}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Mensagem de Voz Gravada</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Pronta para envio</span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-zinc-500 font-bold">Clique abaixo para iniciar seu microfone</span>
        )}
      </div>

      <div className="flex items-center gap-3 w-full pt-2">
        {isRecording ? (
          <Button
            onClick={stopRecording}
            fullWidth
            className="rounded-xl h-12 bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2"
          >
            <Square size={16} /> PARAR E SALVAR
          </Button>
        ) : audioUrl ? (
          <>
            <Button
              onClick={startRecording}
              className="rounded-xl h-12 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 font-bold flex-1"
            >
              GRAVAR NOVAMENTE
            </Button>
            <Button
              onClick={handleConfirm}
              className="rounded-xl h-12 bg-gradient-to-r from-primary to-secondary text-white font-bold flex-1"
            >
              CONFIRMAR ÁUDIO
            </Button>
          </>
        ) : (
          <Button
            onClick={startRecording}
            fullWidth
            className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Mic size={16} /> INICIAR GRAVAÇÃO
          </Button>
        )}
      </div>

      {/* Estilos CSS Inline para a onda sonora */}
      <style jsx>{`
        @keyframes pulse-bar {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
};
