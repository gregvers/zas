"use client";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { zoeSpeak, unlockAudio } from "@/lib/zoe";

function InvitationContent() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"name" | "welcome">("name");
  const { setInvited, invited } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-login from URL ?name=Emma
  useEffect(() => {
    const urlName = searchParams.get("name");
    if (urlName && urlName.trim().length >= 2) {
      setInvited(urlName.trim());
      router.push("/store");
    }
  }, [searchParams, setInvited, router]);

  // Already invited — skip to store
  useEffect(() => {
    if (invited) router.push("/store");
  }, [invited, router]);

  // Welcome animation then redirect
  useEffect(() => {
    if (step === "welcome") {
      zoeSpeak(
        `Welcome ${name}! I'm Zoé, your personal guide today. I'm so excited to show you around! Let's go explore the store and find your perfect free gift!`
      );
      const t = setTimeout(() => {
        setInvited(name);
        router.push("/store");
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [step, name, setInvited, router]);

  const handleName = () => {
    unlockAudio();
    if (name.trim().length < 2) {
      setError("Please enter your name!");
      return;
    }
    setError("");
    setStep("welcome");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Zoé intro */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white/40 shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/zoe.jpg"
              alt="Zoé"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-5xl">🧚</div>';
              }}
            />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Zoé&apos;s Secret Store</h1>
          <p className="text-purple-200 text-base mt-2 max-w-xs mx-auto leading-relaxed">
            Hi! I&apos;m Zoé 👋 I hand-pick every item in my store myself.
            <br />
            <span className="text-purple-300 text-sm">By invitation only ✨</span>
          </p>
        </div>

        {/* Card */}
        <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {step === "name" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-white font-bold text-lg">Welcome! You&apos;re invited!</p>
                <p className="text-white/70 text-sm mt-1">
                  What&apos;s your name? Zoé would love to greet you properly.
                </p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleName()}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-center text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25"
                  autoFocus
                />
                {error && <p className="text-pink-300 text-sm text-center">{error}</p>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleName}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl text-lg shadow-lg"
                >
                  Meet Zoé! 🧚
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === "welcome" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
                className="text-6xl"
              >
                🧚
              </motion.div>
              <p className="text-white font-bold text-xl">Hi {name}! I&apos;m Zoé!</p>
              <p className="text-white/70">Get ready for something magical...</p>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-400"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <Suspense fallback={null}>
      <InvitationContent />
    </Suspense>
  );
}
