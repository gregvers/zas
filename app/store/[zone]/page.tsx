"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { products, zoneConfig, type Zone } from "@/lib/products";
import { getZoneMessage, getZoneHeartMessage } from "@/lib/zoe-messages";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import ZoeBubble from "@/components/ZoeBubble";
import type { Product } from "@/lib/products";
import HeartCounter from "@/components/HeartCounter";
import FloatingParticles from "@/components/FloatingParticles";

const zoneParticles: Record<Zone, string[]> = {
  jewelry: ["💎", "⭐", "✨", "🌟", "💫", "🔮"],
  squishy: ["🍡", "🌸", "🎀", "🍭", "🌈", "💕"],
  slime: ["🫧", "💚", "✨", "🟢", "💦", "🌿"],
  stuffies: ["🧸", "🐻", "💛", "🌟", "🤗", "☁️"],
  misc: ["🌈", "✨", "🎁", "💫", "🪄", "⭐"],
};

export default function ZonePage({ params }: { params: Promise<{ zone: string }> }) {
  const { zone } = use(params);
  const router = useRouter();
  const { invited, hearts, zonesVisited, markZoneVisited, toggleHeart, isHearted } = useStore();
  const [zoeMsg, setZoeMsg] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cfg = zoneConfig[zone as Zone];
  const zoneProducts = products.filter((p) => p.zone === zone);
  const light = zone === "squishy" || zone === "stuffies";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!invited) { router.push("/"); return; }
    if (!cfg) { router.push("/store"); return; }

    const isFirstVisit = !zonesVisited.includes(zone as Zone);
    markZoneVisited(zone as Zone);
    setZoeMsg(getZoneMessage(zone as Zone, isFirstVisit, hearts));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, invited]);

  const handleHeart = (productId: string, productName: string) => {
    const wasHearted = isHearted(productId);
    toggleHeart(productId);
    // Only react when they ADD a heart (not remove)
    if (!wasHearted) {
      const newTotal = hearts.length + 1;
      setZoeMsg(getZoneHeartMessage(productName, newTotal));
    }
  };

  if (!cfg || !mounted) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${cfg.bg} relative`}>
      <FloatingParticles items={zoneParticles[zone as Zone]} count={12} />
      <HeartCounter />

      <div className="relative z-10 px-4 pt-8 pb-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/store")}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/30"
          >
            ← Back
          </motion.button>
          <div>
            <h1 className={`text-3xl font-bold ${light ? "text-gray-800" : "text-white"}`}>
              {cfg.emoji} {cfg.label}
            </h1>
            <p className={`text-sm ${cfg.text} opacity-80`}>{cfg.tagline}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {zoneProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer"
            >
              <ProductCard
                product={product}
                light={light}
                onHeart={(e) => { e.stopPropagation(); handleHeart(product.id, product.name); }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className={`text-sm ${cfg.text} opacity-60 mb-3`}>
            Heart what you love — I have more to show you!
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/store")}
            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-6 py-2 text-sm font-medium"
          >
            See what else I picked →
          </motion.button>
        </motion.div>
      </div>

      {zoeMsg && <ZoeBubble message={zoeMsg} />}

      <ProductDetailModal
        product={selectedProduct}
        light={light}
        onClose={() => setSelectedProduct(null)}
        onHeart={() => {
          if (selectedProduct) handleHeart(selectedProduct.id, selectedProduct.name);
        }}
      />
    </div>
  );
}
