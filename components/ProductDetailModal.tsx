"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";

const COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  white: "#94a3b8",
  blue: "#3b82f6",
  green: "#22c55e",
  pink: "#ec4899",
  yellow: "#eab308",
  magenta: "#d946ef",
  gold: "#f59e0b",
  "mixed pink & blue": "#a855f7",
  "mixed blue & gold": "#0ea5e9",
  "mixed red & green": "#84cc16",
};

function colorToHex(name: string, dark = false): string {
  const hex = COLOR_MAP[name.toLowerCase()] ?? "#9333ea";
  return dark ? hex : hex;
}

type Props = {
  product: Product | null;
  light?: boolean;
  onClose: () => void;
  onHeart?: () => void;
};

export default function ProductDetailModal({ product, light = false, onClose, onHeart }: Props) {
  const { isHearted, toggleHeart } = useStore();

  if (!product) return null;

  const hearted = isHearted(product.id);

  const handleHeart = () => {
    if (onHeart) {
      onHeart();
    } else {
      toggleHeart(product.id);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet — slides up from bottom */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden max-h-[92vh] flex flex-col"
            style={{ background: "white" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-gray-600 hover:bg-black/20 transition-colors"
            >
              ✕
            </button>

            {/* All content — no scroll needed */}
            <div className="flex-1 px-5 pt-3 pb-2 flex flex-col gap-3 overflow-hidden">

              {/* Top row: photo + name/description */}
              <div className="flex gap-4 items-start">
                <div
                  className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${product.color}55, ${product.color}22)` }}
                >
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">{product.emoji}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 leading-tight mb-0.5">{product.name}</h2>
                  <span className="text-base font-bold text-pink-500">${product.price}</span>
                  <p className="text-gray-500 text-xs leading-relaxed mt-1">{product.description}</p>
                  <ul className="mt-2 space-y-0.5">
                    {product.details.map((line, i) => (
                      <li key={i} className="text-gray-600 text-xs">{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Color chips */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
                    Available colors
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: colorToHex(c) + "22",
                          borderColor: colorToHex(c) + "88",
                          color: colorToHex(c, true),
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky CTA — always visible */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleHeart}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors shadow-md
                  ${hearted
                    ? "bg-red-500 text-white"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  }`}
              >
                {hearted ? "❤️ Added to Wish List!" : "🤍 Add to Wish List"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
