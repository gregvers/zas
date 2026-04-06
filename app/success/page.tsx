"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useStore } from "@/lib/store";

function SuccessContent() {
  const params = useSearchParams();
  const name = params.get("name") ?? "friend";
  const { clearHearts } = useStore();

  useEffect(() => {
    clearHearts();
  }, [clearHearts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-900 to-violet-950 flex items-center justify-center p-6">
      {/* Floating confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${Math.random() * 100}%`, top: "-10%" }}
            animate={{ y: "110vh", rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
            transition={{ duration: 3 + Math.random() * 3, delay: Math.random() * 2, ease: "linear" }}
          >
            {["🎁", "✨", "🌟", "💝", "🎉", "💫"][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 text-center max-w-sm w-full bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-7xl mb-6"
        >
          🎉
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Thank you, {name}!
        </h1>
        <p className="text-purple-200 text-lg mb-2">
          I'm packing your order right now! 🧚
        </p>
        <p className="text-white/60 text-sm mb-8">
          Check your email for the confirmation. I personally can't wait for you to enjoy your goodies!
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-lg flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zoe.jpg" alt="Zoé" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          </div>
          <p className="text-white/70 text-sm italic">— Zoé, personally packing your order 🎁</p>
        </div>

        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href="/store"
          className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg"
        >
          Back to my Store ✨
        </motion.a>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
