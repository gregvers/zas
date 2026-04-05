"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { products } from "@/lib/products";
import { getWishlistMessage } from "@/lib/zoe-messages";
import ProductCard from "@/components/ProductCard";
import ZoeBubble from "@/components/ZoeBubble";

export default function WishlistPage() {
  const router = useRouter();
  const { hearts, invited, visitorName } = useStore();
  const [zoeMsg, setZoeMsg] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [colorNote, setColorNote] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const heartedProducts = products.filter((p) => hearts.includes(p.id));

  // Auto-pick the most expensive item as the free gift
  const freeGift = heartedProducts.reduce<typeof heartedProducts[0] | null>(
    (best, p) => (!best || p.price > best.price ? p : best),
    null
  );

  const paidItems = freeGift
    ? heartedProducts.filter((p) => p.id !== freeGift.id)
    : heartedProducts;

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, val: number) =>
    setQuantities((q) => ({ ...q, [id]: Math.max(1, val) }));

  const total = paidItems.reduce((sum, p) => sum + p.price * getQty(p.id), 0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!invited) { router.push("/"); return; }

    if (heartedProducts.length === 0) {
      setZoeMsg(`You haven't hearted anything yet, ${visitorName}! Come back to my store and find what you love.`);
      return;
    }

    const heartedNames = heartedProducts.map((p) => p.name);
    setZoeMsg(
      getWishlistMessage(visitorName, heartedNames, freeGift?.name ?? "", total)
    );

    const t = setTimeout(() => setShowCheckout(true), 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, invited]);

  const handleCheckout = async () => {
    if (checkingOut || !freeGift) return;
    setCheckingOut(true);
    try {
      const allItems = heartedProducts.flatMap((p) => {
        const qty = p.id === freeGift.id ? 1 : getQty(p.id);
        return Array.from({ length: qty }, () => ({ id: p.id, name: p.name, price: p.price, emoji: p.emoji }));
      });
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: allItems,
          freeGiftId: freeGift.id,
          visitorName,
          colorNote: colorNote.trim(),
        }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-rose-900 to-pink-900 relative">
      <div className="relative z-10 px-4 pt-8 pb-32 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/store")}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/30"
          >
            ← Back to Store
          </motion.button>
          <h1 className="text-3xl font-bold text-white">❤️ My Wish List</h1>
        </div>

        {heartedProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">🤍</div>
            <p className="text-white/70 text-lg">No items hearted yet!</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push("/store")}
              className="mt-4 bg-pink-500 text-white rounded-full px-6 py-3 font-bold"
            >
              Explore the store →
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {heartedProducts.map((product) => (
                <motion.div key={product.id} className="relative">
                  <ProductCard product={product} light={false} hidePrice />

                  {freeGift?.id === product.id ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute inset-0 rounded-2xl bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-yellow-400 rounded-full px-3 py-1 text-sm font-bold text-gray-900">
                        FREE GIFT! 🎁
                      </div>
                    </motion.div>
                  ) : (
                    /* Quantity stepper for paid items */
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <button
                          onClick={() => setQty(product.id, getQty(product.id) - 1)}
                          className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-sm flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="text-white text-sm font-bold w-4 text-center">
                          {getQty(product.id)}
                        </span>
                        <button
                          onClick={() => setQty(product.id, getQty(product.id) + 1)}
                          className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {showCheckout && freeGift && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="mt-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden"
                  style={{ margin: "1rem 12px 0", padding: "20px 16px" }}
                >
                  <h2 className="text-white font-bold text-xl mb-4 text-center">🎉 Take everything home?</h2>
                  <div className="space-y-2 mb-4">
                    {heartedProducts.map((p) => (
                      <div key={p.id} className="flex justify-between items-center gap-2 text-sm">
                        <span className="text-white/80 truncate">
                          {p.emoji} {p.name}
                          {p.id !== freeGift.id && getQty(p.id) > 1 && (
                            <span className="text-white/50 ml-1">×{getQty(p.id)}</span>
                          )}
                        </span>
                        <span className="text-white font-medium shrink-0">
                          {p.id === freeGift.id ? (
                            <span className="text-yellow-400 font-bold">FREE 🎁</span>
                          ) : (
                            `$${(p.price * getQty(p.id)).toFixed(2)}`
                          )}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-white/20 pt-2 flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-green-400 font-bold text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Color preference note */}
                  <div className="mb-4">
                    <label className="block text-white/80 text-sm font-medium mb-1">
                      🎨 Any color preference?
                    </label>
                    <textarea
                      value={colorNote}
                      onChange={(e) => setColorNote(e.target.value)}
                      placeholder="e.g. I'd love a pink one if possible!"
                      rows={2}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-purple-400"
                    />
                    <p className="text-white/40 text-xs mt-1">
                      I'll do my best to find your color — but I can't always guarantee it! 🧚
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: checkingOut ? 1 : 1.02 }}
                    whileTap={{ scale: checkingOut ? 1 : 0.98 }}
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg disabled:opacity-70"
                  >
                    {checkingOut ? "Taking you to checkout..." : "Yes! Get them all! 🛍️"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {zoeMsg && <ZoeBubble message={zoeMsg} premium />}
    </div>
  );
}
