"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zoeSpeak, zoeStop } from "@/lib/zoe";

type Props = {
  message: string;
  autoSpeak?: boolean;
  premium?: boolean;
};

export default function ZoeBubble({ message, autoSpeak = true, premium = false }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message || !autoSpeak) return;

    setSpeaking(true);
    zoeSpeak(message, premium);

    // Show speaking indicator for estimated duration
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSpeaking(false), message.length * 55);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      zoeStop();
    };
  }, [message, autoSpeak]);

  if (!message) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 pointer-events-none"
      >
        {/* Zoé avatar */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={speaking ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ repeat: speaking ? Infinity : 0, duration: 0.55 }}
            className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zoe.jpg" alt="Zoé" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).parentElement!.innerHTML='<div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-2xl">🧚</div>'; }} />
          </motion.div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
        </div>

        {/* Speech bubble */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-3 shadow-xl max-w-sm pointer-events-auto"
          style={{ border: "2px solid rgba(168,85,247,0.3)" }}
        >
          <p className="text-sm font-medium text-gray-800 leading-relaxed">{message}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-purple-500 font-semibold">Zoé</span>
            {speaking && (
              <span className="flex gap-0.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-2 rounded-full bg-purple-400 inline-block"
                    animate={{ scaleY: [0.4, 1.4, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.12 }}
                  />
                ))}
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
