"use client";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  light?: boolean;
  hidePrice?: boolean;
  onHeart?: (e: React.MouseEvent) => void; // optional callback so parent can react (e.g. Zoé speaks)
};

export default function ProductCard({ product, light = false, hidePrice = false, onHeart }: Props) {
  const { toggleHeart, isHearted } = useStore();
  const hearted = isHearted(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click from bubbling to detail modal trigger
    if (onHeart) {
      onHeart(e); // parent handles toggle + Zoé reaction
    } else {
      toggleHeart(product.id); // fallback (wishlist page)
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl p-4 flex flex-col items-center gap-3 cursor-default
        ${light ? "bg-white/70 backdrop-blur-sm shadow-md" : "bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"}`}
    >
      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner"
        style={{ background: `linear-gradient(135deg, ${product.color}55, ${product.color}22)` }}
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">{product.emoji}</span>
        )}
      </motion.div>

      <div className="text-center">
        <p className={`font-bold text-sm leading-tight ${light ? "text-gray-800" : "text-white"}`}>
          {product.name}
        </p>
        <p className={`text-xs mt-1 ${light ? "text-gray-500" : "text-white/60"}`}>
          {product.description}
        </p>
        {!hidePrice && (
          <p className={`text-sm font-semibold mt-1 ${light ? "text-gray-700" : "text-white/80"}`}>
            ${product.price}
          </p>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={handleClick}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
          transition-colors shadow-sm
          ${hearted ? "bg-red-500 text-white" : light ? "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400" : "bg-white/20 text-white/50 hover:bg-white/30 hover:text-red-300"}`}
      >
        <motion.span
          animate={hearted ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="text-sm"
        >
          {hearted ? "❤️" : "🤍"}
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
