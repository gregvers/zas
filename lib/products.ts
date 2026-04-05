export type Product = {
  id: string;
  name: string;
  description: string;
  details: string[];   // bullet points shown in the detail view
  colors: string[];    // available colors
  emoji: string;
  image?: string; // e.g. "/products/cat-paw.jpg" — place file in /public/products/
  price: number;
  zone: Zone;
  color: string;
};

export type Zone = "squishy" | "slime";

export const zoneConfig: Record<Zone, {
  label: string;
  emoji: string;
  tagline: string;
  bg: string;
  gradient: string;
  accent: string;
  text: string;
  cardBg: string;
  zoeMessage: string;
}> = {
  squishy: {
    label: "Zoé's Squishy Corner",
    emoji: "🍡",
    tagline: "Soft, cute & impossible to resist",
    bg: "from-pink-200 via-rose-100 to-yellow-100",
    gradient: "from-pink-400 to-rose-400",
    accent: "pink",
    text: "text-pink-700",
    cardBg: "bg-white/60",
    zoeMessage: "Welcome to my Squishy Zone! 🍡 I picked these myself — they're SO satisfying. Heart the ones you love!",
  },
  slime: {
    label: "Zoé's Slime Lab",
    emoji: "🫧",
    tagline: "Gooey, stretchy, totally satisfying",
    bg: "from-teal-900 via-emerald-900 to-cyan-950",
    gradient: "from-teal-400 to-emerald-400",
    accent: "teal",
    text: "text-teal-200",
    cardBg: "bg-teal-900/40",
    zoeMessage: "Welcome to my Slime Zone! 🫧 I handpicked every jar — each one is a little work of art. Which one speaks to you?",
  },
};

export const products: Product[] = [
  // Squishy Zone
  {
    id: "sq-paw",
    name: "Toy Taba Cat Paw",
    description: "Satisfying paw-shaped squeeze toy, comes in surprise colors!",
    details: [
      "🐾 Cute cat paw shape — so satisfying to squeeze",
      "✨ Squishy & slow-rise, stress-relieving fun",
      "📏 Mini size — perfect for pockets & backpacks",
      "🎁 Makes a great party favor or gift",
    ],
    colors: ["Red", "Magenta", "Blue", "Green", "Pink", "Yellow"],
    emoji: "🐾",
    image: "/products/cat-paw.jpg",
    price: 2,
    zone: "squishy",
    color: "#fda4af",
  },
  {
    id: "sq-turtle",
    name: "Mini Turtle Squishy",
    description: "Tiny jelly turtle, ultra squishy & adorable",
    details: [
      "🐢 Transparent jelly body in pastel colors",
      "✨ Super soft and squishy — endlessly squeezable",
      "📏 Tiny size, huge cuteness — fits in your palm",
      "🎁 Makes a great gift or collectible!",
    ],
    colors: ["White", "Magenta", "Blue", "Green", "Pink", "Yellow"],
    emoji: "🐢",
    image: "/products/mini-turtle.jpg",
    price: 2,
    zone: "squishy",
    color: "#86efac",
  },

  // Slime Zone
  {
    id: "sl-galaxy",
    name: "Galaxy Slime",
    description: "Bright swirling colors with a cosmic shimmer",
    details: [
      "✨ Shimmery finish that catches the light",
      "🫧 Smooth, stretchy & super satisfying to play with",
      "👐 Non-sticky formula, safe & easy to handle",
      "🎨 Each jar is unique — no two are exactly alike!",
    ],
    colors: ["Red", "White", "Blue", "Green", "Pink", "Gold", "Mixed Pink & Blue", "Mixed Blue & Gold", "Mixed Red & Green"],
    emoji: "🌌",
    image: "/products/galaxy-slime.jpg",
    price: 2,
    zone: "slime",
    color: "#818cf8",
  },
];
