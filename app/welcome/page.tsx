"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { unlockAudio, zoeSpeak } from "@/lib/zoe";

export default function WelcomePage() {
  const { invited, visitorName, hasEnteredStore, markEnteredStore } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Not invited at all → back to invitation
    if (!invited) {
      router.push("/");
      return;
    }
    // Already unlocked this session → skip straight to store
    if (sessionStorage.getItem("audioUnlocked") === "1") {
      router.push("/store");
    }
  }, [mounted, invited, router]);

  const handleEnter = () => {
    unlockAudio();
    sessionStorage.setItem("audioUnlocked", "1");
    if (hasEnteredStore) {
      zoeSpeak(`Welcome back ${visitorName}! So happy to see you again! I have some great things waiting for you.`);
    } else {
      zoeSpeak(`Hi ${visitorName}! I'm so happy you're here! I've been waiting for you. Let me show you around my store and find you the perfect free gift!`);
      markEnteredStore();
    }
    router.push("/store");
  };

  if (!mounted || !invited) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 1, 0.1], scale: [1, 1.8, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm text-center"
      >
        {/* Zoé photo — big and glowing */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto mb-6 w-36 h-36"
        >
          {/* Glow ring */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-pink-400/30 blur-xl"
          />
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/zoe.jpg"
              alt="Zoé"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-6xl">🧚</div>';
              }}
            />
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-white/70 text-lg mb-1">{hasEnteredStore ? "Welcome back," : "Welcome,"}</p>
          <h1 className="text-5xl font-bold text-white mb-2">{visitorName}!</h1>
          <p className="text-purple-200 text-base mb-8">
            I&apos;ve been waiting for you 🎁<br />
            <span className="text-sm text-purple-300">Zoé&apos;s Secret Store is just for you ✨</span>
          </p>
        </motion.div>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-5 rounded-2xl text-xl shadow-2xl"
          >
            Enter Zoé&apos;s Store ✨
          </motion.button>
          <p className="text-white/30 text-xs mt-4">Tap to enter and hear Zoé&apos;s welcome 🔊</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
