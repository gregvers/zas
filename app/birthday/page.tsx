"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";
import ZoeBubble from "@/components/ZoeBubble";

const ageGroups = [
  { label: "5–7 years", emoji: "🐣", value: "5-7" },
  { label: "8–10 years", emoji: "🌸", value: "8-10" },
  { label: "11–13 years", emoji: "✨", value: "11-13" },
  { label: "Teen+", emoji: "🌟", value: "teen" },
];

const interests = [
  { label: "Crafts & DIY", emoji: "🎨", value: "crafts" },
  { label: "Cute & Kawaii", emoji: "🌸", value: "cute" },
  { label: "Sparkly & Glam", emoji: "💎", value: "glam" },
  { label: "Gross & Gooey", emoji: "🫧", value: "gooey" },
  { label: "Cuddly & Cozy", emoji: "🧸", value: "cozy" },
  { label: "Fun & Surprising", emoji: "🎁", value: "surprising" },
];

const recommendations: Record<string, string[]> = {
  "cute-5-7": ["s3", "st5", "st1"],
  "cute-8-10": ["s5", "st2", "j5"],
  "cute-11-13": ["s6", "j3", "m1"],
  "cute-teen": ["j4", "j3", "m1"],
  "glam-5-7": ["j5", "j6", "j1"],
  "glam-8-10": ["j2", "j3", "j4"],
  "glam-11-13": ["j4", "j2", "j6"],
  "glam-teen": ["j2", "j4", "j6"],
  "gooey-5-7": ["sl4", "sl3", "sl2"],
  "gooey-8-10": ["sl1", "sl5", "sl3"],
  "gooey-11-13": ["sl1", "sl5", "sl6"],
  "gooey-teen": ["sl5", "sl1", "sl6"],
  "cozy-5-7": ["st5", "st1", "st4"],
  "cozy-8-10": ["st3", "st6", "st2"],
  "cozy-11-13": ["st6", "st3", "st4"],
  "cozy-teen": ["st6", "st3", "m2"],
  "crafts-5-7": ["m4", "m3", "s1"],
  "crafts-8-10": ["m3", "m2", "m5"],
  "crafts-11-13": ["m3", "m2", "sl6"],
  "crafts-teen": ["m3", "m2", "m1"],
  "surprising-5-7": ["m4", "s2", "sl3"],
  "surprising-8-10": ["m4", "m6", "sl5"],
  "surprising-11-13": ["m4", "m6", "sl1"],
  "surprising-teen": ["m4", "m5", "m6"],
};

function getRecommendations(interest: string, age: string): typeof products {
  const key = `${interest}-${age}`;
  const ids = recommendations[key] || ["m4", "j3", "st6"];
  return ids.map((id) => products.find((p) => p.id === id)!).filter(Boolean);
}

export default function BirthdayPage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [interest, setInterest] = useState("");
  const [result, setResult] = useState<typeof products | null>(null);
  const [zoeMsg, setZoeMsg] = useState("Tell me about the birthday person and I'll find the perfect gift! 🎂");

  const handleSearch = () => {
    if (!age || !interest) {
      setZoeMsg("Pick an age and what they love, then I'll find the perfect match! 🎁");
      return;
    }
    const recs = getRecommendations(interest, age);
    setResult(recs);
    setZoeMsg(`Perfect! For a ${age} year old who loves ${interests.find(i=>i.value===interest)?.label.toLowerCase()}, I recommend these! 🎂✨`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 relative">
      <div className="relative z-10 px-4 pt-8 pb-32 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/store")}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/30"
          >
            ← Back
          </motion.button>
          <h1 className="text-3xl font-bold text-white">🎂 Birthday Gift Advisor</h1>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 space-y-6">
          {/* Age picker */}
          <div>
            <p className="text-white font-bold mb-3">How old are they turning?</p>
            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map((a) => (
                <motion.button
                  key={a.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAge(a.value)}
                  className={`rounded-2xl p-3 text-left border-2 transition-all ${
                    age === a.value
                      ? "bg-white border-white text-orange-600"
                      : "bg-white/20 border-white/30 text-white"
                  }`}
                >
                  <div className="text-2xl">{a.emoji}</div>
                  <div className="font-medium text-sm mt-1">{a.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Interest picker */}
          <div>
            <p className="text-white font-bold mb-3">What do they love?</p>
            <div className="grid grid-cols-3 gap-2">
              {interests.map((int) => (
                <motion.button
                  key={int.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setInterest(int.value)}
                  className={`rounded-2xl p-3 text-center border-2 transition-all ${
                    interest === int.value
                      ? "bg-white border-white text-orange-600"
                      : "bg-white/20 border-white/30 text-white"
                  }`}
                >
                  <div className="text-2xl">{int.emoji}</div>
                  <div className="text-xs font-medium mt-1">{int.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="w-full bg-white text-orange-600 font-bold py-3 rounded-2xl text-lg shadow-lg"
          >
            Find the perfect gift! 🎁
          </motion.button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <h2 className="text-white font-bold text-xl text-center">Zoé&apos;s top picks 🌟</h2>
              <div className="grid grid-cols-3 gap-4">
                {result.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30"
                  >
                    <div className="text-4xl mb-2">{p.emoji}</div>
                    <p className="text-white font-bold text-sm">{p.name}</p>
                    <p className="text-white/70 text-xs mt-1">{p.description}</p>
                    <p className="text-white font-bold mt-2">${p.price}</p>
                    {i === 0 && (
                      <div className="mt-2 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold px-2 py-0.5">
                        ⭐ Top pick
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ZoeBubble message={zoeMsg} />
    </div>
  );
}
