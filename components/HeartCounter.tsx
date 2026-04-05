"use client";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function HeartCounter() {
  const { hearts } = useStore();
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/wishlist")}
      className="fixed top-5 right-5 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-pink-200"
    >
      <span className="text-lg">❤️</span>
      <span className="font-bold text-gray-800 text-sm">{hearts.length}</span>
      {hearts.length > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs text-pink-600 font-medium"
        >
          wish list
        </motion.span>
      )}
    </motion.button>
  );
}
