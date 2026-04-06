"use client";
import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const PRESET_NAMES = [
  "Emma", "Léa", "Chloé", "Sofia", "Alice", "Jade", "Lina",
  "Inès", "Manon", "Zoé", "Louise", "Camille", "Sarah", "Lucie",
];

export default function QRPage() {
  const [name, setName] = useState("");
  const [generated, setGenerated] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const addName = (n: string) => {
    const trimmed = n.trim();
    if (trimmed.length >= 2 && !generated.includes(trimmed)) {
      setGenerated((prev) => [...prev, trimmed]);
    }
    setName("");
  };

  const removeName = (n: string) =>
    setGenerated((prev) => prev.filter((x) => x !== n));

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-pink-900 p-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">🎀 QR Code Generator</h1>
          <p className="text-purple-200 text-sm">Create personal invitations for your guests</p>
        </div>

        {/* Input */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
          <p className="text-white/70 text-sm mb-3">Type a name and press Enter (or pick from presets):</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Guest name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addName(name)}
              className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
              autoFocus
            />
            <button
              onClick={() => addName(name)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-5 py-2 rounded-xl"
            >
              Add
            </button>
          </div>

          {/* Preset chips */}
          <div className="flex flex-wrap gap-2">
            {PRESET_NAMES.map((n) => (
              <button
                key={n}
                onClick={() => addName(n)}
                disabled={generated.includes(n)}
                className="text-sm px-3 py-1 rounded-full border border-white/30 text-white/70 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        {generated.length > 0 && (
          <div className="flex gap-3 mb-6 justify-end">
            <button
              onClick={() => setGenerated([])}
              className="text-white/50 hover:text-white text-sm px-4 py-2 rounded-xl border border-white/20"
            >
              Clear all
            </button>
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg"
            >
              🖨️ Print all QR codes
            </button>
          </div>
        )}

        {/* QR Cards */}
        <div id="print-area" ref={printRef}>
          <div className="grid grid-cols-2 gap-4">
            {generated.map((n) => {
              const url = `${BASE_URL}/?name=${encodeURIComponent(n)}`;
              return (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-5 text-center relative shadow-xl"
                >
                  <button
                    onClick={() => removeName(n)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 print:hidden text-lg leading-none"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                    Invitation for
                  </p>
                  <p className="text-2xl font-bold text-purple-700 mb-4">{n}</p>
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG
                      value={url}
                      size={150}
                      fgColor="#6d28d9"
                      bgColor="#ffffff"
                      level="M"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 break-all">
                    {url}
                  </p>
                  <p className="text-xs text-pink-500 font-semibold mt-2">
                    ✨ Zoé&apos;s Secret Store
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {generated.length === 0 && (
          <div className="text-center text-white/40 py-12">
            <p className="text-4xl mb-3">🎁</p>
            <p>Add names above to generate their QR codes</p>
          </div>
        )}
      </div>
    </div>
  );
}
