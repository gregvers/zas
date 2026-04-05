"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { zoneConfig, type Zone } from "@/lib/products";
import { getHubMessage } from "@/lib/zoe-messages";
import HeartCounter from "@/components/HeartCounter";
import ZoeBubble from "@/components/ZoeBubble";
import FloatingParticles from "@/components/FloatingParticles";

const zones: Zone[] = ["squishy", "slime"];

export default function StorePage() {
  const router = useRouter();
  const { invited, visitorName, hearts, zonesVisited, storeHubVisits, incrementHubVisit } = useStore();
  const [mounted, setMounted] = useState(false);
  const [zoeMsg, setZoeMsg] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!invited) { router.push("/"); return; }

    const msg = getHubMessage(visitorName, zonesVisited, hearts, storeHubVisits);
    setZoeMsg(msg);
    incrementHubVisit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, invited]);

  if (!invited || !mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-900 to-violet-950 relative">
      <FloatingParticles items={["✨", "🌟", "💫", "⭐", "🎁", "💝"]} count={15} />
      <HeartCounter />

      <div className="relative z-10 text-center pt-12 pb-6 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="text-5xl mb-3">🧚</div>
          <h1 className="text-4xl font-bold text-white mb-2">Zoé&apos;s Secret Store</h1>
          <p className="text-purple-300 text-lg">
            {visitorName ? `Welcome to my store, ${visitorName}! 🎁` : "Welcome to my store!"}
          </p>
          {hearts.length > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-pink-300 text-sm mt-2">
              You loved {hearts.length} of my picks so far 💕
            </motion.p>
          )}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone, i) => {
          const cfg = zoneConfig[zone];
          const visited = zonesVisited.includes(zone);
          return (
            <motion.button
              key={zone}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/store/${zone}`)}
              className={`relative overflow-hidden rounded-3xl p-6 text-left bg-gradient-to-br ${cfg.bg} border border-white/20 shadow-xl h-44`}
            >
              <div className="text-5xl mb-3">{cfg.emoji}</div>
              <h2 className="text-xl font-bold text-white">{cfg.label}</h2>
              <p className={`text-sm mt-1 ${cfg.text} opacity-80`}>{cfg.tagline}</p>
              {visited && (
                <div className="absolute top-3 right-3 bg-white/20 rounded-full px-2 py-0.5 text-xs text-white font-medium">✓ visited</div>
              )}
              <div className="absolute bottom-4 right-4 text-white/30 text-2xl">→</div>
            </motion.button>
          );
        })}


        {hearts.length >= 3 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04, y: -4 }}
            onClick={() => router.push("/wishlist")}
            className="relative overflow-hidden rounded-3xl p-6 text-left bg-gradient-to-br from-pink-500 to-red-500 border border-white/20 shadow-xl h-44"
          >
            <div className="text-5xl mb-3">❤️</div>
            <h2 className="text-xl font-bold text-white">My Wish List</h2>
            <p className="text-sm mt-1 text-white/80">{hearts.length} items you love! Choose your free gift</p>
            <div className="absolute bottom-4 right-4 text-white/30 text-2xl">→</div>
          </motion.button>
        )}
      </div>

      {zoeMsg && <ZoeBubble message={zoeMsg} />}
    </div>
  );
}
